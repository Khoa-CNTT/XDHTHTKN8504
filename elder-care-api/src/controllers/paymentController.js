import axios from 'axios';
import crypto from 'crypto';
import Payments from '../models/Payment.js';
import Booking from '../models/Booking.js';
import Doctor from '../models/Doctor.js'
import Nurse from '../models/Nurse.js'
import User from '../models/User.js'
import mongoose from 'mongoose';
import Profile from '../models/Profile.js'

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

    getPaymentByStaff: async (req, res) => {
        try {
            const { _id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(_id)) {
                return res.status(400).json({ message: "ID không hợp lệ!" });
            }

            let staff = await Doctor.findById(_id);

            if (!staff) {
                staff = await Nurse.findById(_id);
            }

            if (!staff) {
                return res.status(404).json({ message: "Không tìm thấy nhân viên!" });
            }

            const staffId = staff.userId;
            if (!staffId) {
                return res.status(400).json({ message: "Nhân viên không có staffId!" });
            }

            const payments = await Payments.find({
                staffId: new mongoose.Types.ObjectId(staffId),
            }).populate({
                path: "bookingId",
                populate: {
                    path: "profileId",
                    model: "Profile",
                },
            });

            return res.status(200).json(payments);

        } catch (error) {
            console.error("❌ Lỗi server:", error);
            return res.status(500).json({
                message: "Lỗi khi lấy Payment",
                error: error.message,
            });
        }
    },

    calculateSalary: async (req, res) => {
        try {
            const { _id } = req.params;

            // Tìm doctor hoặc nurse
            let staff = await Doctor.findById(_id);
            if (!staff) {
                staff = await Nurse.findById(_id);
            }
            if (!staff) {
                return res.status(404).json({ message: "Không tìm thấy nhân viên" });
            }

            const userId = staff.userId;

            // Tính tổng lương và thống kê đơn
            const result = await Payments.aggregate([
                {
                    $match: {
                        staffId: userId
                    }
                },
                {
                    $lookup: {
                        from: "bookings",
                        localField: "bookingId",
                        foreignField: "_id",
                        as: "booking"
                    }
                },
                {
                    $unwind: {
                        path: "$booking",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: "$staffId",
                        totalAmount: {
                            $sum: {
                                $cond: [{ $eq: ["$status", "success"] }, "$amount", 0]
                            }
                        },
                        totalDiscount: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$status", "success"] },
                                    { $ifNull: ["$booking.totalDiscount", 0] },
                                    0
                                ]
                            }
                        },
                        successCount: {
                            $sum: {
                                $cond: [{ $eq: ["$status", "success"] }, 1, 0]
                            }
                        },
                        pendingCount: {
                            $sum: {
                                $cond: [{ $ne: ["$status", "success"] }, 1, 0]
                            }
                        }
                    }
                },
                {
                    $project: {
                        totalSalary: { $add: ["$totalAmount", "$totalDiscount"] },
                        successCount: 1,
                        pendingCount: 1
                    }
                }
            ]);

            if (result.length === 0) {
                return res.status(200).json({
                    staff,
                    totalSalary: 0,
                    successCount: 0,
                    pendingCount: 0
                });
            }

            return res.status(200).json({
                ...result[0]
            });
        } catch (error) {
            return res.status(500).json({
                message: "Lỗi khi tính tiền lương",
                error: error.message
            });
        }
    },

    getAllPayment: async (req, res) => {
        try {
            const payments = await Payments.find({})
                .populate({
                    path: "bookingId",
                    populate: {
                        path: "profileId",
                        model: "Profile"
                    }
                })
                .sort({ createdAt: -1 });
            return res.status(200).json(payments);
        } catch (error) {
            console.error("Lỗi khi lấy tất cả Payment:", error);
            return res.status(500).json({
                message: "Lỗi khi lấy tất cả Payment",
                error: error.message,
            });
        }
    },

    countPayments: async (req, res) => {
        try {
            const now = new Date();

            // Lấy ngày hiện tại
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            // Lấy tháng hiện tại
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

            // Lấy năm hiện tại
            const yearStart = new Date(now.getFullYear(), 0, 1);
            const nextYear = new Date(now.getFullYear() + 1, 0, 1);

            // Đếm payment trong ngày
            const countToday = await Payments.countDocuments({
                createdAt: { $gte: today, $lt: tomorrow }
            });

            // Đếm payment trong tháng
            const countMonth = await Payments.countDocuments({
                createdAt: { $gte: monthStart, $lt: nextMonth }
            });

            // Đếm payment trong năm
            const countYear = await Payments.countDocuments({
                createdAt: { $gte: yearStart, $lt: nextYear }
            });

            return res.status(200).json({
                today: countToday,
                month: countMonth,
                year: countYear
            });
        } catch (error) {
            console.error("Lỗi khi lấy Payment:", error);
            return res.status(500).json({
                message: "Lỗi khi lấy Payment",
                error: error.message,
            });
        }
    },

    // getMonthlyRevenue: async (req, res) => {
    //     try {
    //         const now = new Date();
    //         const months = [];

    //         // Lấy 12 tháng gần nhất
    //         for (let i = 11; i >= 0; i--) {
    //             const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    //             months.push({
    //                 year: date.getFullYear(),
    //                 month: date.getMonth() + 1 // tháng bắt đầu từ 0
    //             });
    //         }

    //         // Aggregate tổng tiền theo tháng
    //         const revenue = await Payments.aggregate([
    //             {
    //                 $match: {
    //                     createdAt: {
    //                         $gte: new Date(now.getFullYear(), now.getMonth() - 11, 1)
    //                     },
    //                     status: { $in: ["success", "confirmed"] }
    //                 }
    //             },
    //             {
    //                 $group: {
    //                     _id: {
    //                         year: { $year: "$createdAt" },
    //                         month: { $month: "$createdAt" }
    //                     },
    //                     total: { $sum: "$amount" }
    //                 }
    //             }
    //         ]);

    //         // Map kết quả ra 12 tháng, nếu tháng nào không có thì total = 0
    //         const result = months.map(m => {
    //             const found = revenue.find(r => r._id.year === m.year && r._id.month === m.month);
    //             return {
    //                 year: m.year,
    //                 month: m.month,
    //                 total: found ? found.total : 0
    //             };
    //         });

    //         return res.status(200).json(result);
    //     } catch (error) {
    //         return res.status(500).json({
    //             message: "Lỗi khi tính tổng tiền theo tháng",
    //             error: error.message
    //         });
    //     }
    // },
    getMonthlyRevenue: async (req, res) => {
        try {
            const now = new Date();
            const months = [];

            // Tạo danh sách 12 tháng gần nhất
            for (let i = 11; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                months.push({
                    label: `Tháng ${date.getMonth() + 1}`,
                    year: date.getFullYear(),
                    month: date.getMonth() + 1
                });
            }

            // Truy vấn dữ liệu thanh toán trong 12 tháng gần nhất
            const revenue = await Payments.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(now.getFullYear(), now.getMonth() - 11, 1)
                        },
                        status: { $in: ["success", "confirmed"] }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        total: { $sum: "$amount" }
                    }
                }
            ]);

            // Gắn kết doanh thu theo từng tháng
            const labels = [];
            const totals = [];

            months.forEach((m) => {
                const found = revenue.find(
                    (r) => r._id.year === m.year && r._id.month === m.month
                );
                labels.push(m.label);
                totals.push(found ? found.total : 0);
            });

            return res.status(200).json({ labels, totals });
        } catch (error) {
            return res.status(500).json({
                message: "Lỗi khi tính doanh thu theo tháng",
                error: error.message
            });
        }
    },

    getTotalMonthlyRevenue: async (req, res) => {
        try {
            const now = new Date();
            const months = [];

            // Tạo danh sách 12 tháng gần nhất
            for (let i = 11; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                months.push({
                    year: date.getFullYear(),
                    month: date.getMonth() + 1
                });
            }

            // Truy vấn tổng doanh thu từng tháng trong 12 tháng gần nhất
            const revenue = await Payments.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(now.getFullYear(), now.getMonth() - 11, 1)
                        },
                        status: { $in: ["success", "confirmed"] }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        total: { $sum: "$amount" }
                    }
                }
            ]);

            // Map kết quả ra 12 tháng, nếu tháng nào không có thì total = 0
            const totals = months.map(m => {
                const found = revenue.find(r => r._id.year === m.year && r._id.month === m.month);
                const total = found ? found.total : 0;
                return Math.round(total / 1000000);
            });

            return res.status(200).json({ revenue: totals });
        } catch (error) {
            return res.status(500).json({
                message: "Error",
                error
            })
        }
    }
}

export default paymentController;