import mongoose from "mongoose";

const Schema = mongoose.Schema;

const walletSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, default: 0 },
    transactions: [
      {
        transactionId: { type: String },
        type: {
          type: String,
          enum: ["TOP_UP", "PAYMENT", "MOMO", "REFUND"],
          required: true,
        },
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["pending", "success", "failed"],
          default: "pending",
        },
        description: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;