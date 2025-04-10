const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    nurseId: { type: Schema.Types.ObjectId, ref: "Nurse", required: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
    totalAmount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    paymentMethod: {
        type: String,
        enum: ["Momo", "VNPay", "Cash"],
        required: true
    },
    status: {
        type: String,
        enum: ["paid", "unpaid"],
        default: "unpaid"
    }
}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);