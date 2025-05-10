import dotenv from 'dotenv';
dotenv.config();
import twilio from 'twilio';
import Otp from '../models/Otp.js';
import client from '../config/configTwilio.js';

const otpController = {

    // Send OTP
    sendOtp: async (req, res) => {
        const { phone } = req.body;

        // Tạo mã OTP 4 chữ số
        const code = Math.floor(1000 + Math.random() * 9000).toString();

        console.log('Số điện thoại nhận:', phone);
        console.log('Mã OTP:', code);

        try {
            const result = await client.messages.create({
                body: `Mã xác thực của bạn là: ${code}`,
                from: process.env.TWILIO_PHONE,
                to: phone
            });

            console.log('Tin nhắn đã gửi:', result.sid);

            // Ghi vào DB sau khi chắc chắn gửi SMS thành công
            const otpRecord = await Otp.create({ phone, otp: code });
            console.log('Đã lưu OTP vào DB:', otpRecord);

            res.json({ success: true, message: 'Đã gửi mã OTP' });
        } catch (error) {
            console.error('Lỗi khi gửi OTP:', error);
            res.status(500).json({ success: false, message: 'Không gửi được OTP' });
        }
    },

    // Verify OTP
    verifyOtp: async (req, res) => {
        const { phone, otp } = req.body;

        const otpRecord = await Otp.findOne({ phone, otp });
        if (!otpRecord) {
            return res.status(400).json({ success: false, message: 'Sai mã OTP hoặc đã hết hạn' });
        }

        // Nếu đúng thì xóa OTP
        await Otp.deleteOne({ _id: otpRecord._id });

        res.json({ success: true, message: 'Xác thực thành công' });
    }
}

export default otpController;