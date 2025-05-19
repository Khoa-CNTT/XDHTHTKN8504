import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    invoiceId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    bookingId: {
        type: Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
    staffId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: Date,
        default: () => {
            const now = new Date();
            return new Date(now.setDate(now.getDate() + 4));
        },
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "credit_card", "bank_transfer", "wallet"],
        default: "wallet",
    },
}, { timestamps: true });

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice