import Booking from "../models/Booking.js";
import Profile from "../models/Profile.js";
import Schedule from "../models/Schedule.js";

const bookingController = {
    // create new booking
    createBooking: async (req, res) => {
        try {
            const { profileId, serviceId, startTime, endTime, status, notes, paymentId, scheduleId, participants } = req.body;

            const { _id: userId, role } = req.user;

            // Bước 1: Kiểm tra xem profileId có thuộc về người dùng hay không
            const profile = await Profile.findById(profileId);
            if (!profile) {
                return res.status(404).json({ message: "Không tìm thấy hồ sơ (profile)" });
            }

            // Kiểm tra quyền của family_member
            if (role === "family_member") {
                if (profile.userId.toString() !== userId.toString()) {
                    return res.status(403).json({ message: "Không có quyền đặt lịch cho profile này" });
                }
            }

            // Kiểm tra startTime và endTime có hợp lệ không
            if (new Date(startTime) >= new Date(endTime)) {
                return res.status(400).json({ message: "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc" });
            }

            // Bước 4: Tạo booking mới
            const newBooking = new Booking({
                profileId,
                serviceId,
                startTime,
                endTime,
                status: status || "pending",
                notes,
                paymentId,
                scheduleId,
                participants
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
            const staff = req.user; // đã xác thực => có thông tin staff

            const booking = await Booking.findById(bookingId);
            if (!booking) {
                return res.status(404).json({ message: 'Đơn đặt lịch không tồn tại' });
            }

            // Cập nhật trạng thái booking
            booking.status = 'accepted';
            booking.acceptedBy = staff._id;
            await booking.save();

            const profile = await Profile.findById(booking.profileId);
            if (!profile) {
                return res.status(404).json({ message: 'Không tìm thấy thông tin bệnh nhân' });
            }

            // Tạo patientName từ firstName và lastName
            const patientName = `${profile.firstName} ${profile.lastName}`;

            // Chuyển đổi startTime thành date và time
            const date = booking.startTime.toISOString().split('T')[0]; // Lấy phần ngày (yyyy-mm-dd)
            const time = booking.startTime.toISOString().split('T')[1].split('.')[0]; // Lấy phần giờ (hh:mm:ss)

            // Tạo lịch làm việc tương ứng
            const schedule = new Schedule({
                staffId: staff._id,
                role: staff.role,
                bookingId: booking._id,
                patientName: patientName, // Lấy tên bệnh nhân từ booking
                date: date,                       // Lấy ngày từ startTime
                time: time,                       // Lấy giờ từ startTime
                status: 'scheduled'               // Trạng thái ban đầu là 'scheduled'
            });

            await schedule.save();

            return res.status(200).json({
                message: 'Đã chấp nhận lịch hẹn và tạo lịch làm việc thành công',
                schedule
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    }
}

export default bookingController;