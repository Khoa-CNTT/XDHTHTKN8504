import mongoose from "mongoose";
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  orderId: {
    type: String,
    required: true
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },
  staffId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  amount: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    enum: ["Momo", "VNPay", "Cash", "Wallet"],
    default: "Wallet"
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  },
  transactionCode: { type: String, unique: true },
  invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice" }
}, { timestamps: true });

const Payments = mongoose.model("Payment", paymentSchema);
export default Payments;