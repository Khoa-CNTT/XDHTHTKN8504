const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    nurseId: { type: Schema.Types.ObjectId, ref: "Nurse", required: true },
    date: { type: Date, required: true },
    shifts: [{
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        patients: [{
            profileId: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
            serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
            status: {
                type: String,
                enum: ["pending", "completed"],
                default: "pending"
            }
        }]
    }]
}, { timestamps: true });

module.exports = mongoose.model("Schedule", scheduleSchema);