
export interface CreateBookingRequest {
  profileId: string;
  serviceId: string;
  status?: string;
  notes?: string;
  paymentId?: string | null;
  participants: any[]; // hoặc: number nếu backend chấp nhận
  repeatFrom: string; // "YYYY-MM-DD"
  repeatTo: string; // "YYYY-MM-DD"
  timeSlot: {
    start: string; // "HH:mm"
    end: string;
  };
}
