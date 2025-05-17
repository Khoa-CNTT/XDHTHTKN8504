import { subMinutes } from "date-fns";

const toUtcPlus7 = (date: Date): Date => {
  return new Date(date.getTime() + 7 * 60 * 60 * 1000);
};

const canStartSchedule = (start: Date): boolean => {
  const nowUtc = new Date();
  const now = toUtcPlus7(nowUtc);

  const allowedStartTime = subMinutes(start, 5);

  console.log("⏰ Now (UTC+7):", now.toISOString());
  console.log("🕒 Start (UTC+7):", start.toISOString());
  console.log("🟡 Allowed Start (UTC+7):", allowedStartTime.toISOString());

  return now >= allowedStartTime;
};

export default canStartSchedule;
