import Wallet from "../models/Wallet.js";
import User from "../models/User.js";
import crypto from "crypto";
import axios from "axios";
import mongoose from "mongoose";
import Payments from "../models/Payment.js";

const walletController = {
  getWallet: async (req, res) => {
    try {
      const { _id: userId } = req.user;

      let wallet = await Wallet.findOne({ userId });
      if (!wallet) wallet = await Wallet.create({ userId });

      return res.status(200).json({ wallet });
    } catch (error) {
      console.error("GET WALLET ERROR:", error.message);
      return res.status(500).json({ msg: "Lỗi khi lấy ví người dùng" });
    }
  },
  getTransactions: async (req, res) => {
    try {
      const { _id: userId } = req.user;
      const wallet = await Wallet.findOne({ userId });

      if (!wallet) return res.status(404).json({ msg: "Không có ví" });

      return res
        .status(200)
        .json({ transactions: wallet.transactions.reverse() });
    } catch (error) {
      console.error("GET TX ERROR:", error.message);
      return res.status(500).json({ msg: "Lỗi khi lấy giao dịch" });
    }
  },
  makePayment: async (req, res) => {
    try {
      const { _id: userId } = req.user;
      const { amount, description } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ msg: "Số tiền thanh toán không hợp lệ" });
      }

      const wallet = await Wallet.findOne({ userId });
      if (!wallet) {
        return res.status(404).json({ msg: "Không tìm thấy ví người dùng" });
      }

      if (wallet.balance < amount) {
        return res.status(400).json({ msg: "Số dư không đủ" });
      }

      const transactionId = "PAY_" + new Date().getTime();

      // Trừ tiền và tạo giao dịch mới
      wallet.balance -= amount;
      wallet.transactions.push({
        transactionId,
        type: "payment",
        amount,
        status: "success",
        description: description || "Thanh toán dịch vụ",
      });

      await wallet.save();

      return res.status(200).json({
        msg: "Thanh toán thành công",
        transactionId,
        newBalance: wallet.balance,
      });
    } catch (error) {
      console.error("MAKE PAYMENT ERROR:", error.message);
      return res.status(500).json({ msg: "Lỗi khi thanh toán" });
    }
  },
  topUpWallet: async (req, res) => {
    try {
      const { _id: userId } = req.user;
      const { amount } = req.body;

      // Kiểm tra thông tin hợp lệ
      if (!userId) {
        return res.status(400).json({ msg: "Không có người dùng" });
      }

      if (!amount) {
        return res.status(400).json({ msg: "Không có số tiền nào" });
      }

      // Các thông tin về thanh toán
      var accessKey = "F8BBA842ECF85";
      var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
      var orderInfo = `Payment for booking ${userId}`;
      var partnerCode = "MOMO";
      var redirectUrl = process.env.REDIRECT_URI || "https://www.facebook.com/"; // Địa chỉ trang sau khi thanh toán
      var ipnUrl =
        "https://9464-171-225-184-232.ngrok-free.app/api/v1/wallet/callback"; //
      //  https://1382-103-156-58-116.ngrok-free.app Callback URL để nhận kết quả thanh toán
      var requestType = "captureWallet";
      var orderId = partnerCode + new Date().getTime();
      var requestId = orderId; // Mỗi yêu cầu thanh toán sẽ có một ID duy nhất
      var extraData = userId.toString();
      var orderGroupId = "";
      var autoCapture = true;
      var lang = "vi";

      // Chuẩn bị dữ liệu để tạo signature (HMAC SHA256)
      var rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

      console.log("--------------------RAW SIGNATURE----------------");
      console.log(rawSignature);

      // Tạo signature
      var signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

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
          "Content-Type": "application/json",
        },
        data: requestBody,
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
        msg: "Server error",
      });
    }
  },

  walletCallback: async (req, res) => {
    try {
      console.log("📥 MoMo callback received:", req.body);
      const { resultCode, amount, extraData } = req.body;

      if (resultCode === 0) {
        const userId = new mongoose.Types.ObjectId(String(extraData));

        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
          return res.status(402).json({ msg: "Không tìm thấy ví người dùng" });
        }

        // Cộng tiền vào ví
        wallet.balance += Number(amount);
        wallet.transactions.push({
          type: "MOMO",
          amount: amount,
          description: "Nạp tiền vào ví qua MOMO thành công!"
        });

        await wallet.save();

        return res.status(200).json({ msg: "Nạp tiền thành công", wallet });
      } else {
        return res.status(400).json({ msg: "Thanh toán thất bại từ MoMo" });
      }
    } catch (error) {
      console.error("Callback error:", error);
      return res.status(500).json({ msg: "Lỗi server callback" });
    }
  },

  getTransactions: async (req, res) => {
    try {
      const { userId } = req.params;
      const wallet = await Wallet.findOne({ userId });

      if (!wallet) {
        return res.status(404).json({ msg: "Không tìm thấy ví người dùng" });
      }

      return res.status(200).json({ transactions: wallet.transactions.reverse() });
    } catch (error) {

    }
  }
};
export default walletController;
