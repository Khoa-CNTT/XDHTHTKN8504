import dotenv from "dotenv";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Nurse from "../models/Nurse.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import { getIO } from "../config/socketConfig.js";

dotenv.config();

const authController = {
  // Đăng ký tài khoản mới
  registerUser: async (req, res) => {
    try {
      const { phone, password, role } = req.body;

      // Kiểm tra dữ liệu bắt buộc
      if (!phone || !password || !role) {
        return res
          .status(400)
          .json({ message: "Vui lòng điền đủ phone, password và role" });
      }

      // Kiểm tra định dạng số điện thoại
      const phoneRegex = /^(0|\+84)\d{9,10}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Số điện thoại không hợp lệ" });
      }

      // Kiểm tra role hợp lệ
      const validRoles = ["family_member", "nurse", "admin", "doctor"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Role không hợp lệ" });
      }

      // Kiểm tra trùng số điện thoại
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Số điện thoại đã được sử dụng" });
      }

      // Mã hóa mật khẩu
      const saltRounds = 10;
      const hashedPassword = await bcryptjs.hash(password, saltRounds);

      // Tạo người dùng mới
      const newUser = new User({
        phone,
        password: hashedPassword,
        role,
      });

      const savedUser = await newUser.save();

      // Xóa mật khẩu khỏi dữ liệu trả về
      const userToReturn = savedUser.toObject();
      delete userToReturn.password;

      res.status(201).json(userToReturn);
    } catch (error) {
      console.error("Lỗi khi đăng ký user:", error);
      res.status(500).json({
        message: "Lỗi server",
        error: error.message,
      });
    }
  },

  // Đăng nhập
  loginUser: async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ phone và password" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "Số điện thoại này chưa được đăng ký" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    const userToReturn = user.toObject();
    delete userToReturn.password;

    // ✅ Thêm bước: Lấy thêm thông tin doctor/nurse nếu cần
    let extraInfo = null;

    if (user.role === "doctor") {
      extraInfo = await Doctor.findOne({ userId: user._id });
    } else if (user.role === "nurse") {
      extraInfo = await Nurse.findOne({ userId: user._id });
    }

    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: userToReturn,
      extraInfo, // có thể là doctor hoặc nurse hoặc null
    });
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    res.status(500).json({
      message: "Lỗi server, vui lòng thử lại",
      error: error.message,
    });
  }},

  uploadAvatar: async (req, res) => {
    try {
      const userId = req.user; // Lấy từ token đã xác thực
      const file = req.file;

      if (!file) return res.status(400).json({ message: "No file uploaded" });

      const result = await cloudinary.uploader.upload(file.path, {
        folder: "elder-care/avatar"
      });

      fs.unlinkSync(file.path); // Xoá file tạm

      const user = await User.findByIdAndUpdate(
        userId,
        { avatar: result.secure_url },
        { new: true }
      );

      if (!user) return res.status(404).json({ message: "User not found" });

      res.status(200).json({
        message: "Avatar uploaded successfully",
        avatarUrl: result.secure_url,
        user
      });

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  countMembersPerMonth: async (req, res) => {
    try {
      // const {_id: userId } = req.user; 
      const result = await User.aggregate([
        {
          $match: { role: "family_member" }
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "_id": 1 }
        }
      ]);

      // Tạo mảng 12 tháng, nếu tháng nào không có thì gán 0
      const counts = Array(12).fill(0);
      result.forEach((item) => {
        counts[item._id - 1] = item.count;
      });

      res.json({ data: counts });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Cập nhập trạng thái hoạt động của bác sĩ và điều dưỡng
  updateAvailabilityStatus: async (req, res) => {
    const { status } = req.body;
    const { _id: userId, role } = req.user;

    try {
      let updatedUser;

      // Kiểm tra xem người dùng là bác sĩ hay điều dưỡng và cập nhật trạng thái
      if (role === 'doctor') {
        updatedUser = await Doctor.findOneAndUpdate(
          { userId },
          { isAvailable: status },
          { new: true }
        );
      } else if (role === 'nurse') {
        updatedUser = await Nurse.findOneAndUpdate(
          { userId },
          { isAvailable: status },
          { new: true }
        );
      }

      // Nếu không tìm thấy người dùng, trả về lỗi
      if (!updatedUser) {
        return res.status(404).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} không tồn tại` });
      }

      // Emit thông báo realtime cho các client có liên quan (bác sĩ/điều dưỡng)
      const io = getIO(); // Lấy instance của socket
      io.to(`${role}_room_${userId}`).emit(`${role}StatusUpdated`, {
        userId: updatedUser.userId,
        isAvailable: updatedUser.isAvailable
      });

      return res.status(200).json({
        message: `Cập nhật trạng thái ${role} thành công`,
        user: updatedUser
      });
    } catch (error) {
      console.error(`Lỗi khi cập nhật trạng thái ${role}:`, error);
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
};

export default authController;
