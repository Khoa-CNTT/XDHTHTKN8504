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
    phone: String,
    avartar: String,
    healthInfo: [{
        condition: [{
            name: String,
            description: String,
        }],
        height: Number,
        weight: Number,
        typeBlood: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"],
            default: "Unknown"
        },
        notes: String
    }],
}, { timestamps: true });

const Profiles = mongoose.model("Profile", profileSchema);

export default Profiles;