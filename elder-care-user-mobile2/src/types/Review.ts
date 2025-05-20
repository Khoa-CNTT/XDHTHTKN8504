export interface Review {
  _id?: string; // nếu cần ID (thường từ server)
  scheduleId: string;
  bookingId: string;
  reviewer: string;
  staffId: string;
  rating: number;
  comment?: string;
  tags?: string[];
  createdAt?: string; // hoặc Date nếu bạn parse rồi
}
