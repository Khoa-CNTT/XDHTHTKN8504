export interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  percentage: number;
  isActive: boolean;
  createdAt: string; // hoặc Date nếu bạn xử lý ngày dưới dạng Date object
  updatedAt: string; // hoặc Date
}
