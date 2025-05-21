import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["family_member", "nurse", "doctor" ,"admin"],
        default: "family_member"
    },
    avatar: { type: String },
    profiles: [{
        type: Schema.Types.ObjectId,
        ref: "Profile",
        required: function () { return this.role === "family_member"; }
    }]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User