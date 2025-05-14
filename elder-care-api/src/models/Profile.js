import mongoose from "mongoose";
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    sex: {
        type: String,
        required: true,
        enum: ["male", "female", "other"],
        default: "female"
    },
    relationship: { type: String, required: true },
    address: String,
    emergencyContact: {
        name: String,
        phone: String
    },
    healthInfo: [{
        condition: [{
            name: String,
            description: String,
        }],
        height: String,
        weight: String,
        typeBlood: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        },
        notes: String
    }],
}, { timestamps: true });

const Profiles = mongoose.model("Profile", profileSchema);

export default Profiles;