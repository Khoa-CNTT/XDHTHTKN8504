export interface Package {
  _id: string; // ID của gói dịch vụ, thường là chuỗi từ MongoDB
  serviceId: string; // ID của service liên kết (có thể mở rộng thành object nếu populate)
  name: string;
  description: string;
  price: number;
  totalDays: number;
  repeatInterval: number;
  timeWork: number;
  discount?: number;
  createdAt?: string; // hoặc Date nếu bạn parse
  updatedAt?: string; // hoặc Date nếu bạn parse
}
