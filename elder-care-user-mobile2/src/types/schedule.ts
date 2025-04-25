import { TimeSlot } from "./timeSlot";
import { ScheduleStatus } from "./ScheduleStatus";
export interface Schedule {
  _id: string;
  staffName: string;
  staffAvatar: string;
  serviceName: string;
  status: ScheduleStatus;
  timeSlots: TimeSlot;
}
