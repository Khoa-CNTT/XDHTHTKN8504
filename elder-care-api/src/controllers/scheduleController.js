import Schedule from "../models/Schedule.js";
import Booking from "../models/Booking.js";
import Profile from "../models/Profile.js";

const scheduleController = {
    //Get schedule by bookingId
    getScheduleByBookingId: async (req, res) => {
        try {
            console.log(req.params); // Log the request parameters
            
            const { _id } = req.params; 
            console.log("Received scheduleId:", _id); // Log received scheduleId

            const schedule = await Schedule.findById(_id).populate('bookingId');
            console.log("Schedule found:", schedule); // Log schedule if found
            if (!schedule) {
                return res.status(404).json({
                    message: "Lịch hẹn không tồn tại"
                });
            }

            const booking = schedule.bookingId;
            if (!booking) {
                return res.status(404).json({ message: 'Không tìm thấy đơn đặt lịch' });
            }

            const profileId = booking.profileId;

            // Truy vấn thông tin Profile của bệnh nhân
            const patientProfile = await Profile.findById(profileId);
            if (!patientProfile) {
                return res.status(404).json({ message: 'Không tìm thấy hồ sơ bệnh nhân' });
            }

            return res.status(200).json({
                message: 'Thông tin hồ sơ bệnh nhân',
                patientProfile
            });
        } catch (error) {
            console.error("Lỗi khi lấy lịch hẹn:", error);
            res.status(500).json({ message: "Lỗi server" });
        }
    },
}

export default scheduleController;
