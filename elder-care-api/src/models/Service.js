const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    pricePerHour: { type: Number, required: true },
    duration: { type: Number, default: 60 },
    category: { type: String, enum: ["Y tế", "Sinh hoạt", "Tư vấn"], default: "Y tế" },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);