import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Không thể gửi thông báo - quyền bị từ chối!");
      return;
    }
  } else {
    alert("Phải dùng thiết bị vật lý để nhận thông báo.");
  }
}

// Tuỳ chọn: cấu hình hiển thị
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true, // thêm dòng này
    shouldShowList: true, // và dòng này

    
  }),
});