import { subMinutes } from "date-fns";

const canStartSchedule = (start: Date): boolean => {
  const now = new Date();
  const allowedStartTime = subMinutes(start, 75); // Trừ 5 phút

  return now >= allowedStartTime;
};

export default canStartSchedule;
