export interface User {
  _id: string;
  phone: string;
  password: string;
  role: string;
  avatar: string;
  profiles: any[]; // Nếu có định nghĩa cụ thể cho profiles thì thay any bằng type tương ứng
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Staff {
  _id: string;
  userId: User;
  firstName: string;
  lastName: string;
  email: string;
  specialization?: string; // Chỉ có bác sĩ mới có trường này, nên để tùy chọn
  licenseNumber?: string; // Tùy chọn
  experience?: number; // Tùy chọn
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface StaffResponse {
  type: "doctor" | "nurse"; // Nếu chỉ có 2 loại, hoặc có thể là string nếu mở rộng
  staff: Staff;
}
