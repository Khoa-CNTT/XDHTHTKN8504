import mongoose from "mongoose";
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    participants: { type: [Schema.Types.ObjectId], ref: "User", required: true },
    messages: [
      {
        senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        timestamp: { type: Date, default: Date.now },
      }
    ]
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;

