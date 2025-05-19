import { create } from "zustand";
import socket from "../utils/socket";
import useScheduleStore from "./scheduleStore";
import { useModalStore } from "./modalStore";
import { useWalletStore } from "./WalletStore";
import { useChatStore } from "./chatStore";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import * as Notifications from "expo-notifications";
import { log } from "../utils/logger";


const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
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
  };
  return statusMap[status] || statusMap["default"];
};

type Payload = Partial<{
  userId: string;
  role?: string;
  scheduleId?: string;
}>;

interface SocketStore {
  socket: typeof socket;
  isConnected: boolean;
  hasSetupListeners: boolean;
  messages: Record<string, any[]>;
  connect: () => void;
  disconnect: () => void;
  join: (payload: Payload) => void;
  leave: (payload: Payload) => void;
  sendMessage: (roomId: string, message: string, senderId: string) => void;
  
}

export const useSocketStore = create<SocketStore>((set, get) => {
  const { updateSchedule, fetchSchedules } = useScheduleStore.getState();
  const {fetchWallet} = useWalletStore.getState();
  const { showModal } = useModalStore.getState();

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

    socket.on("bookingAccepted", async (bookingId: string) => {
      await fetchWallet();
      await fetchSchedules();
      const schedules = useScheduleStore.getState().schedules;
      schedules.forEach((schedule) => {
        if (schedule._id) {
          get().join({ scheduleId: schedule._id });
        }
      });
      showModal(
        "Chấp thuận đơn đặt lịch",
        "Đơn đặt lịch của bạn đã tìm thấy người chăm sóc!",
        {
          type: "popup",
          autoHideDuration: 3000,
        }
      );
    });

    socket.on("scheduleStatusUpdated", (data: any) => {
      console.log("🚨 Lịch hẹn đã được cập nhật:", data);
      const { scheduleId, newStatus } = data;
      const message = getStatusLabel(newStatus);
      updateSchedule({ scheduleId, newStatus });
      showModal("Cập nhật trạng thái lịch", message, {
        type: "popup",
        autoHideDuration: 2000,
      });
    });
    socket.on("refundWallet", async (data) => {
      log("Nhận thông báo hủy tuên")
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "💰 Ví đã được hoàn tiền",
          body: data.message,
          data: data, // có thể truyền thêm dữ liệu
        },
        trigger: null, // Phát ngay lập tức
      });
      fetchWallet();
    });
    socket.on("BookingSuccessed", async(data) =>{
      log("Nhận thông báo đặt lịch thành công")
      const {title, message} = data;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: message,
          data: data,
        },
        trigger: null,
      });
      fetchWallet();
    })

    socket.on("receive-message", (data: {
      id: string;
      roomId: string;
      senderId: string;
      message: string;
      timestamp: string;
    }) => {
      const { id, roomId, message, timestamp } = data;
      const addMessage = useChatStore.getState().addMessage;

      addMessage({
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
    messages: {},

    connect: () => {
      listenToEvents();
      if (!socket.connected) {
        console.log("🔌 Đang kết nối socket...");
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

      const addMessage = useChatStore.getState().addMessage;
      addMessage({
        id, // tạm id khi gửi (có thể sửa lại)
        text: message,
        time: new Date().toISOString(),
        isReceived: false,
        roomId,
      });
    },
  };
});
