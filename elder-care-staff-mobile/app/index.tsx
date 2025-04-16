// app/index.tsx
import { useEffect } from "react";
import { Redirect } from "expo-router";
import useAuthStore from "./stores/authStore";

export default function Index() {
  const token = useAuthStore((state) => state.token);
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    restoreSession();
  }, []);

  if (loading) return null; // hoặc bạn có thể show loading UI
  // Nếu đã đăng nhập, chuyển hướng tới màn chính
  if (token) {
    return <Redirect href="/screens/tabs/home" />;
  }
  // Nếu chưa, chuyển hướng tới trang login
  return <Redirect href="/screens/chat" />;
}
