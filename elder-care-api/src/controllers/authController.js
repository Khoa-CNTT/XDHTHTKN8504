import dotenv from 'dotenv';
import User from '../models/User.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';

dotenv.config();

const authController = {
    // ADD USER
    registerUser: async (req, res) => {
        try {
            const { email, password, role, phone } = req.body;

            // Kiểm tra các trường bắt buộc
            if (!email || !password || !role) {
                return res.status(400).json({ message: "Vui lòng điền đủ email, password và role" });
            }

            // Kiểm tra định dạng email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Email không hợp lệ" });
            }

            // Kiểm tra role hợp lệ
            const validRoles = ["family_member", "nurse", "admin", "doctor"];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ message: "Role không hợp lệ" });
            }

            // Kiểm tra email đã tồn tại
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email đã được sử dụng" });
            }

            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcryptjs.hash(password, saltRounds);

            // Tạo user mới
            const newUser = new User({
                email,
                password: hashedPassword,
                role,
                phone: phone || "",
            });

            // Lưu vào database
            const savedUser = await newUser.save();

            // Ẩn password trong response
            const userToReturn = savedUser.toObject();
            delete userToReturn.password;

            res.status(201).json(userToReturn);

        } catch (error) {
            console.error("Lỗi khi thêm user:", error);
            res.status(500).json({
                message: "Lỗi server",
                error: error.message
            });
        }
    },

    // LOGIN USER
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;

            const userExists = await User.findOne({ email });
            if (!userExists) {
                return res.status(400).json({
                    message: "Email này chưa được đăng ký",
                });
            }

            const comparePass = await bcryptjs.compare(password, userExists.password);
            if (!comparePass) {
                return res.status(400).json({
                    message: "Mật khẩu không đúng"
                });
            }

            const token = jwt.sign(
                { _id: userExists._id, role: userExists.role },
                process.env.SECKET_KEY,
                { expiresIn: '7d' }
            );

            userExists.password = undefined;

            res.status(201).json({
                message: "Đăng nhập thành công",
                token: token || null,
                user: userExists,
            });
            console.log("SECRET_KEY:", process.env.SECRET_KEY);
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).json({ message: "Lỗi server, vui lòng thử lại", error: error.message });
        }
    },
};

export default authController;
