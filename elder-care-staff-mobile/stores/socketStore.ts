// src/stores/socketStore.ts
import { create } from "zustand";
import socket from "../utils/socket";
import { Booking } from "@/types/Booking";
import { log } from "../utils/logger";
import { registerSocketListeners } from "../hooks/useSocket";
import { v4 as uuidv4 } from "uuid";
import { useChatStore } from "./chatStore";

type Payload = Partial<{
  userId: string;
  role?: string;
  scheduleId?: string;
}>;

type ChatMessage = {
  senderId: string;
  message: string;
  timestamp: string;
};

interface SocketStore {
  socket: typeof socket;
  isConnected: boolean;
  newBooking: Booking | null;
  messages: Record<string, ChatMessage[]>;
  connect: () => void;
  disconnect: () => void;
  join: (payload: Payload) => void;
  leave: (payload: Payload) => void;
  setNewBooking: (booking: Booking | null) => void;
  sendMessage: (roomId: string, message: string, senderId: string) => void;
}

export const useSocketStore = create<SocketStore>((set, get) => {
  // Đăng ký sự kiện socket 1 lần
  registerSocketListeners(set, get);

  return {
    socket,
    isConnected: false,
    newBooking: null,
    messages: {},

    connect: () => {
      if (!socket.connected) {
        log("🔌 Đang kết nối socket...");
        socket.connect();
      }
    },

    disconnect: () => {
      if (socket.connected) {
        socket.disconnect();
      }
    },

    join: ({ userId, role, scheduleId }: Payload) => {
      socket.emit("join", { userId, role, scheduleId });
      log("✅ Đã gửi yêu cầu join rooms:", { userId, role, scheduleId });
    },

    leave: ({ userId, role, scheduleId }: Payload) => {
      if (socket.connected) {
        socket.emit("leave", { userId, role, scheduleId });
        log("👋 Đã gửi yêu cầu leave rooms:", { userId, role, scheduleId });
      }
    },

    setNewBooking: (booking) => {
      set({ newBooking: booking });
    },

    sendMessage: (roomId: string, message: string, senderId: string) => {
      const id = uuidv4();
      socket.emit("send-message", { id, roomId, senderId, message });

      const addMessage = useChatStore.getState().addMessage;
      addMessage({
        id,
        text: message,
        time: new Date().toISOString(),
        isReceived: false,
        roomId,
      });
    },
  };
});
