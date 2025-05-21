import { Server } from 'socket.io';
import socketController from '../controllers/socketController.js';
import socketChat from '../controllers/socketChat.js';

let io;

function configureSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
        }
    });

    socketChat(io);
    socketController(io);
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.IO not initialized!");
    }
    return io;
}

export default configureSocket;
