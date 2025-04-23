import { PatientProfile } from "./PatientProfile";
import { TimeSlot } from "./TimeSlot";
import { Service } from "./Service";
import { BookingStatus } from "./BookingStatus";

export interface Booking {
  _id: string;
  timeSlot: TimeSlot;
  totalPrice: number;
  totalDiscount: number;
  profileId: PatientProfile;
  serviceId: Service;
  status: BookingStatus;
  notes: string;
  paymentId: string | null;
  participants: any[]; // nếu có cấu trúc rõ ràng hơn bạn có thể cập nhật sau
  repeatFrom: string;
  repeatTo: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
