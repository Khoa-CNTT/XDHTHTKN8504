// src/stores/socketStore.ts
import { create } from "zustand";
import socket from "../utils/socket";
import { Booking } from "@/types/Booking";

type Payload = {
  userId: string;
  role?: string; // optional
  scheduleId?: string; // optional
};
interface SocketStore {
  socket: typeof socket;
  isConnected: boolean;
  newBooking: Booking | null;
  connect: () => void;
  disconnect: () => void;
  join: (payload: Payload) => void;
  leave: (payload: Payload) => void;
  setNewBooking: (booking: Booking | null) => void;
}

export const useSocketStore = create<SocketStore>((set) => {
  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
    set({ isConnected: true });
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
    set({ isConnected: false });
  });

  socket.on("connect_error", (err) => {
    console.warn("⚠️ from socketStore :", err.message);
  });
  
 socket.on("newBookingSignal", (booking) => {
   console.log("Nhận được booking mới:", booking);
    set({ newBooking: booking });
 });


  return {
    socket,
    isConnected: false,
    newBooking: null,

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
    setNewBooking: (booking) => {
      set({ newBooking: booking });
    },
  };
});
