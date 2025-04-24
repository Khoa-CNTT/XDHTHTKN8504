import { useEffect } from "react";
import { Redirect } from "expo-router";
import useAuthStore from "../stores/authStore";
import initService from "../utils/initService"; // Import initService

export default function Index() {
  const token = useAuthStore((state) => state.token);
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    // Gọi restoreSession để khôi phục phiên đăng nhập
    restoreSession();

    // Sau khi khôi phục phiên đăng nhập, thực hiện khởi tạo các dữ liệu cần thiết
    const initializeData = async () => {
      if (token) {
        await initService(); // Gọi hàm initService nếu người dùng đã đăng nhập
      }
    };

    initializeData();
  }, [token]); // Tái thực hiện khi token thay đổi

  if (loading) return null;

  if (token) {
    return <Redirect href="/screens/tabs/home" />;
  } else {
    return <Redirect href="/screens/auth/Login" />;
  }
}
