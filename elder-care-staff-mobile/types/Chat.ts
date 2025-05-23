export type ChatType =
  | "admin-staff"
  | "admin-family"
  | "staff-family";

export interface ChatMessage {
  _id: string;
  senderId: string; // ID người gửi
  message: string; // Nội dung tin nhắn
  isRead?: boolean; // Đã đọc chưa (mặc định false)
  timestamp?: string; // ISO string thời gian gửi
}

export interface ChatMetadata {
  relatedTicketId?: string; // ID ticket liên quan (nếu có)
  lastActivity?: string; // ISO string thời gian hoạt động cuối
}

export interface Chat {
  _id?: string; // ID chat
  participants: string[]; // Danh sách người tham gia
  chatType: ChatType; // Loại chat theo enum
  title?: string; // Tiêu đề chat (default: "")
  isActive?: boolean; // Trạng thái chat (default: true)
  messages?: ChatMessage[]; // Danh sách tin nhắn trong chat
  metadata?: ChatMetadata; // Metadata bổ sung
  createdAt?: string; // ISO string ngày tạo
  updatedAt?: string; // ISO string ngày cập nhật
}
