// useEnsureSocket.ts
import { useEffect } from "react";
import { useSocketStore } from "@/stores/socketStore";
import useAuthStore from "@/stores/authStore";

export function useEnsureSocket() {
  const user = useAuthStore((state) => state.user);
  const isReady = useAuthStore((state) => state.isHydrated); // bạn cần thêm biến này khi persist
  const connect = useSocketStore((state) => state.connect);
  const disconnect = useSocketStore((state) => state.disconnect);

  useEffect(() => {
    if (isReady && user?.id) {
      connect();
    } else {
      disconnect();
    }
  }, [isReady, user?.id]);
}
