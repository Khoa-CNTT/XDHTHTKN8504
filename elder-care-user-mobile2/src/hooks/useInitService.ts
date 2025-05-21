import { useEffect } from "react";
import useAuthStore from "../stores/authStore";
import { useSocketStore } from "../stores/socketStore";
import initData from "../utils/initData";
import useScheduleStore from "../stores/scheduleStore";
import { loadAllSounds } from "../utils/soundService";
import { registerForPushNotificationsAsync } from "../utils/notificationService"
// import { preloadAssetsAsync } from "../utils/preloadAssets";

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const useInitService = () => {
  const { restoreSession } = useAuthStore.getState();
  const { connect, join } = useSocketStore.getState();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  // Load âm thanh thông báo
  useEffect(() => {
    loadAllSounds();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);


  // Phục hồi session từ AsyncStorage
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Xin quyền thông báo (Expo)
  useEffect(() => {
    async function registerForPushNotificationsAsync() {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Permission for notifications not granted!");
      }
    }

    registerForPushNotificationsAsync();
  }, []);

  // Khởi tạo dữ liệu sau khi có token và user
  useEffect(() => {
    const afterLoginInit = async () => {
      if (token && user) {
        try {
          connect(); // socket
          await initData(); // API

          // Join room user
          if (user._id) {
            join({ userId: user._id });
          }

          // Join các schedule
          const schedules = useScheduleStore.getState().schedules;
          schedules.forEach((s) => {
            if (s._id) join({ scheduleId: s._id });
          });
        } catch (err) {
          console.error("Lỗi khởi tạo:", err);
        }
      }
    };

    afterLoginInit();
  }, [token, user, connect, join]);
};

export default useInitService;
