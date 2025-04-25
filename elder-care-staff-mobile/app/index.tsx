import { useEffect } from "react";
import { Redirect } from "expo-router";
import useAuthStore from "../stores/authStore";
import initService from "../utils/initService";

export default function Index() {
  const token = useAuthStore((state) => state.token);
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const loading = useAuthStore((state) => state.loading);
  const isHydrated = useAuthStore((state) => state.isHydrated); // 👈 Thêm isHydrated

  // Gọi restoreSession chỉ 1 lần khi app load
  useEffect(() => {
    restoreSession();
  }, []);

  // Khi đã khôi phục phiên và có token, thì mới gọi initService
  useEffect(() => {
    if (isHydrated && token) {
      initService(); // Gọi socket connect và các khởi tạo khác
    }
  }, [isHydrated, token]);

  if (!isHydrated || loading) return null; // Chờ khôi phục xong

  if (token) {
    return <Redirect href="/screens/tabs/home" />;
  } else {
    return <Redirect href="/screens/auth/Login" />;
  }
}
