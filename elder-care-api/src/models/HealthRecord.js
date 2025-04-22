const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const healthRecordSchema = new Schema({
  profileId: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
  type: {
    type: String,
    enum: ["heart_rate", "blood_pressure", "glucose"],
    required: true
  },
  value: { type: Number, required: true },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model("HealthRecord", healthRecordSchema);