import { useEffect } from "react";
import useAuthStore from "@/stores/authStore";
import { useSocketStore } from "@/stores/socketStore";
import initService from "@/utils/initService"; // Hàm khởi tạo dịch vụ
import { loadAllSounds } from "@/utils/soundService";
import { log } from "../utils/logger";
import * as Notifications from "expo-notifications";


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
    const requestNotificationPermission = async () => {
      try {
        // Kiểm tra quyền hiện tại
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        // Nếu chưa được cấp, yêu cầu cấp quyền
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          console.warn("Notification permission not granted!");
          // Có thể hiện message hoặc fallback xử lý khác ở đây
          return false;
        }
        return true;
      } catch (error) {
        console.error("Error requesting notification permission:", error);
        return false;
      }
    };

    const init = async () => {
      const permissionGranted = await requestNotificationPermission();

      if (!permissionGranted) {
        // Nếu không có quyền notification, bạn vẫn có thể xử lý tiếp hoặc thoát
        log("Không được cấp quyền thông báo");
      }

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
