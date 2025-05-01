// src/stores/socketStore.ts
import { create } from "zustand";
import socket from "../utils/socket";
import useAuthStore from "./authStore";


type Payload = {
  userId: string;
  role?: string; // optional
  scheduleId?: string; // optional
};

interface SocketStore {
  socket: typeof socket;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  join: (payload: Payload) => void;
  leave: (payload: Payload) => void;
}

export const useSocketStore = create<SocketStore>((set) => {
  const currentUser = useAuthStore.getState().user;
  const listenToEvents = () => {
    
    socket.on("bookingAccepted", (bookingId: string) => {
      console.log(`😋: Booking đã được được chấp thuận: ${bookingId}`);
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      set({ isConnected: true });
      const userId = currentUser?._id;
      socket.emit("join", { userId });
      listenToEvents(); // Lắng nghe sự kiện sau khi kết nối
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      set({ isConnected: false });
    });

    socket.on("connect_error", (err) => {
      console.warn("⚠️ from socketStore :", err.message);
    });
  };

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

    join: ({ userId, role, scheduleId }: Payload) => {
      socket.emit("join", { userId, role, scheduleId });
      console.log("✅ Đã gửi yêu cầu join rooms:", {
        userId,
        role,
        scheduleId,
      });
    },

    leave: ({ userId, role, scheduleId }: Payload) => {
      if (socket.connected) {
        socket.emit("leave", { userId, role, scheduleId });
      }
    },
    
  };
});
