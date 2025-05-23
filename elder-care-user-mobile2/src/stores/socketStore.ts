import { create } from "zustand";
import socket from "../utils/socket";
import { registerSocketListeners } from "../hooks/useSocket";


interface SocketStore {
  socket: typeof socket;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  join: (payload: {
    userId?: string;
    role?: string;
    scheduleId?: string;
  }) => void;
  leave: (payload: {
    userId?: string;
    role?: string;
    scheduleId?: string;
  }) => void;
}

export const useSocketStore = create<SocketStore>((set, get) => {

  registerSocketListeners();

  socket.on("connect", () => set({ isConnected: true }));
  socket.on("disconnect", () => set({ isConnected: false }));

  return {
    socket,
    isConnected: false,

    connect: () => {
      if (!socket.connected) {
        console.log("🔌 Đang kết nối socket...");
        socket.connect();
      }
    },

    disconnect: () => {
      if (socket.connected) socket.disconnect();
    },

    join: ({ userId, role, scheduleId }) => {
      socket.emit("join", { userId, role, scheduleId });
      console.log("✅ Gửi yêu cầu join phòng:", { userId, role, scheduleId });
    },

    leave: ({ userId, role, scheduleId }) => {
      if (socket.connected && userId && scheduleId) {
        socket.emit("leave", { userId, role, scheduleId });
        console.log("👋 Rời phòng:", { userId, role, scheduleId });
      }
    },
  };
});
