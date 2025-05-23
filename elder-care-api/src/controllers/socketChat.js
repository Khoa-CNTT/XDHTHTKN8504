import { Server as SocketIO } from "socket.io";
import User from "../models/User.js";
import Chat from "../models/Chat.js";

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
                socket.userId = userId; // Lưu userId vào socket instance

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

                // Thông báo user online cho những người khác
                socket.broadcast.emit("user_online", { userId });

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

                // Kiểm tra chat đã tồn tại chưa
                const existingChat = await Chat.findOne({
                    participants: { $all: [initiatorId, targetId] },
                    isActive: true
                });

                if (existingChat) {
                    // Tham gia vào room nếu chưa join
                    socket.join(`chat_${existingChat._id}`);
                    const targetSocketId = userSocketMap.get(targetId);
                    if (targetSocketId) {
                        io.sockets.sockets.get(targetSocketId)?.join(`chat_${existingChat._id}`);
                    }

                    socket.emit("chat_initialized", existingChat);
                    return;
                }

                // Tạo chat mới
                const newChat = new Chat({
                    participants: [initiatorId, targetId],
                    chatType,
                    title: title || `Chat between ${initiator.name} and ${target.name}`,
                    isActive: true,
                    messages: [],
                    metadata: { lastActivity: new Date() }
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

        // Join chat room
        socket.on("join_chat", async ({ chatId }) => {
            try {
                if (!socket.userId) {
                    socket.emit("chat_error", "User not authenticated");
                    return;
                }

                const hasAccess = await checkChatAccess(socket.userId, chatId);
                if (hasAccess) {
                    socket.join(`chat_${chatId}`);
                    console.log(`✅ User ${socket.userId} joined chat room: chat_${chatId}`);
                } else {
                    socket.emit("chat_error", "Access denied to this chat");
                }
            } catch (error) {
                console.error("Error joining chat:", error);
                socket.emit("chat_error", "Failed to join chat");
            }
        });

        // Leave chat room
        socket.on("leave_chat", ({ chatId }) => {
            socket.leave(`chat_${chatId}`);
            console.log(`User ${socket.userId} left chat room: chat_${chatId}`);
        });

        // Gửi tin nhắn
        socket.on("send_message", async ({ chatId, senderId, message }) => {
            try {
                console.log(`📨 [Socket] Sending message to chat ${chatId} from ${senderId}`);

                // Kiểm tra quyền truy cập
                const hasAccess = await checkChatAccess(senderId, chatId);
                if (!hasAccess) {
                    socket.emit("message_error", "Access denied to this chat");
                    return;
                }

                const timestamp = new Date();

                // Lưu tin nhắn vào database và lấy chat updated
                const chat = await Chat.findByIdAndUpdate(
                    chatId,
                    {
                        $push: {
                            messages: {
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

                // Lấy message vừa được tạo (message cuối cùng với MongoDB _id)
                const newMessage = chat.messages[chat.messages.length - 1];

                console.log(`📤 [Socket] Broadcasting message to chat_${chatId}:`, {
                    messageId: newMessage._id.toString(),
                    senderId,
                    message: message.substring(0, 50) + '...'
                });

                // Phát tin nhắn đến room chat với đầy đủ thông tin
                io.to(`chat_${chatId}`).emit("receive_message", {
                    chatId,
                    messageId: newMessage._id.toString(), // ✅ MongoDB ObjectId as string
                    senderId,
                    message,
                    timestamp,
                    isRead: false
                });

                console.log(`✅ Message sent successfully in chat ${chatId} by ${senderId}`);

            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("message_error", "Failed to send message");
            }
        });

        // Đánh dấu tin nhắn đã đọc
        socket.on("mark_as_read", async ({ chatId, userId, messageIds }) => {
            try {
                console.log(`👀 [Socket] Marking messages as read in chat ${chatId} by ${userId}`);

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
                        return { ...msg.toObject(), isRead: true };
                    }
                    return msg;
                });

                if (updated) {
                    await chat.save();

                    // Thông báo cho những người khác trong cuộc trò chuyện
                    socket.to(`chat_${chatId}`).emit("messages_read", {
                        chatId,
                        messageIds,
                        readBy: userId
                    });

                    console.log(`✅ Messages marked as read in chat ${chatId}`);
                }

            } catch (error) {
                console.error("Error marking messages as read:", error);
                socket.emit("read_error", "Failed to mark messages as read");
            }
        });

        // Typing indicators
        socket.on("typing_start", ({ chatId, userId }) => {
            socket.to(`chat_${chatId}`).emit("user_typing", {
                chatId,
                userId,
                isTyping: true
            });
        });

        socket.on("typing_stop", ({ chatId, userId }) => {
            socket.to(`chat_${chatId}`).emit("user_typing", {
                chatId,
                userId,
                isTyping: false
            });
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
                socket.broadcast.emit("user_disconnected", { userId: disconnectedUserId });
                console.log(`🔌 User ${disconnectedUserId} disconnected`);
            }

            console.log("A user disconnected: ", socket.id);
        });

        // Error handling
        socket.on("error", (error) => {
            console.error("Socket error for user", socket.userId, ":", error);
        });
    });

    io.on("error", (error) => {
        console.error("Socket.IO error:", error);
    });
};

// Chức năng gửi thông báo cho một vai trò cụ thể
export const notifyRole = (role, event, data) => {
    if (ioInstance) {
        console.log(`🔔 [Server] Notifying role ${role} with event: ${event}`);
        ioInstance.to(`role_${role}`).emit(event, data);
    }
};

// Chức năng gửi thông báo đến một người dùng cụ thể
export const notifyUser = (userId, event, data) => {
    if (ioInstance) {
        console.log(`🔔 [Server] Notifying user ${userId} with event: ${event}`, data);
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

// Get all connected users
export const getConnectedUsers = () => {
    return Array.from(userSocketMap.keys());
};

// Get socket ID by user ID
export const getSocketIdByUserId = (userId) => {
    return userSocketMap.get(userId);
};

console.log("✅ WebSocket server đang chạy!");

export default socketController;