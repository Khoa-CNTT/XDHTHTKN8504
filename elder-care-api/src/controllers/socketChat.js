import { Server as SocketIO } from "socket.io";
import User from "../models/User.js";
import Chat from "../models/Chat.js";
import { v4 as uuidv4 } from "uuid";

// Maps để theo dõi các kết nối
const userSocketMap = new Map(); // userId => socketId
const userRoleMap = new Map();   // userId => role
let ioInstance;

// Kiểm tra quyền truy cập chat
const checkChatAccess = async (userId, chatId) => {
    try {
        const chat = await Chat.findById(chatId);
        if (!chat) return false;
        return chat.participants.some(p => p.toString() === userId);
    } catch (error) {
        console.error("Error checking chat access:", error);
        return false;
    }
};

// Tạo room ID dựa trên ID của người dùng
const createPrivateRoomId = (userId1, userId2) => {
    // Sắp xếp ID để đảm bảo cùng một room cho cặp người dùng
    const sortedIds = [userId1, userId2].sort();
    return `private_${sortedIds[0]}_${sortedIds[1]}`;
};

const socketController = (io) => {
    ioInstance = io;

    io.on("connection", async (socket) => {
        console.log("A user connected: ", socket.id);

        // Khi người dùng đăng nhập và kết nối
        socket.on("authenticate", async ({ userId }) => {
            try {
                const user = await User.findById(userId);
                if (!user) {
                    socket.emit("auth_error", "User not found");
                    return;
                }

                // Lưu thông tin người dùng
                userSocketMap.set(userId, socket.id);
                userRoleMap.set(userId, user.role);

                // Người dùng tham gia vào room cá nhân của họ
                socket.join(userId);

                // Tham gia vào room dựa trên vai trò
                socket.join(`role_${user.role}`);

                console.log(`✅ User ${userId} (${user.role}) authenticated and joined rooms`);

                // Thông báo cho người dùng về trạng thái kết nối
                socket.emit("authenticated", {
                    userId: user._id,
                    role: user.role,
                    name: user.name
                });

                // Lấy danh sách các chat hiện có của người dùng
                const userChats = await Chat.find({
                    participants: userId,
                    isActive: true
                }).populate('participants', 'name role');

                // Tham gia vào tất cả các room chat hiện có
                userChats.forEach(chat => {
                    socket.join(`chat_${chat._id}`);
                    console.log(`✅ User ${userId} joined chat room: chat_${chat._id}`);
                });

                // Gửi danh sách chat cho người dùng
                socket.emit("available_chats", userChats);

            } catch (error) {
                console.error("Authentication error:", error);
                socket.emit("auth_error", "Authentication failed");
            }
        });

        // Khởi tạo cuộc trò chuyện mới
        socket.on("initialize_chat", async ({ initiatorId, targetId, chatType, title = "" }) => {
            try {
                // Kiểm tra người dùng tồn tại
                const [initiator, target] = await Promise.all([
                    User.findById(initiatorId),
                    User.findById(targetId)
                ]);

                if (!initiator || !target) {
                    socket.emit("chat_error", "One or more users not found");
                    return;
                }

                // Xác định chatType dựa trên vai trò nếu không được cung cấp
                if (!chatType) {
                    const roles = [initiator.role, target.role];
                    if (
                        roles.includes('admin') &&
                        (roles.includes('nurse') || roles.includes('doctor'))
                    ) {
                        chatType = 'admin-staff';
                    } else if (roles.includes('admin') && roles.includes('family_member')) {
                        chatType = 'admin-family';
                    } else if (
                        (roles.includes('doctor') || roles.includes('nurse')) &&
                        roles.includes('family_member')
                    ) {
                        chatType = 'staff-family';
                    } else if (roles.includes('doctor') && roles.includes('nurse')) {
                        chatType = 'doctor-nurse';
                    }
                }

                // Tạo chat mới
                const newChat = new Chat({
                    participants: [initiatorId, targetId],
                    chatType,
                    title: title || `Chat between ${initiator.name} and ${target.name}`,
                    isActive: true,
                    messages: []
                });

                await newChat.save();

                // Tạo room cho chat
                const chatRoomId = `chat_${newChat._id}`;

                // Thêm người dùng vào room
                const initiatorSocketId = userSocketMap.get(initiatorId);
                const targetSocketId = userSocketMap.get(targetId);

                if (initiatorSocketId) {
                    io.sockets.sockets.get(initiatorSocketId)?.join(chatRoomId);
                }

                if (targetSocketId) {
                    io.sockets.sockets.get(targetSocketId)?.join(chatRoomId);
                }

                // Thông báo cho cả hai người dùng về cuộc trò chuyện mới
                const chatData = await newChat.populate('participants', 'name role');

                io.to(initiatorId).emit("chat_initialized", chatData);
                io.to(targetId).emit("chat_initialized", chatData);

                console.log(`✅ New chat initialized: ${newChat._id} between ${initiatorId} and ${targetId}`);

            } catch (error) {
                console.error("Error initializing chat:", error);
                socket.emit("chat_error", "Failed to initialize chat");
            }
        });

        // Gửi tin nhắn
        socket.on("send_message", async ({ chatId, senderId, message }) => {
            try {
                // Kiểm tra quyền truy cập
                const hasAccess = await checkChatAccess(senderId, chatId);
                if (!hasAccess) {
                    socket.emit("message_error", "Access denied to this chat");
                    return;
                }

                // const messageId = uuidv4();
                const timestamp = new Date();

                // Lưu tin nhắn vào database
                const chat = await Chat.findByIdAndUpdate(
                    chatId,
                    {
                        $push: {
                            messages: {
                                // _id: messageId,
                                senderId,
                                message,
                                timestamp,
                                isRead: false
                            }
                        },
                        "metadata.lastActivity": timestamp
                    },
                    { new: true }
                );

                if (!chat) {
                    socket.emit("message_error", "Chat not found");
                    return;
                }

                // Phát tin nhắn đến room chat
                io.to(`chat_${chatId}`).emit("receive_message", {
                    chatId,
                    // messageId,
                    senderId,
                    message,
                    timestamp,
                    isRead: false
                });

                console.log(`Message sent in chat ${chatId} by ${senderId}`);

            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("message_error", "Failed to send message");
            }
        });

        // Đánh dấu tin nhắn đã đọc
        socket.on("mark_as_read", async ({ chatId, userId, messageIds }) => {
            try {
                // Cập nhật trạng thái đã đọc trong database
                const chat = await Chat.findById(chatId);
                if (!chat) {
                    socket.emit("read_error", "Chat not found");
                    return;
                }

                let updated = false;
                chat.messages = chat.messages.map(msg => {
                    if (messageIds.includes(msg._id.toString()) &&
                        msg.senderId.toString() !== userId) {
                        updated = true;
                        return { ...msg, isRead: true };
                    }
                    return msg;
                });

                if (updated) {
                    await chat.save();
                }

                // Thông báo cho những người khác trong cuộc trò chuyện
                socket.to(`chat_${chatId}`).emit("messages_read", {
                    chatId,
                    messageIds,
                    readBy: userId
                });

            } catch (error) {
                console.error("Error marking messages as read:", error);
                socket.emit("read_error", "Failed to mark messages as read");
            }
        });

        // Khi người dùng ngắt kết nối
        socket.on("disconnect", () => {
            let disconnectedUserId = null;

            // Tìm và xóa người dùng khỏi map
            for (const [userId, socketId] of userSocketMap.entries()) {
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    userSocketMap.delete(userId);
                    userRoleMap.delete(userId);
                    break;
                }
            }

            if (disconnectedUserId) {
                // Thông báo cho các người dùng khác về việc ngắt kết nối
                io.emit("user_disconnected", { userId: disconnectedUserId });
                console.log(`🔌 User ${disconnectedUserId} disconnected`);
            }

            console.log("A user disconnected: ", socket.id);
        });
    });

    io.on("error", (error) => {
        console.error("Socket.IO error:", error);
    });
};

// Chức năng gửi thông báo cho một vai trò cụ thể
export const notifyRole = (role, event, data) => {
    if (ioInstance) {
        ioInstance.to(`role_${role}`).emit(event, data);
    }
};

// Chức năng gửi thông báo đến một người dùng cụ thể
export const notifyUser = (userId, event, data) => {
    if (ioInstance) {
        console.log(`🔔 [Server emit] Event "${event}" to user ${userId}`, data);
        ioInstance.to(userId).emit(event, data);
    }
};

export const getOnlineUsersByRole = (role) => {
    const onlineUsers = [];

    for (const [userId, userRole] of userRoleMap.entries()) {
        if (userRole === role && userSocketMap.has(userId)) {
            onlineUsers.push(userId);
        }
    }

    return onlineUsers;
};

// Kiểm tra người dùng có online không
export const isUserOnline = (userId) => {
    return userSocketMap.has(userId);
};

console.log("✅ WebSocket server đang chạy!");

export default socketController;