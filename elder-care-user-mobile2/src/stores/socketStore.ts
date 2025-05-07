import { create } from "zustand";
import socket from "../utils/socket";
import useAuthStore from "./authStore";
import useScheduleStore from "./scheduleStore"; // Import useScheduleStore
import {useModalStore} from "./modalStore"; // Import useModalStore

type Payload = Partial<{
  userId: string;
  role?: string; // optional
  scheduleId?: string; // optional
}>;

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
  const { schedules, updateSchedule } = useScheduleStore.getState();
  const listenToEvents = () => {
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      set({ isConnected: true });
      const userId = currentUser?._id;
      socket.emit("join", { userId });
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      set({ isConnected: false });
    });

    socket.on("connect_error", (err) => {
      console.warn("⚠️ from socketStore :", err.message);
    });

    socket.on("bookingAccepted", (bookingId: string) => {
      console.log(`😋: Booking đã được được chấp thuận: ${bookingId}`);
      useModalStore
        .getState()
        .showModal(
          "Booking Accepted",
          `Mã booking: ${bookingId} đã được chấp thuận!`
        );
    });

    // Lắng nghe sự kiện "scheduleStatusUpdated" và xử lý khi có dữ liệu mới
    socket.on("scheduleStatusUpdated", (data: any) => {
      console.log("🚨 Lịch hẹn đã được cập nhật:", data);
      const updatedSchedule = data.schedule;
      if (updatedSchedule) {
        // Cập nhật schedule trong store
        updateSchedule(updatedSchedule);
        useModalStore
          .getState()
          .showModal(
            "Cập nhật lịch hẹn",
            `Lịch hẹn đã được cập nhật: ${updatedSchedule._id}`
          );
      }
    });
  };

  return {
    socket,
    isConnected: false,

    connect: () => {
      if (!socket.connected) {
        console.log("Đang kết nối socket...");
        socket.connect();
        listenToEvents();
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
