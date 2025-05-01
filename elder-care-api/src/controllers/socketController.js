import { Server as SocketIO } from 'socket.io';
import { checkPermissions } from '../controllers/chatController.js';

let ioInstance;

const socketController = (io) => {
    ioInstance = io; // Lưu trữ instance của Socket.IO để sử dụng ở nơi khác nếu cần

    io.on('connection', (socket) => {
        console.log('A user connected: ', socket.id);

        // Khi người dùng login/join, họ tham gia phòng riêng
        socket.on("join", ({ userId, scheduleId, role }) => {
             if (userId) {
               const userRoom = `chat_room_${userId}`;
               socket.join(userRoom);
               console.log(`✅ Joined room: ${userRoom}`);
             }

             if (role && role.startsWith("staff")) {
               const roleName = role.split("_")[1]; // staff_nurse → nurse
               socket.join(`staff_${roleName}`);
               console.log(`✅ Joined room: staff_${roleName}`);
             }

             if (scheduleId) {
               const scheduleRoom = `schedule_${scheduleId}`;
               socket.join(scheduleRoom);
               console.log(`✅ Joined room: ${scheduleRoom}`);
             }
        });

        // Xử lý gửi tin nhắn
        socket.on('sendMessage', async (data) => {
            try {
                const { senderId, receiverId, message } = data;

                const isAllowed = await checkPermissions(senderId, receiverId);
                if (!isAllowed) {
                    socket.emit('messageError', 'Bạn không có quyền nhắn tin với người này');
                    return;
                }

                const timestamp = new Date();

                io.to(`chat_room_${receiverId}`).emit('receiveMessage', {
                    senderId,
                    receiverId,
                    message,
                    timestamp,
                });

                io.to(`chat_room_${senderId}`).emit('messageSent', {
                    senderId,
                    receiverId,
                    message,
                    timestamp,
                });

                console.log(`Message ${message} from ${senderId} to ${receiverId}`);
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('messageError', 'Lỗi server khi gửi tin nhắn');
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

export const emitScheduleStatus = (scheduleId, data) => {
    if (ioInstance) {
        ioInstance.to(`schedule_${scheduleId}`).emit("scheduleStatusUpdated", data);
    }
};

export const getUserSocketId = (userId) => {
    const socket = ioInstance.sockets.sockets.get(userId);  
    return socket ? socket.id : null;  
};



console.log("✅ WebSocket server đang chạy!");

export default socketController;
