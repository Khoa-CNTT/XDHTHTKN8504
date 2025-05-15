import axios from 'axios';
import crypto from 'crypto';
import Payments from '../models/Payment.js';
import Booking from '../models/Booking.js';

const paymentController = {
    createPayment: async (req, res) => {
        try {
            const { bookingId, amount } = req.body; // Nhận thông tin từ frontend

            // Kiểm tra thông tin hợp lệ
            if (!amount || !bookingId) {
                return res.status(400).json({ msg: 'Missing required fields' });
            }

            // Các thông tin về thanh toán
            var accessKey = 'F8BBA842ECF85';
            var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
            var orderInfo = `Payment for booking ${bookingId}`;
            var partnerCode = 'MOMO';
            var redirectUrl = process.env.REDIRECT_URI || "https://www.facebook.com/" // Địa chỉ trang sau khi thanh toán
            var ipnUrl = ' https://400b-103-156-60-13.ngrok-free.app/v1/payment/callback'; // Callback URL để nhận kết quả thanh toán
            var requestType = "captureWallet";
            var orderId = partnerCode + new Date().getTime();
            var requestId = orderId;  // Mỗi yêu cầu thanh toán sẽ có một ID duy nhất
            var extraData = '';
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

            const newPayment = new Payments({
                orderId: orderId,
                bookingId,
                amount: amount,
                transactionCode: bookingId
            });

            const savedPayment = await newPayment.save();

            return res.status(200).json({
                response: response.data,
                savedPayment: savedPayment,
                msg: "Payment initiated successfully"
            });
        } catch (error) {
            console.error("MOMO ERROR:", error.response?.data || error.message);
            return res.status(500).json({
                statusCode: 500,
                msg: "Server error"
            });
        }
    },

    paymentCallback: async (req, res) => {
        try {
            const accessKey = 'F8BBA842ECF85';
            const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
            const partnerCode = 'MOMO';

            const { orderId } = req.body;

            if (!orderId) {
                return res.status(400).json({ msg: "Missing orderId or requestId from callback" });
            }

            // Tạo raw signature để truy vấn trạng thái từ MoMo
            const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${orderId}`;
            const signature = crypto
                .createHmac('sha256', secretKey)
                .update(rawSignature)
                .digest('hex');

            const requestBody = {
                partnerCode,
                requestId: orderId,
                orderId,
                signature,
                lang: 'vi',
            };

            const options = {
                method: 'POST',
                url: 'https://test-payment.momo.vn/v2/gateway/api/query',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: requestBody,
            };

            // Gửi yêu cầu kiểm tra trạng thái giao dịch
            const result = await axios(options);
            const { resultCode, message } = result.data;

            // Xác định trạng thái thanh toán
            let paymentStatus = 'pending';
            let bookingStatus = 'pending';

            if (resultCode === 0) {
                paymentStatus = 'confirmed';
                bookingStatus = 'paid';
            } else {
                paymentStatus = 'cancelled';
                bookingStatus = 'cancelled';
            }

            // Cập nhật trạng thái thanh toán trong CSDL
            const updatedPayment = await Payments.findOneAndUpdate(
                { orderId },
                { status: paymentStatus },
                { new: true }
            );

            if (updatedPayment && updatedPayment.bookingId) {
                await Booking.findOneAndUpdate(
                    { _id: updatedPayment.bookingId },
                    { status: bookingStatus },
                    { new: true }
                )
            }

            return res.status(200).json({
                status: paymentStatus,
                message,
                payment: updatedPayment,
            });

        } catch (error) {
            console.error('Error checking transaction status:', error.response?.data || error.message);
            return res.status(500).json({
                statusCode: 500,
                msg: 'Server error',
                error: error.message,
            });
        }
    },
}

export default paymentController;