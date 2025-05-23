import { Profile } from "./profile";
export interface Review {
  _id: string;
  scheduleId: string; // id dạng string (ObjectId thường được serialize thành string)
  bookingId: string;
  reviewer: Profile;
  staffId: string;
  rating: number; // 1 đến 5
  comment?: string;
  tags?: string[];
  createdAt?: string; // hoặc Date, tuỳ theo API trả về dạng nào (thường là ISO string)
}

