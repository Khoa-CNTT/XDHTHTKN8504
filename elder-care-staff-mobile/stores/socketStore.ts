// src/stores/socketStore.ts
import { create } from "zustand";
import socket from "../utils/socket";

interface SocketStore {
  socket: typeof socket;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
}

export const useSocketStore = create<SocketStore>((set) => {
  // Đăng ký sự kiện chỉ 1 lần
  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
    set({ isConnected: true });
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
    set({ isConnected: false });
  });

  socket.on("connect_error", (err) => {
    console.warn("⚠️ Socket connect error:", err.message);
  });

  return {
    socket,
    isConnected: false,

    connect: () => {
       if (!socket.connected) {
         console.log("Đang kết nối socket...");
         socket.connect();
         set({ isConnected: true });
       }
    },

    disconnect: () => {
      if (socket.connected) {
        socket.disconnect(); // 'disconnect' event sẽ tự set lại isConnected
      }
    },

    joinRoom: (roomId) => {
      if (socket.connected) {
        socket.emit("joinRoom", roomId);
      }
    },

    leaveRoom: (roomId) => {
      if (socket.connected) {
        socket.emit("leaveRoom", roomId);
      }
    },
  };
});
