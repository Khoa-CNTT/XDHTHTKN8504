import cron from "node-cron";
import Booking from "../models/Booking.js";
import Wallet from "../models/Wallet.js";
import Payments from "../models/Payment.js";

cron.schedule("*/5 * * * *", async () => {
  console.log("Đang kiểm tra các booking chưa được xác nhận...");

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  try {
    const expiredBookings = await Booking.find({
      status: { $ne: "accepted" },
      createdAt: { $lte: oneHourAgo },
    });

    for (const booking of expiredBookings) {
      const wallet = await Wallet.findOne({ userId: booking.createdBy });
      if (!wallet) continue;

      const transaction = wallet.transactions.find(
        (t) =>
          t.description.includes(booking._id.toString()) &&
          t.status === "pending"
      );

      if (transaction) {
        // Hoàn tiền
        wallet.balance += transaction.amount;
        transaction.status = "failed";
        transaction.description +=
          " - Hoàn tiền do booking chưa được chấp nhận sau 1 giờ";
        await wallet.save();

        const payment = await Payments.findOne({ bookingId: booking._id });
        if (payment) {
          payment.status = "failed";
          await payment.save();
        }

        console.log(`Đã hoàn tiền cho booking ${booking._id}`);
      }
    }
  } catch (error) {
    console.error("Lỗi cron job hoàn tiền:", error.message);
  }
});
