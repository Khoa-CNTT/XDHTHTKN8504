import SalaryRate from "../models/Salary.js";
import moment from "moment";
import Schedule from "../models/Schedule.js";
import Service from "../models/Service.js";

const salaryController = {
    // Tính tổng lương tháng cho bác sĩ hoặc điều dưỡng
    getMonthSalary: async (req, res) => {
        try {
            const { staffId, month, year } = req.query;

            if (!staffId || !month || !year) {
                return res.status(400).json({ message: 'Thiếu thông tin staffId, month hoặc year' });
            }

            const startOfMonth = moment.utc(`${year}-${month}-01`).startOf('month');
            const endOfMonth = moment.utc(`${year}-${month}-01`).endOf('month');

            // Lấy các lịch đã hoàn thành trong tháng đó
            const completedSchedules = await Schedule.find({
                staffId: staffId,
                status: 'completed',
                date: { $gte: startOfMonth.toDate(), $lte: endOfMonth.toDate() }
            }).populate({
                path: 'bookingId',
                populate: { path: 'serviceId' }
            });

            // Tính tổng tiền dịch vụ từ các booking
            let totalAmount = 0;
            let totalSalary = 0;

            for (const schedule of completedSchedules) {
                if (schedule.bookingId && schedule.bookingId.serviceId) {
                    const service = schedule.bookingId.serviceId;
                    totalAmount += service.price || 0;
                    // Tính phần trăm hoa hồng từ dịch vụ
                    const commission = (service.price * service.commissionPercentage) / 100;
                    totalSalary += commission; // Lương là phần trăm hoa hồng của dịch vụ
                }
            }

            return res.status(200).json({
                message: 'Tính lương thành công',
                totalServiceAmount: totalAmount,
                totalSalary,
                totalJobs: completedSchedules.length
            });
        } catch (error) {
            console.error('Lỗi tính lương:', error);
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    }
}

export default salaryController;