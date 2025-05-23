import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    profileId: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
      index: true,
    },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "accepted", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    notes: String,
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
    scheduleIds: [{ type: Schema.Types.ObjectId, ref: "Schedule" }],
    participants: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, enum: ["doctor", "nurse"], required: true },
        fullName: { type: String, required: true },
        acceptedAt: { type: Date, default: Date.now },
      },
    ],
    repeatFrom: { type: Date, required: true },
    repeatTo: { type: Date, required: true },
    timeSlot: {
      start: { type: String }, 
      end: { type: String }, 
    },
    repeatInterval: { type: Number, required: true },
    totalPrice: { type: Number, default: 0 },
    totalDiscount: { type: Number, default: 0 },
    isRecurring: { type: Boolean, default: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  }, { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;