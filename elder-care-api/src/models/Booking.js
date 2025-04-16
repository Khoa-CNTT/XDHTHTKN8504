import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  profileId: { type: Schema.Types.ObjectId, ref: "Profile", required: true, index: true },
  serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
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
  ]
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;