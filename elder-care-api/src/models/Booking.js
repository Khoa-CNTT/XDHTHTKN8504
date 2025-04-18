import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  profileId: { type: Schema.Types.ObjectId, ref: "Profile", required: true, index: true },
  serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "completed", "cancelled"],
    default: "pending",
    index: true
  },
  notes: String,
  paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
  scheduleId: { type: Schema.Types.ObjectId, ref: "Schedule" },

  participants: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      role: { type: String, enum: ["doctor", "nurse"], required: true },
      acceptedAt: { type: Date, default: Date.now }
    }
  ],
  repeatFrom: { type: Date, required: true },
  repeatTo: { type: Date, required: true },
  timeSlot: {
    start: { type: String, required: true },  // Giờ bắt đầu: '08:00'
    end: { type: String, required: true }     // Giờ kết thúc: '10:00'
  },
  isRecurring: { type: Boolean, default: true }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;