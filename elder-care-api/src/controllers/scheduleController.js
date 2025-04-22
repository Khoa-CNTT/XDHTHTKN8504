import Schedule from "../models/Schedule.js";
import Booking from "../models/Booking.js";
import Profile from "../models/Profile.js";
import moment from "moment";
import Service from "../models/Service.js";

const scheduleController = {
// Truy vấn danh sách công việc đã hoàn thành trong 1 tháng
    getComplatedInMonth: async (req, res) => {
        try {
            const { staffId } = req.params;
            const { year, month } = req.query;

            if (!staffId || !year || !month) {
                return res.status(400).json({ message: 'Cần truyền vào staffId, năm và tháng' });
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

            // Lấy thông tin chi tiết của từng công việc
            for (let schedule of completedSchedules) {
                const staff = schedule.staffId;
                const booking = schedule.bookingId;

                // Nếu không tìm thấy bookingId, bỏ qua
                if (!booking) continue;

                // Lấy thông tin dịch vụ từ booking
                const service = await Service.findById(booking.serviceId);
                const profile = await Profile.findById(booking.profileId);
                const fullName = `${profile.firstName} ${profile.lastName}`;

                // Truyền thông tin chi tiết công việc, bao gồm tên dịch vụ
                jobDetails.push({
                    patientName: profile.firstName + ' ' + profile.lastName,
                    serviceName: service ? service.name : 'Không tìm thấy dịch vụ',
                    address: profile.address,
                    notes: booking.notes,
                    jobDate: schedule.date,
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
            const staffId = req.user._id; // Lấy từ middleware auth

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
}

export default scheduleController;
