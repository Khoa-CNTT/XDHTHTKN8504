import { useEffect } from "react";
import useAuthStore from "@/stores/authStore";
import { useSocketStore } from "@/stores/socketStore";
import initService from "@/utils/initService"; // Hàm khởi tạo dịch vụ

const useInitService = () => {
  const { restoreSession } = useAuthStore.getState();
  const {   connect, join } = useSocketStore.getState();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const init = async () => {
      // Phục hồi phiên đăng nhập
      await restoreSession();

      // Nếu đã có token, kết nối socket
      if (token) {
        connect();
        if (user?._id) {
          console.log(`User ID: ${user._id} - đang tham gia phòng`);
          join(user._id);
        } else {
          console.error("Không tìm thấy user ID");
        }
      }

      // Khởi tạo các dịch vụ khác (gọi API ban đầu)
      await initService();
    };

    init();
  }, [token]);
};

export default useInitService;
