import Schedule from "../models/Schedule.js";
import Booking from "../models/Booking.js";
import Profile from "../models/Profile.js";
import moment from "moment";
import Service from "../models/Service.js";

const updateBookingStatus = async (bookingId) => {
    try {
        const schedules = await Schedule.find({ bookingId });

        const allCompleted = schedules.every(schedule => schedule.status === 'completed');

        if (allCompleted) {
            const updatedBooking = await Booking.findByIdAndUpdate(
                bookingId,
                { status: 'completed' },
                { new: true }
            );
            return updatedBooking;
        }

        return null;
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái booking:", error);
        return null;
    }
};

const scheduleController = {
    // Truy vấn danh sách công việc đã hoàn thành trong 1 tháng
    getComplatedInMonth: async (req, res) => {
        try {
            const { _id: staffId } = req.user;
            const { year, month } = req.query;

            if (!year || !month) {
                return res.status(400).json({ message: 'Cần truyền vào năm và tháng' });
            }

            const startOfMonth = moment(`${year}-${month}-01`).startOf('month').toDate();
            const endOfMonth = moment(`${year}-${month}-01`).endOf('month').toDate();

            const completedSchedules = await Schedule.find({
                staffId: staffId,
                status: 'completed',
                date: { $gte: startOfMonth, $lte: endOfMonth }
            }).populate('staffId bookingId');

            if (!completedSchedules || completedSchedules.length === 0) {
                return res.status(404).json({ message: 'Không có công việc hoàn thành trong tháng này' });
            }

            const jobDetails = [];

            for (let schedule of completedSchedules) {
                const booking = schedule.bookingId;

                if (!booking) continue;

                const service = await Service.findById(booking.serviceId);
                const profile = await Profile.findById(booking.profileId);

                jobDetails.push({
                    patientName: profile ? `${profile.firstName} ${profile.lastName}` : 'Không có thông tin bệnh nhân',
                    serviceName: service ? service.name : 'Không tìm thấy dịch vụ',
                    address: profile?.address || '',
                    notes: booking.notes,
                    jobDate: schedule.date,
                    totalPrice: booking.totalDiscount || 0
                });
            }

            return res.status(200).json({
                message: 'Danh sách công việc hoàn thành trong tháng',
                jobDetails
            });
        } catch (error) {
            console.error("Lỗi khi lấy công việc hoàn thành:", error);
            return res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    },

    getAllSchedulesByStaffId: async (req, res) => {
        try {
            const staffId = req.user._id;

            const schedules = await Schedule.find({ staffId })
                .sort({ date: 1, "timeSlots.startTime": 1 });

            return res.status(200).json({
                message: 'Lấy toàn bộ lịch làm việc thành công',
                data: schedules
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Lỗi server',
                error: error.message
            });
        }
    },

    updateScheduleStatus: async (req, res) => {
        try {
            const { _id: staffId } = req.user;
            const { scheduleId } = req.params;  
            const { status } = req.body; 

            // Cập nhật trạng thái của schedule
            const updatedSchedule = await Schedule.findByIdAndUpdate(
                scheduleId,
                { status: status },
                { new: true }  
            );

            if (!updatedSchedule) {
                return res.status(404).json({ message: 'Schedule không tồn tại' });
            }

            // Kiểm tra và cập nhật trạng thái của booking nếu cần
            const updatedBooking = await updateBookingStatus(updatedSchedule.bookingId);

            if (updatedBooking) {
                return res.status(200).json({
                    message: 'Cập nhật trạng thái thành công và booking đã được hoàn thành',
                    schedule: updatedSchedule,
                    booking: updatedBooking
                });
            }

            // Trả về kết quả cập nhật chỉ cho schedule
            res.status(200).json({
                message: 'Cập nhật trạng thái schedule thành công',
                schedule: updatedSchedule
            });

        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            return res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    }
}

export default scheduleController;
