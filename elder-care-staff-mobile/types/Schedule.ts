import { TimeSlot } from "./TimeSlot";

export type Schedule = {
  _id: string;
  staffId: string;
  role: string;
  bookingId: string;
  patientName: string;
  date: Date; 
  timeSlots: TimeSlot[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};
