export const isWithinNextHour = (startTime: string | Date): boolean => {
  const now = new Date();
  const start = new Date(startTime);

  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  return start >= now && start <= oneHourLater;
};
