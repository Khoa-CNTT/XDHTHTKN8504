import mongoose from "mongoose";
import Schedule from "../models/Schedule.js";
import Booking from "../models/Booking.js";
import Profile from "../models/Profile.js";
import moment from "moment";
import moment2 from "moment-timezone";
import Service from "../models/Service.js";
import Doctor from "../models/Doctor.js";
import Nurse from "../models/Nurse.js";
import { getIO } from "../config/socketConfig.js";
import dayjs from "dayjs";

const updateBookingStatus = async (bookingId) => {
  try {
    if (!bookingId) {
      console.warn("⚠️ bookingId không tồn tại");
      return null;
    }

    console.log("🔍 Đang kiểm tra schedules với bookingId:", bookingId);
    const schedules = await Schedule.find({ bookingId });

    const allCompleted = schedules.every(
      (schedule) => schedule.status === "completed"
    );
    console.log("✅ allCompleted:", allCompleted);

    if (allCompleted) {
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: "completed" },
        { new: true }
      );
      console.log("✅ Booking đã cập nhật:", updatedBooking);
      return updatedBooking;
    }

    return null;
  } catch (error) {
    console.error("🔥 Lỗi khi cập nhật trạng thái booking:", error);
    return null;
  }
};

// Hàm lấy tên nhân viên dựa vào role ththth
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
        return res.status(400).json({ message: "Cần truyền vào năm và tháng" });
      }

      const startOfMonth = moment(`${year}-${month}-01`)
        .startOf("month")
        .toDate();
      const endOfMonth = moment(`${year}-${month}-01`).endOf("month").toDate();

      const completedSchedules = await Schedule.find({
        staffId: staffId,
        status: "completed",
        date: { $gte: startOfMonth, $lte: endOfMonth },
      }).populate("staffId bookingId");

      if (!completedSchedules || completedSchedules.length === 0) {
        return res
          .status(404)
          .json({ message: "Không có công việc hoàn thành trong tháng này" });
      }

      const jobDetails = [];

      for (let schedule of completedSchedules) {
        const booking = schedule.bookingId;

        if (!booking) continue;

        const service = await Service.findById(booking.serviceId);
        const profile = await Profile.findById(booking.profileId);

        jobDetails.push({
          patientName: profile
            ? `${profile.firstName} ${profile.lastName}`
            : "Không có thông tin bệnh nhân",
          serviceName: service ? service.name : "Không tìm thấy dịch vụ",
          address: profile?.address || "",
          notes: booking.notes,
          jobDate: schedule.date,
          totalPrice: booking.totalDiscount || 0,
        });
      }

      return res.status(200).json({
        message: "Danh sách công việc hoàn thành trong tháng",
        jobDetails,
      });
    } catch (error) {
      console.error("Lỗi khi lấy công việc hoàn thành:", error);
      return res
        .status(500)
        .json({ message: "Lỗi server", error: error.message });
    }
  },

  getAllSchedulesByStaffId: async (req, res) => {
    try {
      const staffId = req.user._id;

      const schedules = await Schedule.find({ staffId }).sort({
        date: 1,
        "timeSlots.start": 1,
      });

      return res.status(200).json({
        message: "Lấy toàn bộ lịch làm việc thành công",
        data: schedules,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Lỗi server",
        error: error.message,
      });
    }
  },

  updateScheduleStatus: async (req, res) => {
    const io = getIO();
    try {
      const { _id } = req.user;
      const { scheduleId } = req.params;
      const { status } = req.body;

      // Cập nhật trạng thái schedule
      const updatedSchedule = await Schedule.findByIdAndUpdate(
        scheduleId,
        { status: status },
        { new: true }
      );

      if (!updatedSchedule) {
        return res.status(404).json({ message: "Schedule không tồn tại" });
      }

      // Cập nhật trạng thái booking nếu cần
      const updatedBooking = await updateBookingStatus(
        updatedSchedule.bookingId
      );


      // Thay đổi: Emit vào phòng có tên là `schedule_${scheduleId}`
            io.to(`schedule_${scheduleId}`).emit("scheduleStatusUpdated", {
                message: "Lịch hẹn của bạn đã được cập nhật",
                scheduleId: updatedSchedule._id,
                newStatus: updatedSchedule.status,
                bookingId: updatedSchedule.bookingId,
                bookingStatus: updatedBooking?.status || null,
              });
          

      return res.status(200).json({
        message: updatedBooking
          ? "Cập nhật trạng thái thành công và booking đã được hoàn thành"
          : "Cập nhật trạng thái schedule thành công",
        schedule: updatedSchedule,
        booking: updatedBooking || null,
      });
    } catch (error) {
      console.error("🔥 Lỗi khi cập nhật trạng thái:", error);
      return res
        .status(500)
        .json({ message: "Lỗi server", error: error.message });
    }
  },

  getInfoSchedule: async (req, res) => {
    try {
      const { profileId } = req.params;
      if (!profileId) {
        return res
          .status(400)
          .json({ success: false, message: "Missing profileId" });
      }

      const today = moment2.tz("Asia/Ho_Chi_Minh").startOf("day");
      const tomorrow = today.clone().add(1, "days");

      const bookings = await Booking.find({ profileId }).select("_id");
      const bookingIds = bookings.map((b) => b._id);

      if (bookingIds.length === 0) {
        return res.status(200).json({ success: true, data: [] });
      }

      const schedules = await Schedule.find({
        bookingId: { $in: bookingIds },
        date: {
          $gte: tomorrow.toDate(),
          $lt: tomorrow.clone().add(1, "days").toDate(),
        },
      })
        .populate({
          path: "staffId", // Populate staffId
          select: "role userId", // Lấy role và userId từ staffId
          populate: {
            path: "userId", // Populate userId trong staffId
            select: "avatar", // Lấy avatar từ User
            strictPopulate: false, // Bỏ qua kiểm tra strictPopulate
          },
        })
        .populate({
          path: "bookingId",
          populate: {
            path: "serviceId",
            select: "name",
          },
        });

      const result = [];

      for (const item of schedules) {
        const staffName = await getStaffName(item.staffId);
        const staffAvatar = item.staffId?.userId?.avatar || ""; // Lấy avatarUrl từ userId trong staff

        const serviceName =
          item.bookingId?.serviceId?.name || "Không rõ dịch vụ";

        const timeSlots = Array.isArray(item.timeSlots)
          ? item.timeSlots
              .filter((slot) => slot.start && slot.end)
              .map((slot) => ({
                start: moment2(slot.start).tz("Asia/Ho_Chi_Minh").toISOString(),
                end: moment2(slot.end).tz("Asia/Ho_Chi_Minh").toISOString(),
              }))
          : [];

        const status = item.status || "Chưa có trạng thái";
        result.push({
          staffName,
          staffAvatar, // Trả về avatarUrl của staff
          serviceName,
          status,
          timeSlots,
        });
      }

      res.status(200).json({ success: true, data: result });
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },

  getNextScheduleForStaff: async (req, res) => {
    const staffId = req.user._id;
    if (!staffId) {
      return res.status(400).json({ error: "staffId is required" });
    }

    const now = new Date();

    try {
      // 1. Lấy lịch hiện tại
      let schedule = await Schedule.findOne({
        staffId,
        timeSlots: {
          $elemMatch: {
            start: { $lte: now },
            end: { $gte: now },
          },
        },
      });

      // 2. Nếu không có, tìm lịch kế tiếp gần nhất
      if (!schedule) {
        const upcomingSchedules = await Schedule.find({
          staffId,
          timeSlots: { $elemMatch: { start: { $gt: now } } },
        });

        // Lấy lịch có timeSlot sớm nhất
        schedule = upcomingSchedules.sort((a, b) => {
          const aStart = a.timeSlots.find((slot) => slot.start > now)?.start;
          const bStart = b.timeSlots.find((slot) => slot.start > now)?.start;
          return aStart && bStart ? aStart.getTime() - bStart.getTime() : 0;
        })[0];
      }

      if (!schedule) {
        return res
          .status(404)
          .json({ message: "No current or upcoming schedule found." });
      }
      const booking = await Booking.findOne({ _id: schedule.bookingId })
        .populate("serviceId") // Tìm thông tin dịch vụ
        .populate("profileId");

      if (!booking) {
        return res
          .status(404)
          .json({ message: "No booking found for the schedule." });
      }

      // 4. Lấy tên dịch vụ, địa chỉ khách hàng và ca làm việc từ booking
      const serviceName = booking.serviceId?.name || "No service name";
      const customerAddress = booking.profileId?.address || "No address";
      const phoneNumber =
        booking.profileId?.emergencyContact.phone || "No phone number";

      // 5. Trả về kết quả
      return res.status(200).json({
        schedule,
        serviceName,
        customerAddress,
        phoneNumber,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  getNextScheduleForUser: async (req, res) => {
    const { userId } = req.user;

    try {
      const now = dayjs();
      const startOfDay = now.startOf("day");
      const endOfDay = now.endOf("day");

      // 1. Lấy tất cả các profile của user
      const profiles = await Profile.find({ createBy: userId });

      if (profiles.length === 0) {
        return res.status(200).json({
          message: "Không có profile nào.",
          data: null,
        });
      }

      // 2. Lọc các booking hợp lệ từ repeatFrom và repeatTo
      const bookings = await Booking.find({
        profileId: { $in: profiles.map((profile) => profile._id) }, // Lấy tất cả booking của các profile
        status: { $nin: ["canceled", "completed"] },
        $or: [
          {
            repeatFrom: { $lte: endOfDay.toDate() },
            repeatTo: { $gte: startOfDay.toDate() },
          }, // Booking phải rơi vào khoảng thời gian hôm nay
          {
            repeatFrom: { $lte: endOfDay.toDate() },
            repeatTo: { $gte: endOfDay.toDate() },
          }, // Booking phải rơi vào cuối ngày
        ],
      }).sort({ repeatFrom: 1, "timeSlots.start": 1 });

      if (bookings.length === 0) {
        return res.status(200).json({
          message: "Không có lịch hẹn nào hôm nay.",
          data: null,
        });
      }

      // 3. Tìm lịch đang diễn ra
      const currentBooking = bookings.find(
        (booking) =>
          booking.timeSlots && // Kiểm tra timeSlots có tồn tại
          Object.keys(booking.timeSlots).some((key) => {
            // Nếu là object, ta sử dụng Object.keys() để duyệt qua các khóa
            const slot = booking.timeSlots[key];
            const startTime = dayjs(
              `${now.format("YYYY-MM-DD")} ${slot.start}`
            ); // Kết hợp với ngày hiện tại
            const endTime = dayjs(`${now.format("YYYY-MM-DD")} ${slot.end}`); // Kết hợp với ngày hiện tại
            return now.isBetween(startTime, endTime, null, "[)"); // Kiểm tra ca đang diễn ra
          })
      );

      if (currentBooking) {
        return res.status(200).json({
          message: "Lịch hiện tại",
          data: currentBooking, // Trả về ca hiện tại
        });
      }

      // 4. Tìm ca sắp tới
      const upcomingBooking = bookings.find(
        (booking) =>
          booking.timeSlots && // Kiểm tra timeSlots có tồn tại
          Object.keys(booking.timeSlots).some((key) => {
            // Nếu là object, ta sử dụng Object.keys() để duyệt qua các khóa
            const slot = booking.timeSlots[key];
            const startTime = dayjs(
              `${now.format("YYYY-MM-DD")} ${slot.start}`
            ); // Kết hợp với ngày hiện tại
            return now.isBefore(startTime); // Kiểm tra ca chưa diễn ra
          })
      );

      if (upcomingBooking) {
        return res.status(200).json({
          message: "Lịch sắp tới",
          data: upcomingBooking, // Trả về ca sắp tới
        });
      }

      return res.status(200).json({
        message: "Không có lịch hẹn nào hôm nay.",
        data: null, // Trả về null nếu không có lịch
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Lỗi server",
        data: null, // Trả về null khi gặp lỗi
      });
    }
  },

  getTodaySchedulesByUser: async (req, res) => {
    try {
      const customerId = req.user._id;

      // Lấy ngày bắt đầu và kết thúc của ngày hôm nay
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      // Tìm các Schedule có ngày trong ngày hôm nay
      const schedules = await Schedule.find({
        date: { $gte: startOfDay, $lte: endOfDay },
        bookingId: {
          $in: (
            await Booking.find({ createdBy: customerId }).select("_id")
          ).map((b) => b._id),
        },
      })
        .populate({
          path: "staffId", // Populate thông tin nhân viên từ bảng User
          select: "phone avatar role", // Lấy các trường cần thiết từ User
        })
        .lean() // Tối ưu hóa truy vấn với lean()
        .exec();

      if (!schedules.length) {
        return res
          .status(404)
          .json({ message: "No schedules found for today" });
      }

      // Sau khi populate staffId, lấy thêm thông tin chi tiết từ Doctor hoặc Nurse
      for (let schedule of schedules) {
        const staff = schedule.staffId;

        // Lấy thông tin từ Doctor hoặc Nurse tùy theo role
        if (staff.role === "doctor") {
          const doctor = await Doctor.findOne({ userId: staff._id }).select(
            "firstName lastName"
          );
          staff.firstName = doctor.firstName;
          staff.lastName = doctor.lastName;
        } else if (staff.role === "nurse") {
          const nurse = await Nurse.findOne({ userId: staff._id }).select(
            "firstName lastName"
          );
          staff.firstName = nurse.firstName;
          staff.lastName = nurse.lastName;
        }

        // Tạo fullname từ firstName và lastName
        schedule.staffFullName = `${staff.firstName} ${staff.lastName}`;
        schedule.staffPhone = staff.phone;
        schedule.staffAvatar = staff.avatar;

        // Xóa trường staffId đi (nếu không cần nữa)
        delete schedule.staffId;
      }

      res.status(200).json(schedules);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      res
        .status(500)
        .json({ error: "Something went wrong while fetching schedules." });
    }
  },

  deleteAllSchedules: async (req, res) => {
    try {
      await Schedule.deleteMany();
      return res
        .status(200)
        .json({ message: "Tất cả schedule đã được xoá thành công." });
    } catch (error) {
      console.error("Lỗi khi xóa booking:", error);
      return res
        .status(500)
        .json({ message: "Lỗi server", error: error.message });
    }
  },
};

export default scheduleController;
