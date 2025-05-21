import { create } from "zustand";
import socket from "../utils/socket";
import useScheduleStore from "./scheduleStore";
import { useModalStore } from "./modalStore";
import { useWalletStore } from "./WalletStore";
import { useChatStore } from "./chatStore";
import { useBookingStore } from "./BookingStore";
import { v4 as uuidv4 } from "uuid";
import * as Notifications from "expo-notifications";
import { log } from "../utils/logger";
import { playNotificationSound } from "../utils/soundService";

const getStatusLabel = (status: string) =>
  ({
    scheduled: "Đang lên lịch",
    waiting_for_client:
      "Bạn ơi, nhân viên đã sẵn sàng chăm sóc. Bạn đã sẵn sàng chưa?",
    waiting_for_nurse: "Chờ nhân viên xác nhận",
    on_the_way: "Nhân viên đang trên đường tới?",
    check_in: "Nhân viên đã tới nơi",
    in_progress: "Đang thực hiện chăm sóc",
    check_out: "Nhân viên đã hoàn tất, chờ xác nhận của bạn",
    completed: "Ca làm việc đã hoàn tất, chúc bạn một ngày tốt lành!",
    cancelled: "Bị hủy",
    default: "Không thực hiện",
  }[status] || "Không thực hiện");

type Payload = Partial<{ userId: string; role?: string; scheduleId?: string }>;

interface SocketStore {
  socket: typeof socket;
  isConnected: boolean;
  hasSetupListeners: boolean;
  connect: () => void;
  disconnect: () => void;
  join: (payload: Payload) => void;
  leave: (payload: Payload) => void;
  sendMessage: (roomId: string, message: string, senderId: string) => void;
}

const notifyUser = async (title: string, body: string, data: any = {}) => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data },
    trigger: null,
  });
};

export const useSocketStore = create<SocketStore>((set, get) => {
  const { updateSchedule, fetchSchedules } = useScheduleStore.getState();
  const { fetchWallet } = useWalletStore.getState();
  const { fetchBookings } = useBookingStore.getState();

  const listenToEvents = () => {
    if (get().hasSetupListeners) return;

    console.log("🧩 Đăng ký các sự kiện socket...");

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      set({ isConnected: true });
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      set({ isConnected: false });
    });

    socket.on("connect_error", (err) => {
      console.warn("⚠️ Lỗi socket:", err.message);
    });

    socket.on("bookingAccepted", async () => {
      await Promise.all([fetchWallet(), fetchSchedules(), fetchBookings()]);
      useScheduleStore.getState().schedules.forEach((s) => {
        if (s._id) get().join({ scheduleId: s._id });
      });

      await notifyUser(
        "Đặt lịch thành công!",
        "Đơn đặt lịch của bạn đã được nhân viên y tế tiếp nhận! Lịch chăm sóc sẽ được cập nhật!"
      );
    });

    socket.on("scheduleStatusUpdated", async ({ scheduleId, newStatus }) => {
      updateSchedule({ scheduleId, newStatus });
      await notifyUser(
        "Cập nhật trạng thái chăm sóc",
        getStatusLabel(newStatus)
      );
    });

    socket.on("refundWallet", async ({ message, bookingId, refundAmount }) => {
      log("Nhận thông báo hủy tiền");
      await notifyUser("💰 Ví đã được hoàn tiền", message, {
        bookingId: bookingId ?? "",
        refundAmount: refundAmount ?? 0,
      });
      fetchWallet();
    });

    socket.on("newBookingCreated", async (data) => {
      log("Nhận thông báo đặt lịch thành công");
      await notifyUser(data.title, data.message, {
        bookingId: data.bookingId ?? "",
      });
      await Promise.all([fetchWallet(), fetchBookings()]);
    });

    socket.on("new_message", async (data: any) => {
      log("nhận được tin nhắn mới")
      await playNotificationSound();
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Tin nhắn mới",
          body: "Bạn nhận được tin nhắn mới",
          sound: "default",
        },
        trigger: null, // gửi ngay lập tức
      });
    });


    socket.on("receive-message", (data) => {
      const { id, roomId, message, timestamp, senderId } = data;
      useChatStore.getState().addMessage({
        id,
        text: message,
        time: timestamp,
        isReceived: true,
        roomId,
      });
    });

    set({ hasSetupListeners: true });
  };

  return {
    socket,
    isConnected: false,
    hasSetupListeners: false,

    connect: () => {
      listenToEvents();
      if (!socket.connected) {
        console.log("🔌 Đang kết nối socket...");
        socket.connect();
      }
    },

    disconnect: () => {
      if (socket.connected) socket.disconnect();
    },

    join: ({ userId, role, scheduleId }: Payload) => {
      socket.emit("join", { userId, role, scheduleId });
      console.log("✅ Gửi yêu cầu join phòng:", { userId, role, scheduleId });
    },

    leave: ({ userId, role, scheduleId }: Payload) => {
      if (socket.connected && userId && scheduleId) {
        socket.emit("leave", { userId, role, scheduleId });
        console.log("👋 Rời phòng:", { userId, role, scheduleId });
      }
    },

    sendMessage: (roomId: string, message: string, senderId: string) => {
      const id = uuidv4();
      socket.emit("send-message", { id, roomId, senderId, message });
      useChatStore.getState().addMessage({
        id,
        text: message,
        time: new Date().toISOString(),
        isReceived: false,
        roomId,
      });
    },
  };
});
