require('dotenv').config()
const User = require('../models/User')
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'
// import * as authService from '../services/auth'
const axios = require('axios');

const authController = {
    // ADD USER
    registerUser: async (req, res) => {
        try {
            const userExists = await User.findOne({ email: req.body.email })

            // Kiểm tra email có tồn tại hay không
            if (userExists) {
                return res.status(400).json({
                    message: "Email này đã được đăng ký",
                });
            }

            // Mã hóa mật khẩu
            const hasdPassWord = await bcryptjs.hash(req.body.password, 10)

            const newUser = new User({ ...req.body, password: hasdPassWord });
            const savedUser = await newUser.save()
            res.status(200).json({
                message: "Thêm user thành công",
                savedUser
            })
        } catch (error) {
            res.status(500).json(error)
        }
    },

    // LOGIN USER
    loginUser: async (req, res) => {
        try {
            console.log("Email:", req.body.email);
            console.log("Password:", req.body.password);
            const userExists = await User.findOne({ email: req.body.email })
            console.log("User Exists:", userExists);
            // Kiểm tra email có tồn tại hay không
            if (!userExists) {
                return res.status(400).json({
                    message: "Email này chưa được đăng ký",
                });
            }

            // Mã hóa mật khẩu
            const comparePass = await bcryptjs.compare(req.body.password, userExists.password);
            console.log("Password Compare Result:", comparePass);

            if (!comparePass) {
                return res.status(400).json({
                    message: "Mat khau khong dung"
                });
            }

            const token = jwt.sign({ _id: userExists._id, role: userExists.role }, process.env.SECRET_KEY, {
                expiresIn: '7d',
            });

            userExists.password = undefined;

            res.status(201).json({
                message: "Dang nhap thành công",
                token: token || null,
                user: userExists,
            });
        } catch (error) {
            console.error("Error during login:", error);  // Log lỗi để debug
            res.status(500).json({ message: "Lỗi server, vui lòng thử lại", error: error.message });
        }
    },
}

module.exports = authController;