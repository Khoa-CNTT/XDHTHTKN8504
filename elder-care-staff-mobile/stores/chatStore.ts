// src/stores/chatStore.ts
import { create } from "zustand";

interface Message {
  id: string;
  text: string;
  time: string;
  isReceived: boolean;
}

interface ChatStore {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],

  // Cập nhật tất cả tin nhắn
  setMessages: (messages) => set({ messages }),

  // Thêm tin nhắn mới vào danh sách
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  // Xóa tất cả tin nhắn
  clearMessages: () => set({ messages: [] }),
}));
