import mongoose from "mongoose";
const Schema = mongoose.Schema;

const doctorSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // Chuyên môn (ví dụ: Tim mạch, Nội tiết)
    specialization: {
      type: String,
      required: true,
    },
    // Số giấy phép hành nghề (duy nhất)
    licenseNumber: {
      type: String,
      required: true,
    },
    // Số năm kinh nghiệm
    experience: {
      type: Number,
      default: 0,
    },
    // Trạng thái chung của bác sĩ (sẵn sàng nhận đơn hay không)
    isAvailable: {
      type: Boolean,
      default: true,
    },
  }, { timestamps: true }
);

// Tạo model từ schema
const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;