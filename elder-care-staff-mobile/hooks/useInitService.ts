import { useEffect } from "react";
import useAuthStore from "@/stores/authStore";
import { useSocketStore } from "@/stores/socketStore";
import initService from "@/utils/initService"; // Hàm khởi tạo dịch vụ

const useInitService = () => {
  const { restoreSession } = useAuthStore.getState();
  const { connect, join, disconnect } = useSocketStore.getState();
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
          join(user._id); // Tham gia phòng nếu có userId
        } else {
          console.error("Không tìm thấy user ID");
        }
      } else {
        // Nếu không còn token (người dùng đã logout), ngắt kết nối socket
        disconnect();
        console.log("Token không tồn tại, ngắt kết nối socket.");
      }

      // Khởi tạo các dịch vụ khác (gọi API ban đầu)
      await initService();
    };

    init();
  }, [token]); // Chỉ chạy lại khi token thay đổi
};

export default useInitService;
