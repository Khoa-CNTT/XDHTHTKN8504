import Booking from "../models/Booking.js";
import { getIO } from "../config/socketConfig.js";

export default (agenda) => {
  agenda.define("auto-cancel-booking", async (job, done) => {
    const { bookingId } = job.attrs.data;
    const booking = await Booking.findById(bookingId).populate("profileId");

    if (!booking || booking.status !== "pending") return done();

    booking.status = "cancelled";
    await booking.save();

    const io = getIO();

    const wallet = await Wallet.findOne({ userId: booking.createdBy });
    
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

    // Gửi socket tới user
    io.to(booking.createdBy.toString()).emit("bookingCanceled", {
      title: "📛 Đặt lịch bị huỷ",
      message: `Lịch ${booking._id} đã bị huỷ do quá hạn không được xác nhận.`,
    });

    // Gửi socket tới admin
    io.to("staff_admin").emit("bookingUpdated", booking);

    console.log(`⏰ Booking ${bookingId} đã bị huỷ.`);
    done();
  });
};
