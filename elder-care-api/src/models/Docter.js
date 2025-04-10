const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema(
  {
    // Tham chiếu đến tài khoản người dùng (users collection)
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // Chuyên khoa (ví dụ: Tim mạch, Nội tiết)
    specialization: {
      type: String,
      required: true,
    },
    // Số giấy phép hành nghề (duy nhất)
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    // Số năm kinh nghiệm
    experience: {
      type: Number,
      default: 0,
    },
    // Lịch làm việc
    availability: {
      workingHours: [
        {
          day: String,        // Ví dụ: "Thứ 2"
          startTime: String,  // Ví dụ: "08:00"
          endTime: String,    // Ví dụ: "12:00"
        },
      ],
      isAvailable: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

// Tạo model từ schema
const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;