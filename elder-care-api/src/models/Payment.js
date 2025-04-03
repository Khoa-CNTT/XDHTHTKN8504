const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
  amount: { type: Number, required: true },
  method: {
    type: String,
    enum: ["Momo", "VNPay", "Cash"],
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  },
  transactionCode: { type: String, unique: true },
  invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice" }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);