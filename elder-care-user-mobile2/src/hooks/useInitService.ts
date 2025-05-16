import { useEffect } from "react";
import useAuthStore from "../stores/authStore";
import { useSocketStore } from "../stores/socketStore";
import initData from "../utils/initData";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/navigation";
import useScheduleStore from "../stores/scheduleStore";
import { loadAllSounds } from "../utils/soundService";

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const useInitService = () => {
  const { restoreSession } = useAuthStore.getState();
  const { connect, join } = useSocketStore.getState();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const navigation = useNavigation<NavigationProp>();

  // Load âm thanh thông báo
  useEffect(() => {
    loadAllSounds();
  }, []);

  // Phục hồi session
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
        return;
      }

      // Bạn có thể lấy token gửi về server ở đây nếu cần
      // const token = (await Notifications.getExpoPushTokenAsync()).data;
      // console.log("Push token:", token);
    }
    registerForPushNotificationsAsync();
  }, []);

  // Khi đã có token và user thì khởi tạo kết nối
  useEffect(() => {
    const afterLoginInit = async () => {
      if (token) {
        try {
          connect(); // Kết nối socket (sẽ gọi listenToEvents bên trong)
          await initData(); // Gọi API lấy dữ liệu

          // Tham gia phòng user
          if (user?._id) {
            join({ userId: user._id });
          }

          // Tham gia các phòng schedule
          const schedules = useScheduleStore.getState().schedules;
          if (schedules.length > 0) {
            schedules.forEach((s) => {
              const scheduleId = s._id;
              useSocketStore.getState().join({ scheduleId });
            });
          }

          // Điều hướng tới Home
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          });
        } catch (err) {
          console.error("Lỗi khởi tạo:", err);
        }
      }
    };

    if (token && user) {
      afterLoginInit();
    }
  }, [token, user, connect, join, navigation]);
};

export default useInitService;
