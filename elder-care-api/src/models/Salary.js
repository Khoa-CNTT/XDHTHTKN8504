import mongoose from "mongoose";

const salaryRateSchema = new mongoose.Schema({
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // hoặc ref: 'Staff' nếu bạn tách riêng
        required: true,
        unique: true, // mỗi người chỉ có 1 mức lương
    },
    role: {
        type: String,
        enum: ['doctor', 'nurse'],
        required: true
    },
    percentage: {
        type: Number, // ví dụ: 30 => 30%
        required: true,
        min: 0,
        max: 100
    }
}, { timestamps: true });

const SalaryRate = mongoose.model("SalaryRate", salaryRateSchema);

export default SalaryRate;
