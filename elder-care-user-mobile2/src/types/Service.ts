

export type Role = "doctor" | "nurse";

export interface Service {
  _id: string; // ID do MongoDB tạo ra
  name: string;
  description?: string;
  price: number;
  percentage: number;
  isActive: boolean;
  role: Role;
  imgUrl?: string;
  createdAt: string;
  updatedAt: string;
}
