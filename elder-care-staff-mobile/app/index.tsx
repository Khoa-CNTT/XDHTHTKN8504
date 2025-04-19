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

  if (loading) return null;

  if (token) {
    return <Redirect href="/screens/tabs/home" />;
  } else {
    return <Redirect href="/screens/auth/Login" />;
  }
}
