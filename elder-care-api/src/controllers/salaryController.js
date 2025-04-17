import SalaryRate from "../models/Salary.js";
import moment from "moment";
import Schedule from "../models/Schedule.js";

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
            for (const schedule of completedSchedules) {
                if (schedule.bookingId && schedule.bookingId.serviceId) {
                    totalAmount += schedule.bookingId.serviceId.price || 0;
                }
            }

            // Lấy phần trăm lương của người đó
            const salaryRate = await SalaryRate.findOne({ staffId });
            if (!salaryRate) {
                return res.status(404).json({ message: 'Không tìm thấy thông tin phần trăm lương' });
            }

            const percentage = salaryRate.percentage || 0;
            const salary = (totalAmount * percentage) / 100;

            return res.status(200).json({
                message: 'Tính lương thành công',
                totalServiceAmount: totalAmount,
                percentage,
                salary,
                totalJobs: completedSchedules.length
            });
        } catch (error) {
            console.error('Lỗi tính lương:', error);
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    }
}

export default salaryController;