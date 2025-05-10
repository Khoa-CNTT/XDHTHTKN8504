import { create } from "zustand";
import { log } from "../utils/logger";
import socket from "../utils/socket";
import { Booking } from "@/types/Booking";
import useAuthStore from "./authStore";
import useScheduleStore from "./scheduleStore";
import { useModalStore } from "./modalStore";
import useCompletedBookingStore from "../stores/completedBookingStore";

type Payload = Partial<{
  userId: string;
  role?: string; // optional
  scheduleId?: string; // optional
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
  messages: Record<string, ChatMessage[]>; // Lưu trữ tin nhắn theo roomId
  connect: () => void;
  disconnect: () => void;
  join: (payload: Payload) => void;
  leave: (payload: Payload) => void;
  setNewBooking: (booking: Booking | null) => void;
  sendMessage: (roomId: string, message: string) => void; // Gửi tin nhắn
  addMessage: (roomId: string, message: ChatMessage) => void; // Thêm tin nhắn
}

export const useSocketStore = create<SocketStore>((set) => {
  const { updateSchedule, fetchSchedules, getNearestSchedule } =
    useScheduleStore.getState();
  const currentUser = useAuthStore.getState().user;
  const { showModal } = useModalStore.getState();

  const listenToEvents = () => {
    socket.on("newBookingSignal", (booking) => {
      const extraInfoUser = useAuthStore.getState().extraInfo;
      if (extraInfoUser?.isAvailable) {
        log("trạng thái hiện tại: ", extraInfoUser.isAvailable);
        set({ newBooking: booking });
      }
    });

    socket.on("bookingAccepted", (bookingId: string) => {
      fetchSchedules();
      getNearestSchedule();
    });

    // Lắng nghe tin nhắn
    socket.on("receive-message", (msg: ChatMessage) => {
      log("Nhận được tin nhắn mới");
      const roomId = msg.senderId; // hoặc lấy phòng từ thông tin tin nhắn nếu cần
      addMessage(roomId, msg); // Lưu tin nhắn vào store
    });

    socket.on("connect", () => {
      set({ isConnected: true });
      const userId = currentUser?._id;
      const role = currentUser?.role;
      socket.emit("join", { userId, role });
      listenToEvents();
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      set({ isConnected: false });
    });

    socket.on("connect_error", (err) => {
      console.warn("⚠️ from socketStore :", err.message);
    });

    socket.on("scheduleStatusUpdated", (data: any) => {
      console.log("🚨 Lịch hẹn đã được cập nhật:", data);
      const { scheduleId, newStatus } = data;
      if (newStatus === "waiting_for_nurse") {
        updateSchedule(scheduleId, newStatus);
        showModal(
          "Cập nhật trạng thái làm việc",
          "Khách hàng đã sẵn sàng, di chuyển tới thôi nào!",
          {
            type: "popup",
            autoHideDuration: 3000,
          }
        );
      }
      if (newStatus === "completed") {
        updateSchedule(scheduleId, newStatus);
        useCompletedBookingStore.getState().fetchCompletedBookings();
        showModal(
          "Cập nhật trạng thái làm việc",
          "Hệ thống xác nhận hoàn tất chăm sóc từ khách hàng.",
          {
            type: "popup",
            autoHideDuration: 3000,
          }
        );
      }
    });
  };

  const sendMessage = (roomId: string, message: string) => {
    const msg: ChatMessage = {
      senderId: currentUser?._id || "",
      message,
      timestamp: new Date().toISOString(),
    };

    socket.emit("send-message", { roomId, ...msg }); // Gửi tin nhắn qua socket
    addMessage(roomId, msg); // Lưu vào store ngay lập tức
  };

  const addMessage = (roomId: string, message: ChatMessage) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [...(state.messages[roomId] || []), message],
      },
    }));
  };

  return {
    socket,
    isConnected: false,
    newBooking: null,
    messages: {},
    connect: () => {
      listenToEvents();
      if (!socket.connected) {
        socket.connect();
        set({ isConnected: true });
      }
    },
    disconnect: () => {
      if (socket.connected) {
        socket.disconnect();
      }
    },
    join: ({ userId, role, scheduleId }: Payload) => {
      socket.emit("join", { userId, role, scheduleId });
      log("✅ Đã gửi yêu cầu join rooms:", {
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
    sendMessage,
    addMessage,
  };
});
