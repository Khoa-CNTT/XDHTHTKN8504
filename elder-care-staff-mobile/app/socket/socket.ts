// src/sockets/socket.ts
import { io, Socket } from "socket.io-client";
let socket: Socket | null = null;

export const connectSocket = (staffId: string) => {
  socket = io(, {
    transports: ["websocket"],
    reconnection: true,
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket?.id);
    socket?.emit("join", staffId); // Join room riêng
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });
};

export const getSocket = (): Socket | null => socket;
