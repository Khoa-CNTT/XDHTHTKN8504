import mongoose from "mongoose";
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    participants: { type: [Schema.Types.ObjectId], ref: "User", required: true },
    chatType: {
      type: String,
      enum: ['admin-staff', 'admin-family', 'doctor-nurse', 'staff-family'],
      required: true
    },

    // Thông tin về cuộc trò chuyện
    title: { type: String, default: "" },
    isActive: { type: Boolean, default: true },

    // Tin nhắn trong cuộc trò chuyện
    messages: [
      {
        senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        timestamp: { type: Date, default: Date.now },
      }
    ],

    // Thông tin bổ sung (nếu cần)
    metadata: {
      relatedTicketId: { type: Schema.Types.ObjectId, ref: "Ticket" }, // Nếu liên quan đến một ticket
      lastActivity: { type: Date, default: Date.now },
    }
  },
  { timestamps: true }
);

// Index để tìm kiếm nhanh
chatSchema.index({ participants: 1 });
chatSchema.index({ chatType: 1 });
chatSchema.index({ "metadata.relatedTicketId": 1 });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;