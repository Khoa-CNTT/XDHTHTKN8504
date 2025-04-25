import { useEffect } from "react";
import useAuthStore from "@/stores/authStore";
import { useSocketStore } from "@/stores/socketStore";
import initService from "@/utils/initService"; // Hàm khởi tạo dịch vụ

const useInitService = () => {
  const { restoreSession } = useAuthStore.getState();
  const { connect } = useSocketStore.getState();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const init = async () => {
      // Phục hồi phiên đăng nhập
      await restoreSession();

      // Nếu đã có token, kết nối socket
      if (token) {
        connect();
      }

      // Khởi tạo các dịch vụ khác (gọi API ban đầu)
      await initService();
    };

    init();
  }, [token]);
};

export default useInitService;
