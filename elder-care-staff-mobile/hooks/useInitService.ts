import { useEffect } from "react";
import useAuthStore from "@/stores/authStore";
import { useSocketStore } from "@/stores/socketStore";
import initService from "@/utils/initService"; // Hàm khởi tạo dịch vụ
import { loadAllSounds } from "@/utils/soundService";
import {log} from "../utils/logger";

const useInitService = () => {
  const { restoreSession } = useAuthStore.getState();
  const { connect, join, disconnect } = useSocketStore.getState();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    loadAllSounds();
  }, []);
  useEffect(() => {
    const init = async () => {
      // Phục hồi phiên đăng nhập
      await restoreSession();

      // Nếu đã có token, kết nối socket
      if (token) {
        connect();
        log('Tokem from init:', token )
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
