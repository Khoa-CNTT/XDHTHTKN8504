import { subMinutes, parseISO } from "date-fns";

const canStartSchedule = (start: Date): boolean => {
  const now = new Date();
  const allowedStartTime = new Date(start.getTime() - 30 * 60 * 1000); // Trừ đi 30 phút

  return now >= allowedStartTime;
};
  
export default canStartSchedule;