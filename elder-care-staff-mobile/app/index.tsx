import { useEffect } from "react";
import { Redirect } from "expo-router";

export default function Index() {
  useEffect(() => {
    // Có thể thêm logging nếu cần
  }, []);

  return <Redirect href="/screens/splash-screen" />;
}
