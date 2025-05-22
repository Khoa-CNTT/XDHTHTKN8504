import Chat from "../models/Chat.js";
import User from "../models/User.js";
import { notifyUser } from "../controllers/socketChat.js";
import mongoose from "mongoose";


const chatController = {
    // Lấy danh sách cuộc trò chuyện của người dùng hiện tại
    getMyChats: async (req, res) => {
        try {
            const userId = req.user._id;

            const chats = await Chat.find({
                participants: userId,
                isActive: true
            })
                .populate("participants", "name role")
                .sort({ "metadata.lastActivity": -1 });

            return res.status(200).json({ success: true, chats });
        } catch (error) {
            console.error("Error fetching chats:", error);
            return res.status(500).json({ success: false, message: "Không thể lấy danh sách cuộc trò chuyện" });
        }
    },

    // Lấy chi tiết một cuộc trò chuyện
    getChatDetail: async (req, res) => {
        try {
            const { chatId } = req.params;
            const userId = req.user._id;

            const chat = await Chat.findOne({
                _id: chatId,
                participants: userId
            }).populate("participants", "name role");

            if (!chat) {
                return res.status(404).json({ success: false, message: "Không tìm thấy cuộc trò chuyện" });
            }

            return res.status(200).json({ success: true, chat });
        } catch (error) {
            console.error("Error fetching chat details:", error);
            return res.status(500).json({ success: false, message: "Không thể lấy chi tiết cuộc trò chuyện" });
        }
    },

    // Lấy tin nhắn của một cuộc trò chuyện
    getMessage: async (req, res) => {
        try {
            const { chatId } = req.params;
            const userId = req.user._id;
            const { page = 1, limit = 50 } = req.query;

            const chat = await Chat.findOne({
                _id: chatId,
                participants: userId
            });

            if (!chat) {
                return res.status(404).json({ success: false, message: "Không tìm thấy cuộc trò chuyện" });
            }

            // Phân trang và sắp xếp tin nhắn (mới nhất lên trên)
            const skip = (page - 1) * limit;
            const messages = chat.messages
                .sort((a, b) => a.timestamp - b.timestamp)
                .slice(skip, skip + parseInt(limit));

            const totalMessages = chat.messages.length;

            return res.status(200).json({
                success: true,
                messages,
                pagination: {
                    total: totalMessages,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(totalMessages / limit)
                }
            });
        } catch (error) {
            console.error("Error fetching chat messages:", error);
            return res.status(500).json({ success: false, message: "Không thể lấy tin nhắn" });
        }
    },

    // Tạo cuộc trò chuyện mới
    createNewChat: async (req, res) => {
        try {
            const { targetUserId, chatType, title } = req.body;
            const initiatorId = req.user._id;

            if (chatType === "admin-family" && req.user.role === "family_member") {
                const admins = await User.find({ role: "admin" });

                if (!admins || admins.length === 0) {
                    return res.status(404).json({ success: false, message: "Không tìm thấy quản trị viên nào" });
                }

                const adminIds = admins.map(admin => admin._id.toString());
                const participantIds = [initiatorId.toString(), ...adminIds];

                // Kiểm tra đã tồn tại chat nhóm này chưa
                const existingChat = await Chat.findOne({
                    participants: { $all: participantIds },
                    chatType,
                    isActive: true
                });

                if (existingChat) {
                    return res.status(200).json({ success: true, chat: existingChat, message: "Cuộc trò chuyện đã tồn tại" });
                }

                // Tạo mới
                const newChat = new Chat({
                    participants: participantIds,
                    chatType,
                    title: title || "Hỏi quản trị viên",
                    isActive: true,
                    messages: [],
                    metadata: {
                        lastActivity: new Date()
                    }
                });

                await newChat.save();

                // Gửi thông báo tới admin
                adminIds.forEach(adminId => {
                    notifyUser(adminId, "new_chat", {
                        chatId: newChat._id,
                        initiator: {
                            _id: req.user._id,
                            name: req.user.name,
                            role: req.user.role
                        }
                    });
                });

                return res.status(201).json({ success: true, chat: newChat });
            }

            // Kiểm tra người dùng đích tồn tại`
            const targetUser = await User.findById(targetUserId);
            if (!targetUser) {
                return res.status(404).json({ success: false, message: "Không tìm thấy người dùng đích" });
            }

            // Kiểm tra xem chatType có hợp lệ dựa trên vai trò của người dùng không
            let isValidChatType = true;

            const roles = [req.user.role, targetUser.role];

            if (chatType === "admin-staff" &&
                !(roles.includes("admin") && (roles.includes("doctor") || roles.includes("nurse")))) {
                isValidChatType = false;
            } else if (chatType === "admin-family" &&
                !(roles.includes("admin") && roles.includes("family_member"))) {
                isValidChatType = false;
            } else if (chatType === "staff-family" &&
                !((roles.includes("doctor") || roles.includes("nurse")) && roles.includes("family_member"))) {
                isValidChatType = false;
            } else if (chatType === "doctor-nurse" &&
                !(roles.includes("doctor") && roles.includes("nurse"))) {
                isValidChatType = false;
            }

            if (!isValidChatType) {
                return res.status(400).json({ success: false, message: "Loại cuộc trò chuyện không hợp lệ cho vai trò người dùng" });
            }

            // Kiểm tra xem đã có cuộc trò chuyện giữa hai người dùng chưa
            const existingChat = await Chat.findOne({
                participants: { $all: [initiatorId, targetUserId] },
                isActive: true
            });

            if (existingChat) {
                return res.status(200).json({ success: true, chat: existingChat, message: "Cuộc trò chuyện đã tồn tại" });
            }

            // Tạo cuộc trò chuyện mới
            const newChat = new Chat({
                participants: [initiatorId, targetUserId],
                chatType,
                title: title || `Chat với ${targetUser.name}`,
                isActive: true,
                messages: []
            });

            await newChat.save();

            // Thông báo cho người dùng đích
            notifyUser(targetUserId, "new_chat", {
                chatId: newChat._id,
                initiator: {
                    _id: req.user._id,
                    name: req.user.name,
                    role: req.user.role
                }
            });

            return res.status(201).json({ success: true, chat: newChat });
        } catch (error) {
            console.error("Error creating chat:", error);
            return res.status(500).json({ success: false, message: "Không thể tạo cuộc trò chuyện mới" });
        }
    },

    // Gửi tin nhắn mới
    sendNewMessage: async (req, res) => {
        try {
            const { chatId } = req.params;
            const { message } = req.body;
            const senderId = req.user._id;

            // Kiểm tra cuộc trò chuyện tồn tại và người dùng là thành viên
            const chat = await Chat.findOne({
                _id: chatId,
                participants: senderId,
                isActive: true
            });

            if (!chat) {
                return res.status(404).json({ success: false, message: "Không tìm thấy cuộc trò chuyện hoặc bạn không có quyền truy cập" });
            }

            // Thêm tin nhắn mới
            const newMessage = {
                senderId,
                message,
                timestamp: new Date(),
                isRead: false
            };

            console.log('newMessage:', newMessage);
            console.log('newMessage._id instanceof mongoose.Types.ObjectId:', newMessage._id instanceof mongoose.Types.ObjectId);


            chat.messages.push(newMessage);
            chat.metadata.lastActivity = new Date();
            await chat.save();

            // Thông báo cho những người dùng khác trong cuộc trò chuyện
            chat.participants.forEach(participantId => {
                if (participantId.toString() !== senderId.toString()) {
                    notifyUser(participantId.toString(), "new_message", {
                        chatId,
                        message: newMessage
                    });
                }
            });

            return res.status(201).json({ success: true, message: newMessage });
        } catch (error) {
            console.error("Error sending message:", error);
            return res.status(500).json({ success: false, message: "Không thể gửi tin nhắn" });
        }
    },

    // Đánh dấu tin nhắn đã đọc
    isReadMessage: async (req, res) => {
        try {
            const { chatId } = req.params;
            const { messageIds } = req.body;
            const userId = req.user._id;

            const chat = await Chat.findOne({
                _id: chatId,
                participants: userId
            });

            if (!chat) {
                return res.status(404).json({ success: false, message: "Không tìm thấy cuộc trò chuyện" });
            }

            // Cập nhật các tin nhắn đã đọc
            let updated = false;
            chat.messages = chat.messages.map(msg => {
                if (messageIds.includes(msg._id.toString()) &&
                    msg.senderId.toString() !== userId.toString()) {
                    updated = true;
                    return { ...msg.toObject(), isRead: true };
                }
                return msg;
            });

            if (updated) {
                await chat.save();

                // Thông báo cho người gửi tin nhắn
                chat.participants.forEach(participantId => {
                    if (participantId.toString() !== userId.toString()) {
                        notifyUser(participantId.toString(), "messages_read", {
                            chatId,
                            messageIds,
                            readBy: userId
                        });
                    }
                });
            }

            return res.status(200).json({ success: true, message: "Đã đánh dấu tin nhắn là đã đọc" });
        } catch (error) {
            console.error("Error marking messages as read:", error);
            return res.status(500).json({ success: false, message: "Không thể đánh dấu tin nhắn là đã đọc" });
        }
    },

    // Vô hiệu hóa cuộc trò chuyện (chỉ dành cho admin)
    deactivateMessage: async (req, res) => {
        try {
            const { chatId } = req.params;

            const chat = await Chat.findByIdAndUpdate(
                chatId,
                { isActive: false },
                { new: true }
            );

            if (!chat) {
                return res.status(404).json({ success: false, message: "Không tìm thấy cuộc trò chuyện" });
            }

            // Thông báo cho tất cả người tham gia
            chat.participants.forEach(participantId => {
                notifyUser(participantId.toString(), "chat_deactivated", { chatId });
            });

            return res.status(200).json({ success: true, message: "Đã vô hiệu hóa cuộc trò chuyện" });
        } catch (error) {
            console.error("Error deactivating chat:", error);
            return res.status(500).json({ success: false, message: "Không thể vô hiệu hóa cuộc trò chuyện" });
        }
    },

    // API lấy danh sách người dùng có thể trò chuyện (dựa vào vai trò)
    getUserCanChat: async (req, res) => {
        try {
            const role = req.params.role || null;
            const currentUserRole = req.user.role;

            let targetRoles = [];

            // Xác định vai trò người dùng có thể trò chuyện dựa trên vai trò hiện tại
            switch (currentUserRole) {
                case "admin":
                    targetRoles = ["doctor", "nurse", "family_member"];
                    break;
                case "doctor":
                    targetRoles = ["admin", "nurse", "family_member"];
                    break;
                case "nurse":
                    targetRoles = ["admin", "doctor", "family_member"];
                    break;
                case "family_member":
                    targetRoles = ["admin", "doctor", "nurse"];
                    break;
                default:
                    return res.status(400).json({ success: false, message: "Vai trò không hợp lệ" });
            }

            // Nếu role được chỉ định, chỉ lấy người dùng có vai trò đó
            if (role && targetRoles.includes(role)) {
                targetRoles = [role];
            }

            const users = await User.find({
                role: { $in: targetRoles },
                _id: { $ne: req.user._id } // Loại trừ người dùng hiện tại
            }).select("name role");

            return res.status(200).json({ success: true, users });
        } catch (error) {
            console.error("Error fetching available users:", error);
            return res.status(500).json({ success: false, message: "Không thể lấy danh sách người dùng" });
        }
    }
}

export default chatController;