export interface CompletedBooking {
  bookingId: string;
  patientName: string;
  serviceName: string;
  salary: number;
  completedAt: string; // ISO 8601 format
}
