import { Server } from 'socket.io'; 
import socketController from '../controllers/socketController.js'; 

function configureSocket(server) {
    const io = new Server(server, {  // Sử dụng Server thay vì Socket
        cors: {
            origin: "*", // Cho phép tất cả các nguồn kết nối
            methods: ["GET", "POST"]
        }
    });

    // Gọi controller xử lý logic socket
    socketController(io);  // Truyền io vào socketController để xử lý logic
}

export default configureSocket;
