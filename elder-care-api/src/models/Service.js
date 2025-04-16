import mongoose from "mongoose";
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    price: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Service = mongoose.model("Service", serviceSchema);

export default Service;