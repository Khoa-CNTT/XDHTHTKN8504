const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  profileId: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
  nurseId: { type: Schema.Types.ObjectId, ref: "Nurse", required: true },
  serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending"
  },
  notes: String,
  paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
  scheduleId: { type: Schema.Types.ObjectId, ref: "Schedule" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);