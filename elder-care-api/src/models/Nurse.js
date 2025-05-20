import mongoose from "mongoose";
const Schema = mongoose.Schema;

const nurseSchema = new Schema(
  {
    // Liên kết đến tài khoản người dùng
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
    specialties: [String], // Các chuyên môn phụ (nếu có)
    licenseNumber: {
      type: String,
      required: true,
    },
    // Trạng thái chung của điều dưỡng (sẵn sàng nhận đơn hay không)
    isAvailable: {
      type: Boolean,
      default: true,
    },
    // Vị trí địa lý của điều dưỡng (hữu ích cho tìm kiếm gần)
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: [Number],
    },
  }, { timestamps: true }
);

nurseSchema.index({ location: "2dsphere" });

const Nurse = mongoose.model("Nurse", nurseSchema);

export default Nurse;