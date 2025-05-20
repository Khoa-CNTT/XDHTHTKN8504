import { TimeSlot } from "./timeSlot";
import { Service } from "./Service";
import { BookingStatus } from "./BookingStatus";
import { Profile } from "./profile";

export type PopulatedUser = {
  _id: string;
  avatar: string;
};

export type Participant = {
  userId: PopulatedUser; // user đã được populate
  role: "doctor" | "nurse";
  fullName: string;
  acceptedAt: Date;
};

export interface Booking {
  _id: string;
  timeSlot: TimeSlot;
  totalPrice: number;
  totalDiscount: number;
  profileId: Profile;
  serviceId: Service;
  status: BookingStatus;
  notes: string;
  paymentId: string | null;
  participants: Participant[]; // nếu có cấu trúc rõ ràng hơn bạn có thể cập nhật sau
  repeatFrom: string;
  repeatTo: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
