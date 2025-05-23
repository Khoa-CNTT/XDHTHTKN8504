import Booking from "../models/Booking.js";
import Profile from "../models/Profile.js";
import Schedule from "../models/Schedule.js";
import moment from "moment-timezone";
import Service from "../models/Service.js";
import { getIO } from "../config/socketConfig.js";
import { getUserSocketId } from '../controllers/socketController.js';
import Doctor from "../models/Doctor.js";
import Nurse from "../models/Nurse.js";
import Payments from "../models/Payment.js";
import Packages from "../models/Package.js";
import Wallet from "../models/Wallet.js";
import Invoice from "../models/Invoice.js"
import paginate from "../utils/pagination.js";

const bookingController = {
    // create new booking
    createBooking: async (req, res) => {
        const io = getIO();

        try {
            const {
                profileId,
                serviceId,
                status,
                notes,
                paymentId,
                participants,
                repeatInterval,
                repeatFrom,
                repeatTo,
                timeSlot,
            } = req.body;

            const { _id: userId, role } = req.user;

            // Kiểm tra hồ sơ và dịch vụ
            const profile = await Profile.findById(profileId);
            if (!profile) {
                return res.status(404).json({ message: "Không tìm thấy hồ sơ (profile)" });
            }

            const service = await Service.findById(serviceId);
            if (!service) {
                return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
            }

            // Kiểm tra quyền của người dùng
            if ((role === "family_member" || role === "admin") &&
                profile.userId.toString() !== userId.toString()) {
                return res.status(403).json({ message: "Không có quyền đặt lịch cho profile này" });
            }

            // Xử lý ngày và thời gian
            const fromDate = new Date(repeatFrom);
            const toDate = new Date(repeatTo);
            if (fromDate >= toDate) {
                return res.status(400).json({ message: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc" });
            }

            const daysDiff = Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

            const getHoursDiff = (start, end) => {
                const [sh, sm] = start.split(":").map(Number);
                const [eh, em] = end.split(":").map(Number);
                const startMin = sh * 60 + sm;
                const endMin = eh * 60 + em;
                const diff = endMin >= startMin ? endMin - startMin : 24 * 60 - startMin + endMin;
                return diff / 60;
            };

            const hoursPerDay = getHoursDiff(timeSlot.start, timeSlot.end);
            const totalPrice = hoursPerDay * daysDiff * service.price || 0;
            const totalDiscount = totalPrice * (service.percentage || 0);

            // Kiểm tra ví
            const wallet = await Wallet.findOne({ userId });
            if (!wallet) {
                return res.status(400).json({ message: "Không tìm thấy ví của người dùng" });
            }

            if (wallet.balance < totalPrice) {
                return res.status(400).json({ message: "Số dư không đủ để thanh toán booking" });
            }

            // Đánh dấu có phải lịch lặp không
            const isRecurring = fromDate.toDateString() !== toDate.toDateString();

            // Tạo booking
            const newBooking = new Booking({
                profileId,
                serviceId,
                status: status || "pending",
                notes,
                paymentId,
                participants,
                repeatInterval,
                repeatFrom: fromDate,
                repeatTo: toDate,
                timeSlot,
                totalPrice,
                totalDiscount,
                isRecurring,
                createdBy: userId,
            });
            await newBooking.save();

            // Tạo payment
            const code = "PAY_" + Date.now();
            const orderId = "MOMO" + Date.now();
            const newPayment = new Payments({
                orderId,
                bookingId: newBooking._id,
                amount: totalPrice,
                transactionCode: code,
                status: "pending"
            });
            await newPayment.save();

            newBooking.paymentId = newPayment._id;
            await newBooking.save();

            io.to(userId).emit("newPaymentCreated");

            // Trừ tiền ví và tạo transaction
            const transactionId = "PAY_" + Date.now();
            wallet.balance -= totalPrice;
            wallet.transactions.push({
                transactionId,
                type: "PAYMENT",
                amount: totalPrice,
                status: "pending",
                description: `Thanh toán booking ${newBooking._id}`
            });
            await wallet.save();

            // Gửi thông báo tới các staff
            const populatedBooking = await Booking.findById(newBooking._id)
                .populate("serviceId")
                .populate("profileId");

            const targetRole = populatedBooking?.serviceId?.role;
            if (targetRole === "nurse" || targetRole === "doctor") {
                io.to(`staff_${targetRole}`).emit("newBookingSignal", populatedBooking);
            }

            io.to("staff_admin").emit("newBookingCreated", populatedBooking);

            return res.status(201).json({
                message: "Booking created successfully",
                booking: newBooking,
                wallet,
                payment: newPayment,
            });

        } catch (error) {
            console.error("Lỗi khi tạo booking:", error);
            return res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    },

    createBookingByPackage: async (req, res) => {
        try {
            const { _id: userId, role } = req.user;
            const { packageId, profileId, repeatFrom, timeSlot, notes } = req.body;

            // Kiểm tra thông tin đầu vào
            if (!packageId || !profileId || !repeatFrom || !timeSlot?.start) {
                return res.status(400).json({ message: "Thiếu thông tin bắt buộc." });
            }

            // Lấy thông tin gói dịch vụ
            const packageData = await Packages.findById(packageId).populate({
                path: "serviceId",
                select: "_id percentage role", // chọn trường cần thiết
            });
            if (!packageData || !packageData.serviceId) {
                return res.status(400).json({
                    message: "Không tìm thấy service từ package!",
                });
            }

            // Tính ngày kết thúc (repeatTo)
            const repeatFromDate = new Date(repeatFrom);
            const repeatToDate = new Date(repeatFromDate);
            repeatToDate.setDate(
                repeatFromDate.getDate() + (packageData.totalDays - 1)
            );

            // Tính timeSlot.end từ timeSlot.start và package.timeWork
            const [startHour, startMinute] = timeSlot.start.split(":").map(Number);
            const startDate = new Date();
            startDate.setHours(startHour);
            startDate.setMinutes(startMinute);

            const endDate = new Date(startDate);
            endDate.setHours(startDate.getHours() + packageData.timeWork);

            const formattedEnd = endDate.toTimeString().slice(0, 5);

            const finalTimeSlot = {
                start: timeSlot.start,
                end: formattedEnd,
            };

            // Tính giá và giảm giá
            const totalPrice = packageData.price;
            const discountRate = packageData.serviceId?.percentage || 0;
            const totalDiscount = totalPrice * discountRate;

            const wallet = await Wallet.findOne({ userId });
            if (!wallet) {
                return res
                    .status(400)
                    .json({ message: "Không tìm thấy ví của người dùng" });
            }

            if (wallet.balance < totalPrice) {
                return res
                    .status(400)
                    .json({ message: "Số dư không đủ để thanh toán booking" });
            }

            // Tạo booking
            const newBooking = await Booking.create({
                profileId,
                serviceId: packageData.serviceId._id,
                status: "pending",
                notes,
                repeatFrom: repeatFromDate,
                repeatTo: repeatToDate,
                timeSlot: finalTimeSlot,
                repeatInterval: packageData.repeatInterval,
                totalPrice,
                totalDiscount,
                isRecurring: true,
                createdBy: userId,
            });

            const code = "PAY_" + new Date().getTime();
            const orderId = "MOMO" + new Date().getTime();

            const newPayment = new Payments({
                orderId: orderId,
                bookingId: newBooking._id,
                amount: totalPrice,
                transactionCode: code,
            });

            await newPayment.save();

            newBooking.paymentId = newPayment._id;
            await newBooking.save();

            const transactionId = "PAY_" + new Date().getTime();

            // Trừ tiền và tạo transaction trong ví
            wallet.balance -= totalPrice;
            wallet.transactions.push({
                transactionId: code,
                type: "PAYMENT",
                amount: totalPrice,
                status: "pending",
                description: `Thanh toán booking ${newBooking._id}`,
            });
            await wallet.save();

            const io = getIO();

            const populatedBooking = await Booking.findById(newBooking._id)
                .populate("serviceId")
                .populate("profileId");

            const targetRole = populatedBooking?.serviceId?.role;

            if (targetRole === "nurse" || targetRole === "doctor") {
                io.to(`staff_${targetRole}`).emit("newBookingSignal", populatedBooking);
            }

            io.to("staff_admin").emit("newBookingCreated", populatedBooking);
            io.to(userId.toString()).emit("BookingSuccessed", {
                title: "☑️Đặt lịch thành công",
                message: "Bạn đã đặt lịch thành công, chúng tôi sẽ thông báo cho bạn khi có nhân viên y tế chấp nhận!",
            });
            return res.status(201).json({
                message: "Tạo booking theo gói thành công.",
                data: newBooking,
                wallet,
                newPayment,
            });
        } catch (error) {
            console.error("Lỗi tạo booking:", error);
            return res.status(500).json({
                message: "Đã xảy ra lỗi khi tạo booking theo gói.",
                error,
            });
        }
    },

    acceptBooking: async (req, res) => {
        const io = getIO();

        try {
            const { bookingId } = req.params;
            const staff = req.user;

            const booking = await Booking.findById(bookingId);
            if (!booking)
                return res.status(404).json({ message: "Đơn đặt lịch không tồn tại" });

            const service = await Service.findById(booking.serviceId);
            if (!service)
                return res
                    .status(404)
                    .json({ message: "Không tìm thấy dịch vụ liên quan" });

            const profile = await Profile.findById(booking.profileId);
            if (!profile)
                return res
                    .status(404)
                    .json({ message: "Không tìm thấy thông tin bệnh nhân" });

            const patientName = `${profile.firstName} ${profile.lastName}`;
            const timeSlots = Array.isArray(booking.timeSlot)
                ? booking.timeSlot
                : [booking.timeSlot];

            const timeZone = "Asia/Ho_Chi_Minh";

            let currentDate = moment.tz(booking.repeatFrom, timeZone);
            const repeatTo = moment.tz(booking.repeatTo, timeZone);
            const repeatInterval = booking.repeatInterval;
            const schedules = [];

            const add7Hours = (date) => {
                return moment(date).add(7, "hours").toDate();
            };

            while (currentDate <= repeatTo) {
                for (const timeSlot of timeSlots) {
                    const startDateTime = moment.tz(
                        `${currentDate.format("YYYY-MM-DD")}T${timeSlot.start}:00`,
                        "Asia/Ho_Chi_Minh"
                    );
                    const endDateTime = moment.tz(
                        `${currentDate.format("YYYY-MM-DD")}T${timeSlot.end}:00`,
                        "Asia/Ho_Chi_Minh"
                    );

                    // Nếu giờ kết thúc nhỏ hơn giờ bắt đầu (02:00 sáng qua ngày hôm sau), cộng thêm 1 ngày
                    if (endDateTime.isBefore(startDateTime)) {
                        endDateTime.add(1, "days"); // Cộng thêm một ngày cho giờ kết thúc
                    }

                    // Cộng thêm 7 giờ vào thời gian
                    const adjustedStartDateTime = add7Hours(startDateTime);
                    const adjustedEndDateTime = add7Hours(endDateTime);

                    // Kiểm tra trùng lịch
                    const isConflict = await Schedule.findOne({
                        staffId: staff._id,
                        date: {
                            $gte: currentDate.clone().startOf("day").toDate(),
                            $lte: currentDate.clone().endOf("day").toDate(),
                        },
                        "timeSlots.start": { $lt: adjustedEndDateTime },
                        "timeSlots.end": { $gt: adjustedStartDateTime },
                        status: { $ne: "canceled" }
                    });

                    if (isConflict) {
                        return res.status(409).json({
                            message: `Lịch bị trùng vào ngày ${currentDate.format(
                                "DD/MM/YYYY"
                            )} từ ${timeSlot.start} đến ${timeSlot.end}`,
                        });
                    }

                    const schedule = new Schedule({
                        staffId: staff._id,
                        role: staff.role,
                        bookingId: booking._id,
                        patientName,
                        serviceName: service.name,
                        date: currentDate.clone().toDate(),
                        timeSlots: [
                            {
                                start: adjustedStartDateTime,
                                end: adjustedEndDateTime,
                            },
                        ],
                        status: "scheduled",
                    });

                    schedules.push(schedule);
                }

                currentDate.add(repeatInterval, "days");
            }

            // Lưu tất cả schedule và lấy _id
            const savedSchedules = await Promise.all(schedules.map((s) => s.save()));
            const scheduleIds = savedSchedules.map((s) => s._id);

            // Thêm scheduleIds vào booking
            booking.scheduleIds = booking.scheduleIds ? booking.scheduleIds.concat(scheduleIds) : scheduleIds;

            // Cập nhật thông tin booking
            booking.status = "accepted";
            booking.acceptedBy = staff._id;

            const alreadyParticipant = booking.participants.some(
                (p) => p.userId.toString() === staff._id.toString()
            );

            let fullName = "Không rõ";

            if (staff.role === "doctor") {
                const doctor = await Doctor.findOne({ userId: staff._id });
                if (doctor) {
                    fullName = `${doctor.firstName} ${doctor.lastName}`;
                }
            } else if (staff.role === "nurse") {
                const nurse = await Nurse.findOne({ userId: staff._id });
                if (nurse) {
                    fullName = `${nurse.firstName} ${nurse.lastName}`;
                }
            }

            // Thêm participant nếu chưa có
            if (!alreadyParticipant) {
                booking.participants.push({
                    userId: staff._id,
                    role: staff.role,
                    fullName: fullName,
                    acceptedAt: new Date(),
                });
            }

            await booking.save();
            await Promise.all(schedules.map((s) => s.save()));

            // Cập nhật payment và wallet transaction sang success
            const payment = await Payments.findOne({ bookingId: booking._id });
            if (payment) {
                payment.status = "success";
                payment.staffId = staff._id;
                await payment.save();

                // Cập nhật transaction trong ví
                const wallet = await Wallet.findOne({ userId: booking.createdBy });
                if (wallet) {
                    const transaction = wallet.transactions.find(
                        (t) => t.transactionId === payment.transactionCode
                    );
                    if (transaction) {
                        transaction.status = "success";
                        transaction.description +=
                            " - Booking đã được chấp nhận, thanh toán thành công";
                        await wallet.save();
                    }
                }
            }

            const invoiceId = "HD_" + Date.now();
            const newInvoice = new Invoice({
                invoiceId,
                bookingId: booking._id,
                staffId: staff._id,
                totalAmount: booking.totalPrice
            })

            await newInvoice.save();

            // Gửi thông báo socket cho người tạo và tất cả người tham gia
            const allUserIds = new Set([
                booking.createdBy?.toString(),
                ...booking.participants?.map((p) => p.userId?.toString()),
            ]);

            allUserIds.forEach((userId) => {
                const socketId = getUserSocketId(userId);
                console.log(`UserId: ${userId} - SocketId: ${socketId}`);

                if (socketId) {
                    io.to(socketId).emit("bookingAccepted", {
                        bookingId: booking._id,
                        message: "Lịch đặt đã được chấp nhận",
                    });
                } else {
                    console.log(`⚠️ Không tìm thấy socket cho userId: ${userId}`);
                }
            });

            return res.status(200).json({
                message: "Đã chấp nhận lịch hẹn và tạo lịch làm việc thành công",
                schedule: schedules,
                newInvoice
            });
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({ message: "Lỗi server", error: error.message });
        }
    },

    getBookingById: async (req, res) => {
        try {
            const { staffId } = req.user._id;
            const { bookingId } = req.params;

            // Tìm booking theo bookingId
            const booking = await Booking.findById(bookingId)
                .populate("profileId")
                .populate("serviceId");
            if (!booking) {
                return res.status(404).json({ message: "Đơn đặt lịch không tồn tại" });
            }

            // Kiểm tra quyền truy cập
            if (
                booking.staffId &&
                booking.staffId.toString() !== staffId.toString()
            ) {
                return res
                    .status(403)
                    .json({ message: "Bạn không có quyền truy cập vào booking này" });
            }

            console.log("Người dùng từ token:", req.user);

            // Trả về thông tin booking
            return res.status(200).json({
                message: "Lấy thông tin booking thành công",
                booking: booking,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    },

    getCompletedBookings: async (req, res) => {
        try {
            const { _id: staffId } = req.user;
            let { year, month } = req.query;

            // Nếu không có tham số year và month, mặc định lấy năm và tháng hiện tại
            if (!year || !month) {
                const currentDate = moment(); // Lấy thời gian hiện tại
                year = currentDate.year(); // Lấy năm hiện tại
                month = currentDate.month() + 1;
            }

            // Chuyển year, month thành dạng startOf và endOf tháng
            const startOfMonth = moment(`${year}-${month}-01`)
                .startOf("month")
                .toDate();
            const endOfMonth = moment(`${year}-${month}-01`).endOf("month").toDate();

            // Tìm tất cả các booking đã completed trong tháng này, mà staff đó đã tham gia
            const bookings = await Booking.find({
                status: "completed",
                "participants.userId": staffId,
                updatedAt: { $gte: startOfMonth, $lte: endOfMonth },
            }).populate("profileId serviceId");

            if (!bookings.length) {
                return res
                    .status(404)
                    .json({ message: "Không có lịch hoàn thành trong tháng này" });
            }

            // Chuyển dữ liệu thành cấu trúc trả về cho frontend
            const results = bookings.map((booking) => ({
                bookingId: booking._id,
                patientName:
                    booking.profileId?.firstName + " " + booking.profileId?.lastName,
                serviceName: booking.serviceId?.name,
                salary: booking.totalDiscount,
                completedAt: booking.updatedAt,
            }));

            return res.status(200).json({
                message: "Danh sách booking đã hoàn thành trong tháng",
                bookings: results,
            });
        } catch (error) {
            console.error("Lỗi khi lấy booking:", error);
            return res
                .status(500)
                .json({ message: "Lỗi server", error: error.message });
        }
    },

    getBookingForStaff: async (req, res) => {
        try {
            const user = req.user;

            const bookings = await Booking.find().populate({
                path: "serviceId",
                match: { role: user.role }, // chỉ lấy những service đúng vai trò
            });

            // Lọc bỏ các booking mà serviceId bị null (do không match role)
            const filteredBookings = bookings.filter((booking) => booking.serviceId);

            return res.status(200).json({
                message: "Lấy booking theo vai trò thành công!",
                data: filteredBookings,
            });
        } catch (error) {
            console.error("Lỗi khi lấy booking:", error);
            return res
                .status(500)
                .json({ message: "Lỗi server", error: error.message });
        }
    },

    getBookingForCustomer: async (req, res) => {
        try {
            const user = req.user;

            const bookings = await Booking.find({ createdBy: user._id })
                .populate("serviceId")
                .populate("profileId")
                .populate({
                  path: "participants.userId", // Đây là key quan trọng
                  select: "avatar", // Chọn các field bạn muốn
                });

            if (!bookings || bookings.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy booking nào" });
            }

            return res.status(200).json({
                message: "Lấy booking cho khách hàng thành công!",
                data: bookings,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    },

    countBookingsLast12Months: async (req, res) => {
        try {
            const now = new Date();
            const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1); // Đầu tháng cách đây 11 tháng

            const result = await Booking.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate },
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: { "_id.year": 1, "_id.month": 1 },
                },
            ]);

            // Tạo danh sách 12 tháng gần nhất
            const labels = [];
            const datas = [];

            for (let i = 0; i < 12; i++) {
                const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
                const year = d.getFullYear();
                const month = d.getMonth() + 1;

                const found = result.find(
                    (r) => r._id.year === year && r._id.month === month
                );
                labels.push(`${month < 10 ? "0" + month : month}/${year}`);
                datas.push(found ? found.datas : 0);
            }

            return res.status(200).json({
                datas,
            });
        } catch (err) {
            console.error("Lỗi khi đếm booking 12 tháng:", err);
            res.status(500).json({ message: "Server error", error: err });
        }
    },

    getAllBookings: async (req, res) => {
        try {
            const page = req.query.page || 1;
            const limit = 10;
            const sort = { createdAt: -1 }; // mới nhất lên đầu
            const filter = {}; // bạn có thể thêm điều kiện lọc từ req.query

            const result = await paginate(Booking, filter, {
                page,
                limit,
                sort,
                populate: ['profileId', 'serviceId'],
            });

            return res.status(200).json({
                message: "Lấy booking thành công",
                bookings: result.docs,
                pagination: {
                    totalDocs: result.totalDocs,
                    totalPages: result.totalPages,
                    currentPage: result.currentPage,
                    perPage: result.perPage,
                },
            });
        } catch (error) {
            console.error("Lỗi khi lấy booking:", error);
            return res.status(500).json({
                message: "Lỗi server",
                error: error.message,
            });
        }
    },

    canceledBooking: async (req, res) => {
        try {
            const { _id: userId } = req.user;
            const { bookingId } = req.params;

            const booking = await Booking.findById(bookingId);

            if (!booking) {
                return res.status(404).json({ message: "Không tìm thấy booking" });
            }

            if (userId.toString() !== booking.createdBy.toString()) {
                return res
                    .status(403)
                    .json({ message: "Bạn không có quyền hủy booking này" });
            }

            if (booking.status === "completed" || booking.status === "cancelled") {
                return res
                    .status(400)
                    .json({ message: "Booking đã được xử lý hoặc đã bị hủy trước đó" });
            }

            if (booking.status === "pending") {
                booking.status = "cancelled";
                await booking.save();
            }

            res.status(200).json({ message: "Hủy booking thành công", booking });
        } catch (error) {
            console.error("Lỗi khi hủy booking:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },
    cancelBookingForUser: async (req, res) => {
        const io = getIO();
        const { bookingId } = req.params;

        try {
            const booking = await Booking.findById(bookingId);
            if (!booking) {
                return res.status(404).json({ message: "Booking không tồn tại." });
            }

            // Kiểm tra trạng thái cho phép hủy
            if (!["pending", "accepted"].includes(booking.status)) {
                return res.status(400).json({
                    message: "Chỉ được hủy khi trạng thái là 'pending' hoặc 'accepted'.",
                });
            }

            // Kiểm tra trạng thái của tất cả các Schedule liên quan
            const schedules = await Schedule.find({ bookingId });
            const allScheduled = schedules.every((s) => s.status === "scheduled");

            if (!allScheduled) {
                return res.status(400).json({
                    message:
                        "Không thể hủy. Một trong các lịch đã được thực hiện hoặc thay đổi trạng thái.",
                });
            }

            // Cập nhật trạng thái booking
            booking.status = "cancelled";
            await booking.save();

            // Optional: cập nhật trạng thái schedule thành canceled
            await Schedule.updateMany(
                { bookingId },
                { $set: { status: "canceled" } }
            );

            // --- Bắt đầu cập nhật Wallet ---
            const wallet = await Wallet.findOne({ userId: booking.createdBy });
            if (!wallet) {
                return res
                    .status(404)
                    .json({ message: "Wallet của người dùng không tồn tại." });
            }

            const refundAmount = booking.totalPrice || 0; // Giá trị hoàn tiền

            // Tạo transaction hoàn tiền
            const newTransaction = {
                transactionId: `REFUND_${booking._id}`, // tạo id transaction ngẫu nhiên
                type: "REFUND", // bạn có thể thêm 'REFUND' vào enum type nếu muốn
                amount: refundAmount,
                status: "success",
                description: `Hoàn tiền hủy booking #${booking._id}`,
                date: new Date(),
            };

            wallet.balance += refundAmount; // cộng tiền lại
            wallet.transactions.push(newTransaction);

            await wallet.save();
            // --- Kết thúc cập nhật Wallet ---
            io.to(booking.createdBy.toString()).emit("refundWallet", {
                message:
                    "Hủy đặt lịch thành công, tiền của bạn sẽ được hoàn lại trong ví.",
                balance: wallet.balance,
                transactions: wallet.transactions,
            });
            if (booking.participants?.length > 0) {
              booking.participants.forEach((participant) => {
                io.to(participant.userId.toString()).emit("bookingCancelled", {
                  message: `Booking #${booking._id} đã bị hủy.`,
                  bookingId: booking._id,
                });
              });
            }

            return res.status(200).json({
                message: "Hủy lịch hẹn thành công và cập nhật ví hoàn tiền.",
                booking,
                wallet,
            });
        } catch (error) {
            console.error("Lỗi khi hủy booking:", error);
            return res
                .status(500)
                .json({ message: "Lỗi hệ thống khi hủy lịch hẹn." });
        }
    },

    getCompletedPatients: async (req, res) => {
        try {
            const { _id: adminId } = req.user;

            const bookings = await Booking.find({ status: "completed" })
                .populate("profileId")
                .populate("createdBy", "phone")
                .sort({ updatedAt: -1 });

            // Lấy danh sách bệnh nhân không trùng lặp
            const uniqueProfiles = [];
            const profileIds = new Set();

            bookings.forEach((booking) => {
                const profile = booking.profileId;
                if (profile && !profileIds.has(profile._id.toString())) {
                    uniqueProfiles.push({
                        ...profile.toObject(),
                        bookedByPhone: booking.createdBy?.phone || "",
                        bookingDate: booking.updatedAt,
                    });
                    profileIds.add(profile._id.toString());
                }
            });

            res.status(200).json({ patients: uniqueProfiles });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách bệnh nhân:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    deleteBookingById: async (req, res) => {
        try {
            const { userId } = req.user;
            const { bookingId } = req.params;

            const deleteBooking = await Booking.findByIdAndDelete({ _id: bookingId });

            if (!deleteBooking) {
                return res.status(404).json({
                    message: "Không tìm thấy booking",
                });
            }

            return res.status(200).json({
                message: "Xóa booking thành công!",
                booking: deleteBooking,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Lỗi khi xóa booking",
                error,
            });
        }
    },

    deleteAllBookings: async (req, res) => {
        try {
            await Booking.deleteMany();
            return res
                .status(200)
                .json({ message: "Tất cả bookings đã được xoá thành công." });
        } catch (error) {
            console.error("Lỗi khi xóa booking:", error);
            return res
                .status(500)
                .json({ message: "Lỗi server", error: error.message });
        }
    },

    countBookingsPerMonthLast12Months: async (req, res) => {
        try {
            const now = new Date();
            const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);

            // Lấy số lượng booking mỗi tháng trong 12 tháng gần nhất
            const result = await Booking.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate },
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: { "_id.year": 1, "_id.month": 1 },
                },
            ]);

            // Chuẩn hóa dữ liệu trả về đủ 12 tháng
            const labels = [];
            const counts = [];
            for (let i = 0; i < 12; i++) {
                const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
                const year = d.getFullYear();
                const month = d.getMonth() + 1;
                const found = result.find(
                    (r) => r._id.year === year && r._id.month === month
                );
                labels.push(`${month < 10 ? "0" + month : month}/${year}`);
                counts.push(found ? found.count : 0);
            }

            return res.status(200).json({
                labels,
                counts,
            });
        } catch (error) {
            console.error("Lỗi khi đếm booking 12 tháng:", error);
            return res
                .status(500)
                .json({ message: "Server error", error: error.message });
        }
    },

    getBookingForCustomer2: async (req, res) => {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({ message: "Thiếu userId trong params" });
            }

            const bookings = await Booking.find({ createdBy: userId }).populate(
                "serviceId"
            );

            if (!bookings || bookings.length === 0) {
                return res
                    .status(404)
                    .json({ message: "Không tìm thấy booking nào cho userId này" });
            }

            const filteredBookings = bookings.filter((booking) => booking.serviceId);

            return res.status(200).json({
                message: "Lấy booking theo userId thành công!",
                data: filteredBookings,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    },

    getBookingDetail: async (req, res) => {
        try {
            const { bookingId } = req.params;

            if (!bookingId) {
                return res.status(400).json({ message: "Thiếu bookingId trong params" });
            }

            const booking = await Booking.findById(bookingId)
                .populate('profileId')
                .populate('serviceId')
                .populate('participants.userId', 'firstName lastName role')
                .populate('paymentId')

            if (!booking) {
                return res.status(404).json({ message: "Không tìm thấy booking" });
            }

            return res.status(200).json({
                message: "Lấy chi tiết booking thành công",
                booking
            });
        } catch (error) {
            return res.status(500).json({
                error
            })
        }
    },

    getBookingForParticipant: async (req, res) => {
        try {
            const userId = req.user._id;
            if (!userId) {
                return res.status(400).json({ message: "Thiếu userId" });
            }

            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const firstDayOfNextMonth = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                1
            );

            const bookings = await Booking.find({
                "participants.userId": userId,
                createdAt: { $gte: firstDayOfMonth, $lt: firstDayOfNextMonth }, // lọc tháng hiện tại
            }).populate("serviceId profileId");

            return res.status(200).json({
                message: "Lấy booking thành công!",
                data: bookings,
            });
        } catch (error) {
            console.error("Lỗi khi lấy booking:", error);
            return res
                .status(500)
                .json({ message: "Lỗi server", error: error.message });
        }
    },
};

export default bookingController;