import { Server as SocketIO } from 'socket.io';
import { checkPermissions } from '../controllers/chatController.js';

let ioInstance;

const socketController = (io) => {
    ioInstance = io; // Lưu trữ instance của Socket.IO để sử dụng ở nơi khác nếu cần

    io.on('connection', (socket) => {
        console.log('A user connected: ', socket.id);

        // Khi người dùng login/join, họ tham gia phòng riêng
        socket.on('join', (userId) => {
            const room = `chat_room_${userId}`;
            socket.join(room);
            console.log(`User ${userId} joined room: ${room}`);
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

export const emitScheduleStatus = (userId, data) => {
    if (ioInstance) {
        ioInstance.to(`chat_room_${userId}`).emit('scheduleStatusUpdated', data);
    }
};


export default socketController;
