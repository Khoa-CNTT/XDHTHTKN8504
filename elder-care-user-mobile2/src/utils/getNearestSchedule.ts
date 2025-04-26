import { Schedule } from "../types/schedule";
import moment from "moment-timezone";

const getNearestSchedule = (schedules: Schedule[]): Schedule | null => {
  const now = moment().tz("Asia/Ho_Chi_Minh");

  const futureSchedules = schedules.filter(schedule => {
    const slot = schedule.timeSlots;
    if (!slot || !slot.start || schedule.status === "cancelled") return false;

    const scheduleTime = moment(slot.start).tz("Asia/Ho_Chi_Minh");
    return scheduleTime.isAfter(now); // Chỉ lấy các lịch trong tương lai
  });

  if (futureSchedules.length === 0) {
    console.log("Không có lịch nào trong tương lai.");
    return null;
  }

  const nearestSchedule = futureSchedules.reduce((nearest, current) => {
    const nearestTime = moment(nearest.timeSlots.start).tz("Asia/Ho_Chi_Minh");
    const currentTime = moment(current.timeSlots.start).tz("Asia/Ho_Chi_Minh");
    return currentTime.isBefore(nearestTime) ? current : nearest;
  });

  return nearestSchedule;
};
export default getNearestSchedule;
