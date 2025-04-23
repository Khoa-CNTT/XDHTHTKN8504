import { Server as SocketIO } from 'socket.io';
import { checkPermissions } from '../controllers/chatController.js';

const socketController = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected: ', socket.id);

        // Khi user đăng nhập thì join vào phòng riêng theo userId
        socket.on('join', (userId) => {
            const room = `chat_room_${userId}`;
            socket.join(room);
            console.log(`User ${userId} joined room: ${room}`);
        });

        // Lắng nghe gửi tin nhắn
        socket.on('sendMessage', async (data) => {
            try {
                const { senderId, receiverId, message } = data;

                const isAllowed = await checkPermissions(senderId, receiverId);
                if (!isAllowed) {
                    socket.emit('messageError', 'You do not have permission to message this user');
                    return;
                }

                const receiverRoom = `chat_room_${receiverId}`;

                // Gửi tin nhắn vào phòng của người nhận
                io.to(receiverRoom).emit('receiveMessage', {
                    senderId,
                    message,
                    timestamp: new Date(),
                });

                console.log(`Message from ${senderId} to ${receiverId}: ${message}`);
            } catch (error) {
                console.error('Error in sendMessage event:', error);
                socket.emit('messageError', 'Server error occurred while sending message');
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

export default socketController;
