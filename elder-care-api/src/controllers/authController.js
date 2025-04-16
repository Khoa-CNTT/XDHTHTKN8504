import dotenv from "dotenv";
import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const authController = {
  // ADD USER
  registerUser: async (req, res) => {
    try {
      const { phone, password, role } = req.body;

      // Kiểm tra các trường bắt buộc
      if (!phone || !password || !role) {
        return res.status(400).json({ message: "Vui lòng điền đủ phone, password và role" });
      }

      // Kiểm tra định dạng phone
      const phoneRegex = /^(0|\+84)\d{9,10}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Số điện thoại không hợp lệ" });
      }

      // Kiểm tra role hợp lệ
      const validRoles = ["family_member", "nurse", "admin", "doctor"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Role không hợp lệ" });
      }

      // Kiểm tra phone đã tồn tại
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({ message: "Số điện thoại đã được sử dụng" });
      }

      // Mã hóa mật khẩu
      const saltRounds = 10;
      const hashedPassword = await bcryptjs.hash(password, saltRounds);

      // Tạo user mới
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

      // Tìm người dùng
      const userExists = await User.findOne({ phone });
      if (!userExists) {
        return res.status(400).json({
          message: "Số điện thoại này chưa được đăng ký",
        });
      }

      // So sánh mật khẩu
      const isMatch = await bcryptjs.compare(password, userExists.password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Mật khẩu không đúng",
        });
      }

      const token = jwt.sign(
        { _id: userExists._id, role: userExists.role },
        process.env.SECRET_KEY,
        { expiresIn: '7d' }
      );

      // Xóa mật khẩu khỏi dữ liệu trả về
      const userToReturn = userExists.toObject();
      delete userToReturn.password;

      res.status(200).json({
        message: "Đăng nhập thành công",
        token,
        user: userToReturn,
      });
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      res.status(500).json({
        message: "Lỗi server, vui lòng thử lại",
        error: error.message,
      });
    }
  },
};

export default authController;
