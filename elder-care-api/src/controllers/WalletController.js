import Wallet from "../models/Wallet.js";
import User from "../models/User.js";
import crypto from 'crypto';
import axios from 'axios';
import mongoose from "mongoose";

const walletController = {
    // Create a new wallet
    topUpWallet: async (req, res) => {
        try {
            const { _id: userId } = req.user;
            const { amount } = req.body;

            // Kiểm tra thông tin hợp lệ
            if (!userId) {
                return res.status(400).json({ msg: 'Không có người dùng' });
            }

            if (!amount) {
                return res.status(400).json({ msg: 'Không có số tiền nào' });
            }

            // Các thông tin về thanh toán
            var accessKey = 'F8BBA842ECF85';
            var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
            var orderInfo = `Payment for booking ${userId}`;
            var partnerCode = 'MOMO';
            var redirectUrl = process.env.REDIRECT_URI || "https://www.facebook.com/" // Địa chỉ trang sau khi thanh toán
            var ipnUrl = 'https://dc28-171-251-23-103.ngrok-free.app/api/v1/wallet/callback'; // Callback URL để nhận kết quả thanh toán
            var requestType = "captureWallet";
            var orderId = partnerCode + new Date().getTime();
            var requestId = orderId;  // Mỗi yêu cầu thanh toán sẽ có một ID duy nhất
            var extraData = userId.toString();
            var orderGroupId = '';
            var autoCapture = true;
            var lang = 'vi';

            // Chuẩn bị dữ liệu để tạo signature (HMAC SHA256)
            var rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

            console.log("--------------------RAW SIGNATURE----------------");
            console.log(rawSignature);

            // Tạo signature
            var signature = crypto.createHmac('sha256', secretKey)
                .update(rawSignature)
                .digest('hex');

            console.log("--------------------SIGNATURE----------------");
            console.log(signature);

            // Tạo yêu cầu gửi đến MoMo
            const requestBody = {
                partnerCode,
                partnerName: "Test",
                storeId: "MomoTestStore",
                requestId,
                amount,
                orderId,
                orderInfo,
                redirectUrl,
                ipnUrl,
                lang,
                requestType,
                autoCapture,
                extraData,
                orderGroupId,
                signature,
            };

            const options = {
                method: "POST",
                url: "https://test-payment.momo.vn/v2/gateway/api/create",
                headers: {
                    "Content-Type": "application/json"
                },
                data: requestBody
            };

            let response = await axios(options);
            console.log("MOMO RESPONSE:", response.data);

            return res.status(200).json({
                response: response.data,
                msg: "Payment initiated successfully",
            });
        } catch (error) {
            console.error("MOMO ERROR:", error.response?.data || error.message);
            return res.status(500).json({
                statusCode: 500,
                msg: "Server error"
            });
        }
    },

    walletCallback: async (req, res) => {
        try {
            console.log("📥 MoMo callback received:", req.body);
            const { resultCode, amount, extraData } = req.body;

            if (!resultCode) {
                console.log("Không được! 1");
            }
            if (!amount) {
                console.log("Không được! 2");
            }
            if (!extraData) {
                console.log("Không được! 3");
            }

            if (resultCode === 0) {
                const userId = new mongoose.Types.ObjectId(String(extraData));
                console.log(userId);

                // Kiểm tra ví người dùng
                let wallet = await Wallet.findOne({ userId });

                if (!wallet) {
                    // Nếu ví không tồn tại, tạo ví mới cho người dùng
                    wallet = new Wallet({
                        userId,
                        balance: 0, 
                        transactions: []  
                    });
                    await wallet.save(); 
                    console.log("Tạo ví mới cho người dùng:", wallet);
                }

                // Cộng tiền vào ví
                wallet.balance += Number(amount);
                wallet.transactions.push({
                    type: 'MOMO',
                    amount: amount
                });

                await wallet.save();
                console.log('Cập nhật ví thành công:', wallet);

                return res.status(200).json({ msg: 'Nạp tiền thành công', wallet });
            } else {
                return res.status(400).json({ msg: 'Thanh toán thất bại từ MoMo' });
            }
        } catch (error) {
            console.error("Callback error:", error);
            return res.status(500).json({ msg: 'Lỗi server callback' });
        }
    },
}

export default walletController;