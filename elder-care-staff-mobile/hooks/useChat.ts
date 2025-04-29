// src/hooks/useChat.ts
import { useEffect, useState } from "react";
import { useChatStore } from "../stores/chatStore";
import socket from "../utils/socket"; // Giả sử bạn đã cài đặt socket

export const useChat = (roomId: string) => {
  const { messages, addMessage, setMessages, clearMessages } = useChatStore();
  const [joined, setJoined] = useState(false); // Trạng thái phòng đã tham gia hay chưa

  // Khi hook được gọi, tự động tham gia phòng nếu chưa tham gia
  useEffect(() => {
    if (joined) return; // Nếu đã tham gia, không làm gì

    // Tham gia phòng chat
    socket.emit("join", roomId);

    // Đánh dấu là đã tham gia phòng
    setJoined(true);

    // Lắng nghe tin nhắn mới từ socket và cập nhật store
    socket.on("message", (message) => {
      addMessage(message); // Thêm tin nhắn vào store
    });

    // Cleanup khi component bị unmount
    return () => {
      socket.emit("leave", roomId); // Rời phòng khi component unmount
      clearMessages(); // Xóa tất cả tin nhắn khi rời phòng
    };
  }, [roomId, joined, addMessage, clearMessages]);

  // Gửi tin nhắn tới server qua socket
  const sendMessage = (text: string) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isReceived: false,
    };
    socket.emit("sendMessage", newMessage); // Gửi tin nhắn tới server
    addMessage(newMessage); // Thêm tin nhắn vào state local
  };

  return {
    messages,
    sendMessage,
  };
};
