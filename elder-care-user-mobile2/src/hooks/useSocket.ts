// socketListeners.ts
import socket from "../utils/socket";
import useScheduleStore from "../stores/scheduleStore";
import { useWalletStore } from "../stores/WalletStore";
import { useChatStore } from "../stores/chatStore";
import { useBookingStore } from "../stores/BookingStore";
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

const notifyUser = async (title: string, body: string, data: any = {}) => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data },
    trigger: null,
  });
};

export const registerSocketListeners = () => {
  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });

  socket.on("connect_error", (err) => {
    console.warn("⚠️ Lỗi socket:", err.message);
  });

  socket.on("bookingAccepted", async () => {
    const { fetchWallet } = useWalletStore.getState();
    const { fetchSchedules } = useScheduleStore.getState();
    const { fetchBookings } = useBookingStore.getState();

    await Promise.all([fetchWallet(), fetchSchedules(), fetchBookings()]);
    await notifyUser(
      "Đặt lịch thành công!",
      "Đơn đặt lịch của bạn đã được nhân viên y tế tiếp nhận! Lịch chăm sóc sẽ được cập nhật!"
    );
  });
  socket.on("completedBooking", async(data: any ) =>{
    log("hoàn thành đơn chăm sóc")
    await notifyUser(
      "🧓 Dịch vụ đã hoàn thành",
      "Ca chăm sóc với [Tên nhân viên] đã được thực hiện xong. Quý khách vui lòng đánh giá dịch vụ để chúng tôi phục vụ tốt hơn!"
    );

  });

  socket.on("scheduleStatusUpdated", async ({ scheduleId, newStatus }) => {
    log("Socket: Trạng thái làm việc mới!")
    const { updateSchedule } = useScheduleStore.getState();
    updateSchedule({ scheduleId, newStatus });
    await notifyUser("Cập nhật trạng thái chăm sóc", getStatusLabel(newStatus));
  });

  socket.on("refundWallet", async ({ message, bookingId, refundAmount }) => {
    const { fetchWallet } = useWalletStore.getState();
    const { fetchSchedules } = useScheduleStore.getState();
    const { fetchBookings } = useBookingStore.getState();
    log("Nhận thông báo hủy tiền");
    await notifyUser("💰 Ví đã được hoàn tiền", message, {
      bookingId: bookingId ?? "",
      refundAmount: refundAmount ?? 0,
    });
    await fetchWallet();
    await fetchBookings();
    await fetchSchedules();

  });

  socket.on("BookingSuccessed", async (data) => {
    const { fetchWallet } = useWalletStore.getState();
    const { fetchBookings } = useBookingStore.getState();
    log("Nhận thông báo đặt lịch thành công");
    await notifyUser(data.title, data.message, {
      bookingId: data.bookingId ?? "",
    });
    await Promise.all([fetchWallet(), fetchBookings()]);
  });

  socket.on("new_message", async () => {
    log("nhận được tin nhắn mới");
    await playNotificationSound();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Tin nhắn mới",
        body: "Bạn nhận được tin nhắn mới",
        sound: "default",
      },
      trigger: null,
    });
  });
};
