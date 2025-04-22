import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["family_member", "nurse", "admin"],
        default: "family_member"
    },
    phone: { type: String, required: true },
    // Chỉ áp dụng cho family_member
    profiles: [{
        type: Schema.Types.ObjectId,
        ref: "Profile",
        required: function () { return this.role === "family_member"; }
    }]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User