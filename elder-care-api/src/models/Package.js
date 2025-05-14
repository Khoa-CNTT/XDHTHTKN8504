import mongoose from "mongoose";

const Schema = mongoose.Schema;

const packageSchema = new Schema({
    serviceId: {
        type: Schema.Types.ObjectId, 
        ref: "Service", 
        required: true
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    totalDays: { type: Number, required: true },
    repeatInterval: {
        type: Number,
        required: true,
    },
    timeWork: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const Packages = mongoose.model("Package", packageSchema);
export default Packages;