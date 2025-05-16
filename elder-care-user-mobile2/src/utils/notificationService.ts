// utils/notificationService.ts
import * as Notifications from "expo-notifications";

export const sendLocalNotification = async (title: string, body: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default", // Phát âm thanh mặc định
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null, // Hiển thị ngay
  });
};
