import { create } from "zustand";
import { Schedule } from "../../types/Schedule";

interface ScheduleStore {
  schedules: Schedule[];
  selectedDay: Date;
  setSchedules: (schedules: Schedule[]) => void;
  setSelectedDay: (day: Date) => void;
}

const useScheduleStore = create<ScheduleStore>((set) => ({
  schedules: [],
  selectedDay: new Date(),
  setSchedules: (schedules) => set({ schedules }),
  setSelectedDay: (date) => set({ selectedDay: date }),
}));

export default useScheduleStore;
