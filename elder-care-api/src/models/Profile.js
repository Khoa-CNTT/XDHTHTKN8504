const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    relationship: { type: String, required: true },
    address: String,
    emergencyContact: {
        name: String,
        phone: String
    },
    healthConditions: [{
        condition: String,
        notes: String
    }],
    preferences: {
        language: String,
        serviceType: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);