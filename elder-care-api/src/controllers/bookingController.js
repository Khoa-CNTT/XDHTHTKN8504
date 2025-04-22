import Booking from "../models/Booking.js";
import Profile from "../models/Profile.js";
import Schedule from "../models/Schedule.js";
import moment from "moment-timezone";
import Service from "../models/Service.js";

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
            const totalPrice = hoursPerDay * daysDiff * service.price;
            const totalDiscount = totalPrice * service.percentage;

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
                repeatFrom,
                repeatTo,
                timeSlot,
                totalPrice,
                totalDiscount,
                isRecurring // Xác định giá trị này dựa trên repeatFrom và repeatTo
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
                    const schedule = new Schedule({
                        staffId: staff._id,
                        role: staff.role,
                        bookingId: booking._id,
                        patientName: patientName,
                        serviceName: service.name,
                        date: currentDate.clone().toDate(), // Ngày làm việc
                        timeSlots: [
                            {
                                startTime: new Date(new Date(`${currentDate.toISOString().split('T')[0]}T${timeSlot.start}:00`).getTime() + 7 * 60 * 60 * 1000),
                                endTime: new Date(new Date(`${currentDate.toISOString().split('T')[0]}T${timeSlot.end}:00`).getTime() + 7 * 60 * 60 * 1000),
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

            // Chờ tất cả các lịch làm việc được tạo xong
            await Promise.all(schedulePromises);

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
            const { year, month } = req.query;

            if (!year || !month) {
                return res.status(400).json({ message: 'Cần truyền vào năm và tháng' });
            }

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

            const results = bookings.map(booking => ({
                patientName: booking.profileId?.firstName + ' ' + booking.profileId?.lastName,
                // serviceName: booking.serviceId?.name,
                // address: booking.profileId?.address,
                // notes: booking.notes,
                // totalPrice: booking.totalPrice,//
                salary: booking.totalDiscount,
                // isRecurring: booking.isRecurring,
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