const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const nurseSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  fullName: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  specialties: [String],
  availability: {
    workingHours: [{
      day: String,
      startTime: Date,
      endTime: Date
    }],
    isAvailable: { type: Boolean, default: true }
  },
  rating: { type: Number, min: 1, max: 5 },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: [Number]
  }
}, { timestamps: true });

nurseSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("Nurse", nurseSchema);