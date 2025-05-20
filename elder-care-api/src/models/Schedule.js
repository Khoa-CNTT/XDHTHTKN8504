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
    serviceName: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    timeSlots: [
        {
            start: { type: Date, required: true },  // Thời gian bắt đầu của ca làm việc
            end: { type: Date, required: true },    // Thời gian kết thúc của ca làm việc
        }
    ],
    status: {
        type: String,
        enum: ["scheduled", "waiting_for_nurse", "waiting_for_client", "on_the_way", "check_in" , "in_progress", "check_out", "completed", "canceled"],
        default: 'scheduled',
    },
}, { timestamps: true });


const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule; 