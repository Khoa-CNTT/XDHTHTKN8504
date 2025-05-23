// src/stores/socketListeners.ts
import socket from "../utils/socket";
import useAuthStore from "../stores/authStore";
import useScheduleStore from "../stores/scheduleStore";
import { useModalStore } from "../stores/modalStore";
import useCompletedBookingStore from "../stores/completedBookingStore";
import useBookingStore from "@/stores/BookingStore";

import { Booking } from "@/types/Booking";
import { log } from "../utils/logger";
import * as Notifications from "expo-notifications";
import { playNotificationSound } from "@/utils/soundService";
import "react-native-get-random-values";

import type { ChatMessage } from "../types/Chat"; 

export const registerSocketListeners = (set: any, get: any) => {
  const { updateSchedule, fetchSchedules, getNearestSchedule } =
    useScheduleStore.getState();
  const { fetchBookingsForParticipant } = useBookingStore.getState();
  const currentUser = useAuthStore.getState().user;
  const { showModal } = useModalStore.getState();

  socket.on("newBookingSignal", (booking: Booking) => {
    const extraInfoUser = useAuthStore.getState().extraInfo;
    if (extraInfoUser?.isAvailable) {
      log("trạng thái hiện tại: ", extraInfoUser.isAvailable);
      set({ newBooking: booking });
    }
  });

  socket.on("bookingAccepted", async (bookingId: string) => {
    await playNotificationSound();
    showModal(
      "Cập nhật trạng thái làm việc",
      "Khách hàng đã sẵn sàng, di chuyển tới thôi nào!",
      {
        type: "popup",
        autoHideDuration: 3000,
      }
    );
    await fetchBookingsForParticipant(), await fetchSchedules();
    await getNearestSchedule();
  });

  socket.on("completedBooking", async (data: any) => {
    log("hoàn thành đơn chăm sóc");
    await playNotificationSound();
    showModal(
      " 🎉 Hoàn thành công việc!",
      "Tuyệt vời! Bạn đã chăm sóc xong cho [Tên khách hàng]. Hãy nhớ hoàn tất báo cáo nếu cần nhé.",
      {
        type: "popup",
        autoHideDuration: 3000,
      }
    );
  });

  socket.on("bookingCancelled", async (data: any) => {
    await playNotificationSound();
    showModal(
      "❌ Lịch hẹn bị hủy",
      "Lịch hẹn với [Tên khách hàng] vào [ngày] đã bị hủy. Vui lòng kiểm tra lại lịch làm việc.",
      {
        type: "popup",
        autoHideDuration: 3000,
      }
    );
    await fetchBookingsForParticipant();
    await fetchSchedules();
    await getNearestSchedule();
  });

  // Đăng ký lắng nghe sự kiện "new_message"
  socket.on(
    "new_message",
    async (payload: { chatId: string; message: ChatMessage }) => {
      try {
        const { chatId, message } = payload;

        console.log("📩 Nhận được tin nhắn mới từ socket", message);
       
        await playNotificationSound();

        // Gửi thông báo đẩy
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Tin nhắn mới",
            body: `Bạn nhận được tin nhắn: "${message.message.replace(
              /["]/g,
              "'"
            )}"`,
            sound: "default",
          },
          trigger: null,
        });
      } catch (error) {
        log("❌ Lỗi xử lý tin nhắn mới:", error);
      }
    }
  );

  socket.on("scheduleStatusUpdated", (data: any) => {
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

  socket.on("connect_error", (err) => {
    console.warn("⚠️ from socketStore :", err.message);
  });

  socket.on("connect", () => {
    set({ isConnected: true });
    const userId = currentUser?._id;
    const role = currentUser?.role;
    socket.emit("join", { userId, role });
  });

  socket.on("disconnect", () => {
    log("❌ Socket disconnected");
    set({ isConnected: false });
  });
};
