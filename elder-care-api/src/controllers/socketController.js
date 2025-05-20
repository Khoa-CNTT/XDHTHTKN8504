import { Server as SocketIO } from "socket.io";
import { v4 as uuidv4 } from "uuid";

const userSocketMap = new Map(); // userId => socketId
let ioInstance;

const socketController = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("A user connected: ", socket.id);

    socket.on("join", ({ userId, scheduleId, role }) => {
      if (userId) {
        socket.join(userId);
        userSocketMap.set(userId, socket.id);
        console.log(`✅ Joined room: ${userId}`);
      }

      if (role) {
        socket.join(`staff_${role}`);
        console.log(`✅ Joined staff room: staff_${role}`);
      }

      if (scheduleId) {
        const scheduleRoom = `schedule_${scheduleId}`;
        socket.join(scheduleRoom);
        console.log(`✅ Joined room: ${scheduleRoom}`);
      }
    });

    socket.on("send-message", ({ id, roomId, senderId, message }) => {
      const timestamp = new Date().toISOString();

      console.log(`Message from ${senderId}: ${message}`);

      // Phát tin nhắn với id, timestamp
      io.to(`schedule_${roomId}`).emit("receive-message", {
        id,
        roomId,
        senderId,
        message,
        timestamp,
      });
    });

    socket.on("disconnect", () => {
      for (const [uId, sId] of userSocketMap.entries()) {
        if (sId === socket.id) {
          userSocketMap.delete(uId);
          console.log(`🔌 User ${uId} disconnected`);
          break;
        }
      }

      console.log("A user disconnected: ", socket.id);
    });
  });

  io.on("error", (error) => {
    console.error("Socket.IO error:", error);
  });
};

// Gửi cập nhật đến phòng lịch
export const emitScheduleStatus = (scheduleId, data) => {
  if (ioInstance) {
    ioInstance.to(`schedule_${scheduleId}`).emit("scheduleStatusUpdated", data);
  }
};

// Truy xuất socketId từ userId
export const getUserSocketId = (userId) => {
  return userSocketMap.get(userId) || null;
};

console.log("✅ WebSocket server đang chạy!");

export default socketController;
