import { useEffect } from "react";
import socket from "../utils/socket"; // Socket đã được cấu hình từ utils
import { create } from "zustand";

// Zustand store (tuỳ chọn): theo dõi trạng thái kết nối
interface SocketState {
  isConnected: boolean;
  setConnected: (val: boolean) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  isConnected: false,
  setConnected: (val) => set({ isConnected: val }),
}));

// Hook chính
export const useSocket = (userId: string | null) => {
  const setConnected = useSocketStore((state) => state.setConnected);

  useEffect(() => {
    if (!userId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join", userId);

    const onConnect = () => {
      console.log("✅ Socket connected");
      setConnected(true);
    };

    const onDisconnect = () => {
      console.warn("⚠️ Socket disconnected");
      setConnected(false);
    };

    const onError = (err: any) => {
      console.error("❌ Socket connection error:", err);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onError);

    return () => {
      socket.emit("leave", userId); // Optional: rời khỏi room
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onError);
      socket.disconnect(); // Ngắt kết nối
    };
  }, [userId, setConnected]);

  return socket;
};
