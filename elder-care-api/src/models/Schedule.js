import mongoose from "mongoose";
const Schema = mongoose.Schema;

const scheduleSchema = new mongoose.Schema({
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    role: {
        type: String,
        enum: ['doctor', 'nurse'],
        required: true,
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
    },
    patientName: {
        type: String,
        required: true,
    },
    date: {
        type: Date, // Định dạng Date để dễ dàng truy vấn và so sánh
        required: true,
    },
    timeSlots: [
        {
            startTime: { type: Date, required: true },  // Thời gian bắt đầu của ca làm việc
            endTime: { type: Date, required: true },    // Thời gian kết thúc của ca làm việc
        }
    ],
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled',
    },
}, { timestamps: true });


const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule; 