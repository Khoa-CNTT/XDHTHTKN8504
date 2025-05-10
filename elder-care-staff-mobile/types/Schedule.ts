import { TimeSlot } from "./TimeSlot";
import { ScheduleStatus } from "./ScheduleStatus";


export type Schedule = {
  _id: string;
  staffId: string;
  role: string;
  bookingId: string;
  patientName: string;
  serviceName: string;
  date: Date;
  timeSlots: TimeSlot[];
  status: ScheduleStatus;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};
