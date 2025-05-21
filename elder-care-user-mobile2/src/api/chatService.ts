import API from "../utils/api";
import { Chat, ChatMessage } from "../types/Chat"; 
import useAuthStore from "../stores/authStore";
import { log } from "../utils/logger";

interface GetChatDetailResponse {
  chat: Chat;
}

export const getChatDetail = async (chatId: string): Promise<Chat> => {
  const token = useAuthStore.getState().token;
  try {
    const response = await API.get<GetChatDetailResponse>(`/chats/${chatId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }  
    );
    return response.data.chat;
  } catch (error: any) {
    console.error("Lỗi lấy chi tiết chat:", error?.response?.data || error);
    throw new Error(
      error?.response?.data?.message || "Không thể lấy chi tiết chat"
    );
  }
};

interface CreateChatPayload {
  targetUserId: string;
  chatType: Chat["chatType"];
  title?: string;
}

export const createNewChat = async (
  payload: CreateChatPayload
): Promise<Chat> => {
  try {
    const token = useAuthStore.getState().token;
    const response = await API.post<GetChatDetailResponse>("/chats", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
  });
    return response.data.chat as Chat;
  } catch (error: any) {
    log("Lỗi tạo cuộc trò chuyện:", error?.response?.data || error);
    throw new Error(
      error?.response?.data?.message || "Không thể tạo cuộc trò chuyện"
    );
  }
};




interface SendMessagePayload {
  message: string // mặc định: "text", có thể mở rộng sau nếu có file, hình ảnh
}

interface SendMessageResponse {
  message: ChatMessage;
}

export const sendNewChatMessage = async (
  chatId: string,
  message: SendMessagePayload
): Promise<ChatMessage> => {
  try {
    const token = useAuthStore.getState().token;
    const response = await API.post<SendMessageResponse>(
      `/chats/${chatId}/messages`,
      message,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.message as ChatMessage;
  } catch (error: any) {
    log("Lỗi gửi tin nhắn mới:", error?.response?.data || error);
    throw new Error(error?.response?.data?.message || "Không thể gửi tin nhắn");
  }
};
  