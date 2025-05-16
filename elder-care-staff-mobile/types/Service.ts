export type RoleType = "doctor" | "nurse";

export interface Service {
  _id?: string; // Có thể có hoặc không nếu dùng cho create/update
  name: string;
  description?: string;
  price: number;
  percentage: number;
  isActive?: boolean;
  role: RoleType;
  imgUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
