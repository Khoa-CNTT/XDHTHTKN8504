import Review from "../models/Review.js";
import Schedule from "../models/Schedule.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const reviewController = {
    createReview: async (req, res) => {
        try {
            const { _id: userId } = req.user;
            const { scheduleId } = req.params;
            const { rating, comment } = req.body;

            if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
                return res.status(400).json({ message: "ID lịch làm việc không hợp lệ!" });
            }

            const schedule = await Schedule.findById(scheduleId);
            if (!schedule) {
                return res.status(404).json({ message: "Không tìm thấy lịch làm việc!" });
            }

            const booking = await Booking.findById(schedule.bookingId).populate('profileId');
            if (!booking) {
                return res.status(404).json({ message: "Không tìm thấy thông tin booking!" });
            }

            if (booking.createdBy.toString() !== userId.toString()) {
                return res.status(403).json({ message: "Bạn không có quyền đánh giá lịch này." });
            }

            const profileId = booking.profileId;
            console.log(profileId);
            

            const existingReview = await Review.findOne({
                scheduleId,
                reviewer: userId,
            });

            if (existingReview) {
                return res.status(400).json({ message: "Bạn đã đánh giá lịch này rồi." });
            }

            // Tạo review mới
            const newReview = new Review({
                scheduleId,
                bookingId: booking._id,
                reviewer: profileId,
                staffId: schedule.staffId,
                rating,
                comment,
            });

            await newReview.save();

            return res.status(201).json({
                message: "Thêm mới đánh giá thành công!",
                newReview,
            });

        } catch (error) {
            console.error("Lỗi khi tạo review:", error);
            return res.status(500).json({
                message: "Lỗi khi tạo mới đánh giá",
                error: error.message,
            });
        }
    },

    getReview: async (req, res) => {
        try {
            const { staffId } = req.params;

            const reviews = await Review.find({ staffId }).populate('reviewer');

            return res.status(200).json({
                message: "Đã lấy được tất cả đánh giá của nhân viên",
                reviews
            });

        } catch (error) {
            console.error('Lỗi khi lấy đánh giá:', error);
            return res.status(500).json({
                message: "Lỗi khi lấy đánh giá",
                error: error.message,
            });
        }
    }
};

export default reviewController;