import { useEffect } from "react";
import useAuthStore from "@/stores/authStore";
import { useSocketStore } from "@/stores/socketStore";
import initService from "@/utils/initService"; // Hàm khởi tạo dịch vụ
import { loadAllSounds } from "@/utils/soundService";
import { log } from "../utils/logger";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../utils/notificationService";


const useInitService = () => {
  const { restoreSession } = useAuthStore.getState();
  const { connect, join, disconnect } = useSocketStore.getState();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  // Load âm thanh notification 1 lần
  useEffect(() => {
    loadAllSounds();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  

  useEffect(() => {
    

    const init = async () => {
      // Phục hồi phiên đăng nhập
      await restoreSession();

      if (token) {
        connect();
        log("Token from init:", token);
        if (user?._id) {
          join({
            userId: user._id,
            role: user.role,
          });
        } else {
          console.error("Không tìm thấy user ID");
        }
      } else {
        disconnect();
        console.log("Token không tồn tại, ngắt kết nối socket.");
      }
      await initService();
    };

    init();
  }, [token]);
};

export default useInitService;
