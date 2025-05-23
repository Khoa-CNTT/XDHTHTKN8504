import Booking from "../models/Booking.js";
import { getIO } from "../config/socketConfig.js";

export default (agenda) => {
    agenda.define("emit-booking-if-unaccepted", async (job) => {
      const { bookingId, targetRole } = job.attrs.data;

      const booking = await Booking.findById(bookingId);
      if (!booking || booking.status !== "pending") {
        // huỷ job nếu không còn hợp lệ
        await job.remove();
        return;
      }

      const populatedBooking = await Booking.findById(bookingId)
        .populate("serviceId")
        .populate("profileId");

      const io = getIO();
      io.to(`staff_${targetRole}`).emit("newBookingSignal", populatedBooking);
    });
};
