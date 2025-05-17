import { create } from "zustand";

export interface ChatMessage {
  id: string;
  text: string;
  time: string;
  isReceived: boolean;
  roomId: string;
}

interface ChatStore {
  messages: Record<string, ChatMessage[]>;
  addMessage: (message: ChatMessage) => void;
  clearMessages: (roomId: string) => void;
  getMessagesByRoom: (roomId: string) => ChatMessage[];
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: {},

  addMessage: (message) =>
    set((state) => {
      const roomMessages = state.messages[message.roomId] || [];

      // Kiểm tra tin nhắn trùng id
      const isDuplicate = roomMessages.some((msg) => msg.id === message.id);

      if (isDuplicate) {
        console.log("⚠️ Tin nhắn trùng, không thêm:", message.id);
        return state;
      }

      return {
        messages: {
          ...state.messages,
          [message.roomId]: [...roomMessages, message],
        },
      };
    }),

  clearMessages: (roomId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [],
      },
    })),

  getMessagesByRoom: (roomId) => {
    return get().messages[roomId] || [];
  },
}));
