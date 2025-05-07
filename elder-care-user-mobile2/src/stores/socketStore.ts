import { create } from "zustand";
import socket from "../utils/socket";
import useScheduleStore from "./scheduleStore";
import { useModalStore } from "./modalStore";

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
  connect: () => void;
  disconnect: () => void;
  join: (payload: Payload) => void;
  leave: (payload: Payload) => void;
}

export const useSocketStore = create<SocketStore>((set, get) => {
  const { updateSchedule, fetchSchedules } = useScheduleStore.getState();
  const { showModal } = useModalStore.getState();

  const listenToEvents = () => {
    if (get().hasSetupListeners) return; // Tránh trùng lặp

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
      console.log("📦 Đã nhận bookingAccepted:", bookingId);
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

    set({ hasSetupListeners: true }); // Đánh dấu đã đăng ký
  };

  return {
    socket,
    isConnected: false,
    hasSetupListeners: false,

    connect: () => {
      listenToEvents(); // GỌI luôn
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
  };
});
