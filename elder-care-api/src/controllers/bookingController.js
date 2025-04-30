import Booking from "../models/Booking.js";
import Profile from "../models/Profile.js";
import Schedule from "../models/Schedule.js";
import moment from "moment-timezone";
import Service from "../models/Service.js";
import { getIO } from "../config/socketConfig.js";
import { getUserSocketId } from '../controllers/socketController.js';

const bookingController = {
    // create new booking
    createBooking: async (req, res) => {
        try {
            const {
                profileId,
                serviceId,
                status,
                notes,
                paymentId,
                participants,
                repeatFrom,
                repeatTo,
                timeSlot
            } = req.body;

            const { _id: userId, role } = req.user;

            // Kiểm tra profile
            const profile = await Profile.findById(profileId);
            if (!profile) {
                return res.status(404).json({ message: "Không tìm thấy hồ sơ (profile)" });
            }

            const service = await Service.findById(serviceId);
            if (!service) {
                return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
            }

            // Kiểm tra quyền của family_member
            if (role === "family_member" || role === "admin") {
                if (profile.userId.toString() !== userId.toString()) {
                    return res.status(403).json({ message: "Không có quyền đặt lịch cho profile này" });
                }
            }

            // Kiểm tra thời gian lặp lại
            const fromDate = new Date(repeatFrom);
            const toDate = new Date(repeatTo);

            console.log("From Date:", fromDate);
            console.log("To Date:", toDate);

            if (fromDate >= toDate) {
                return res.status(400).json({ message: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc" });
            }

            // Tính số ngày
            const daysDiff = Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

            // Tính số giờ mỗi ngày (có xử lý qua đêm)
            const getHoursDiff = (start, end) => {
                const [sh, sm] = start.split(":").map(Number);
                const [eh, em] = end.split(":").map(Number);
                const startMin = sh * 60 + sm;
                const endMin = eh * 60 + em;
                const diff = endMin >= startMin ? endMin - startMin : 24 * 60 - startMin + endMin;
                return diff / 60;
            };

            const hoursPerDay = getHoursDiff(timeSlot.start, timeSlot.end);

            // Tổng tiền
            const totalPrice = hoursPerDay * daysDiff * service.price || 0;
            const totalDiscount = totalPrice * (service.percentage || 0);

            // Xác định nếu là lịch lặp lại
            const isRecurring = new Date(repeatFrom).toDateString() !== new Date(repeatTo).toDateString();

            // Tạo booking mới (không có scheduleId vì sẽ tạo sau)
            const newBooking = new Booking({
                profileId,
                serviceId,
                status: status || "pending",
                notes,
                paymentId,
                participants,
                repeatFrom: fromDate,  // Lưu thời gian đã chuyển sang múi giờ đúng
                repeatTo: toDate,      // Lưu thời gian đã chuyển sang múi giờ đúng
                timeSlot,
                totalPrice,
                totalDiscount,
                isRecurring,
                createdBy: userId,
            });

            await newBooking.save();
            return res.status(201).json({
                message: "Booking created successfully",
                booking: newBooking,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    },

    acceptBooking: async (req, res) => {
        const io = getIO();
        try {
            const { bookingId } = req.params;
            const staff = req.user;

            // Tìm booking theo bookingId
            const booking = await Booking.findById(bookingId);
            if (!booking) {
                return res.status(404).json({ message: 'Đơn đặt lịch không tồn tại' });
            }

            // Lấy thông tin service qua booking.serviceId
            const service = await Service.findById(booking.serviceId);
            if (!service) {
                return res.status(404).json({ message: 'Không tìm thấy dịch vụ liên quan' });
            }

            const profile = await Profile.findById(booking.profileId);
            if (!profile) {
                return res.status(404).json({ message: 'Không tìm thấy thông tin bệnh nhân' });
            }

            // Tạo patientName từ firstName và lastName
            const patientName = `${profile.firstName} ${profile.lastName}`;

            // Kiểm tra kiểu của timeSlot và xử lý tương ứng
            const timeSlots = Array.isArray(booking.timeSlot) ? booking.timeSlot : [booking.timeSlot];

            // Lặp qua các ngày trong thời gian khách hàng đã đặt (repeatFrom và repeatTo)
            const schedulePromises = [];

            const timeZone = 'Asia/Ho_Chi_Minh'; // Múi giờ của Việt Nam (GMT+7)
            let currentDate = moment.tz(booking.repeatFrom, timeZone);

            while (currentDate <= new Date(booking.repeatTo)) {
                // Lặp qua các thời gian của mỗi ngày
                timeSlots.forEach(timeSlot => {
                    const startDateTime = moment.tz(
                        `${currentDate.format('YYYY-MM-DD')}T${timeSlot.start}:00`,
                        timeZone
                    );

                    const endDateTime = moment.tz(
                        `${currentDate.format('YYYY-MM-DD')}T${timeSlot.end}:00`,
                        timeZone
                    );

                    const schedule = new Schedule({
                        staffId: staff._id,
                        role: staff.role,
                        bookingId: booking._id,
                        patientName: patientName,
                        serviceName: service.name,
                        date: currentDate.clone().toDate(), // Ngày làm việc
                        timeSlots: [
                            {
                                start: startDateTime.toDate(), // Chuyển đổi về Date
                                end: endDateTime.toDate()      // Chuyển đổi về Date
                            }
                        ],
                        status: 'scheduled',
                    });

                    schedulePromises.push(schedule.save());
                });

                // Tiến sang ngày tiếp theo
                currentDate.add(1, 'days');
            }

            // Cập nhật trạng thái booking
            booking.status = 'accepted';
            booking.acceptedBy = staff._id;

            // Kiểm tra nếu người staff đã nằm trong participants chưa
            const alreadyParticipant = booking.participants.some(participant =>
                participant.userId.toString() === staff._id.toString()
            );

            if (!alreadyParticipant) {
                booking.participants.push({
                    userId: staff._id,
                    role: staff.role,
                    acceptedAt: new Date(),
                });
            }

            await booking.save();
            await Promise.all(schedulePromises);

            // Gửi thông báo cho khách hàng
            const customerId = booking.createdBy.toString();
            const socketId = getUserSocketId(customerId);
            if (socketId) {
                io.to(socketId).emit("bookingAccepted", {
                    bookingId,
                    message: "Booking của bạn đã được chấp nhận"
                });
            }

            // Gửi thông báo tới nhân viên tham gia (doctor/nurse)
            booking.participants.forEach((p) => {
                const staffSocketId = getUserSocketId(p.userId.toString());
                if (staffSocketId) {
                    io.to(staffSocketId).emit("bookingAccepted", {
                        bookingId,
                        message: "Bạn đã được phân công vào booking mới"
                    });
                }
            });

            return res.status(200).json({
                message: 'Đã chấp nhận lịch hẹn và tạo lịch làm việc thành công',
                schedule: schedulePromises,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    },

    getBookingById: async (req, res) => {
        try {
            const { staffId } = req.user._id;
            const { bookingId } = req.params;

            // Tìm booking theo bookingId
            const booking = await Booking.findById(bookingId).populate("profileId").populate("serviceId");
            if (!booking) {
                return res.status(404).json({ message: 'Đơn đặt lịch không tồn tại' });
            }

            // Kiểm tra quyền truy cập
            if (booking.staffId && booking.staffId.toString() !== staffId.toString()) {
                return res.status(403).json({ message: 'Bạn không có quyền truy cập vào booking này' });
            }

            console.log("Người dùng từ token:", req.user);

            // Trả về thông tin booking
            return res.status(200).json({
                message: 'Lấy thông tin booking thành công',
                booking: booking,
            })
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
                const currentDate = moment();  // Lấy thời gian hiện tại
                year = currentDate.year();     // Lấy năm hiện tại
                month = currentDate.month() + 1; // Lấy tháng hiện tại (lưu ý moment tháng bắt đầu từ 0, vì vậy cộng thêm 1)
            }

            // Chuyển year, month thành dạng startOf và endOf tháng
            const startOfMonth = moment(`${year}-${month}-01`).startOf('month').toDate();
            const endOfMonth = moment(`${year}-${month}-01`).endOf('month').toDate();

            // Tìm tất cả các booking đã completed trong tháng này, mà staff đó đã tham gia
            const bookings = await Booking.find({
                status: 'completed',
                'participants.userId': staffId,
                updatedAt: { $gte: startOfMonth, $lte: endOfMonth },
            }).populate('profileId serviceId');

            if (!bookings.length) {
                return res.status(404).json({ message: 'Không có lịch hoàn thành trong tháng này' });
            }

            // Chuyển dữ liệu thành cấu trúc trả về cho frontend
            const results = bookings.map((booking) => ({
                bookingId: booking._id,
                patientName: booking.profileId?.firstName + " " + booking.profileId?.lastName,
                serviceName: booking.serviceId?.name,
                salary: booking.totalDiscount,
                completedAt: booking.updatedAt,
            }));

            return res.status(200).json({
                message: 'Danh sách booking đã hoàn thành trong tháng',
                bookings: results,
            });

        } catch (error) {
            console.error("Lỗi khi lấy booking:", error);
            return res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    }
}

export default bookingController;