import Chat from "../models/Chat.js";
import User from "../models/User.js";

// Kiểm tra quyền gửi tin nhắn
export const checkPermissions = async (senderId, receiverId) => {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
        throw new Error('User not found');
    }

    const senderRole = sender.role;
    const receiverRole = receiver.role;

    // Cấu hình quyền theo vai trò
    if (senderRole === 'admin') return true;
    if (senderRole === 'family_member' && (receiverRole === 'doctor' || receiverRole === 'nurse')) return true;
    if (senderRole === 'nurse' && (receiverRole === 'doctor' || receiverRole === 'family_member')) return true;
    if (senderRole === 'doctor' && (receiverRole === 'family_member' || receiverRole === 'nurse')) return true;

    return false;
};

const chatController = {
    sendMessage: async (req, res) => {
        const { senderId, receiverId, message } = req.body;

        try {
            // Kiểm tra quyền gửi tin nhắn
            const isAllowed = await checkPermissions(senderId, receiverId);
            if (!isAllowed) {
                return res.status(403).json({ message: "You do not have permission to message this user" });
            }

            // Tạo cuộc trò chuyện mới hoặc thêm tin nhắn vào cuộc trò chuyện hiện tại
            let conversation = await Chat.findOne({
                participants: { $all: [senderId, receiverId] },
            });

            if (!conversation) {
                conversation = new Chat({
                    participants: [senderId, receiverId],
                    messages: [],
                });
            }

            if (!conversation.messages) {
                conversation.messages = [];
            }

            conversation.messages.push({ senderId, message });
            await conversation.save();

            res.status(200).json(conversation);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    },

    getMessages: async (req, res) => {
        try {
            const { user1, user2 } = req.query;

            const messages = await Chat.find({
                participants: { $all: [user1, user2] },
            }).sort({ createdAt: 1 });

            res.json(messages);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getRecentConversations: async (req, res) => {
        try {
            const { userId } = req.params;

            const recent = await Chat.aggregate([
                { $match: { participants: { $in: [new mongoose.Types.ObjectId(userId)] } } },
                { $sort: { createdAt: -1 } },
                {
                    $group: {
                        _id: {
                            $cond: [
                                { $eq: ["$senderId", new mongoose.Types.ObjectId(userId)] },
                                "$receiverId",
                                "$senderId"
                            ]
                        },
                        lastMessage: { $first: "$$ROOT" }
                    }
                }
            ]);

            res.json(recent);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
}

export default chatController;