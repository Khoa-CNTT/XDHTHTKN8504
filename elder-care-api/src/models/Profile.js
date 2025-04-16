import mongoose from "mongoose";
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    firstName: {type: String, required: true },
    lastName: {type: String, required: true },
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
    // preferences: {
    //     language: String,
    //     serviceType: String
    // }
}, { timestamps: true });

const Profiles = mongoose.model("Profile", profileSchema);

export default Profiles;