
export interface CreateBookingRequest {
  profileId: string;
  serviceId: string;
  status?: string;
  notes?: string;
  paymentId?: string | null;
  participants: any[]; 
  repeatInterval?: number;
  repeatFrom: string;
  repeatTo: string; 
  timeSlot: {
    start: string;
    end: string;
  };
}
