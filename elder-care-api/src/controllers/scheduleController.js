import Schedule from "../models/Schedule.js";
import Booking from "../models/Booking.js";
import Profile from "../models/Profile.js";
import moment from "moment";
import Service from "../models/Service.js";
import Doctor from "../models/Doctor.js";
import Nurse from "../models/Nurse.js";

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

// Hàm lấy tên nhân viên dựa vào role
async function getStaffName(staff) {
    if (!staff) {
        return "Chưa phân công";
    }

    if (staff.role === "doctor") {
        const doctor = await Doctor.findOne({ userId: staff._id });
        return doctor ? `${doctor.firstName} ${doctor.lastName}` : "Chưa phân công";
    } else if (staff.role === "nurse") {
        const nurse = await Nurse.findOne({ userId: staff._id });
        return nurse ? `${nurse.firstName} ${nurse.lastName}` : "Chưa phân công";
    }

    return "Chưa phân công";  // Nếu role không phải doctor hoặc nurse
}

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
    },

    getInfoSchedule: async (req, res) => {
        try {
            const { profileId } = req.params;
            if (!profileId) {
                return res.status(400).json({ success: false, message: "Missing profileId" });
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const bookings = await Booking.find({ profileId }).select("_id");

            const bookingIds = bookings.map((b) => b._id);

            if (bookingIds.length === 0) {
                return res.status(200).json({ success: true, data: [] });
            }

            const schedules = await Schedule.find({
                bookingId: { $in: bookingIds },
                date: { $gte: today, $lt: tomorrow }, // Lọc lịch trong ngày hôm nay
            })
                .populate({
                    path: "staffId", 
                    select: "role", 
                })
                .populate({
                    path: "bookingId",
                    populate: {
                        path: "serviceId",
                        select: "name", 
                    },
                })

            // Chuyển đổi dữ liệu thành dạng cần thiết cho response
            const result = [];

            for (const item of schedules) {
                const staffName = await getStaffName(item.staffId);  // Lấy tên từ bảng Doctor hoặc Nurse tùy thuộc vào role

                const serviceName = item.bookingId?.serviceId?.name || "Không rõ dịch vụ";  // Nếu không có dịch vụ thì hiển thị "Không rõ dịch vụ"

                const status = item.status || "Chưa có trạng thái";  // Nếu không có trạng thái thì hiển thị "Chưa có trạng thái"
                result.push({
                    staffName,
                    serviceName,
                    status,
                });
            }

            res.status(200).json({ success: true, data: result });
        } catch (err) {
            console.error("Error:", err);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }
}

export default scheduleController;
