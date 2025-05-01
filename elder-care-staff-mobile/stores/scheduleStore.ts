import { create } from "zustand";
import getSchedules from "@/api/scheduleApi"; // API fetch lịch trình
import { getNearestSchedule as getNearestScheduleUtil } from "@/utils/getNearestSchedule";
import { Schedule } from "../types/Schedule";

interface ScheduleStore {
  schedules: Schedule[];
  selectedDay: Date;
  nearestSchedule: Schedule | null;
  loading: boolean;
  error: string | null;

  setSchedules: (schedules: Schedule[]) => void;
  setSelectedDay: (day: Date) => void;
  updateSchedule: (updated: Schedule) => void;
  addSchedule: (schedule: Schedule) => void;
  removeSchedule: (scheduleId: string) => void;
  getNearestSchedule: () => void;
  fetchSchedules: () => Promise<void>;
}

const useScheduleStore = create<ScheduleStore>((set, get) => ({
  schedules: [],
  selectedDay: new Date(),
  nearestSchedule: null,
  loading: false,
  error: null,

  setSchedules: (schedules) => set({ schedules }),
  setSelectedDay: (date) => set({ selectedDay: date }),

  updateSchedule: (updated) =>
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s._id === updated._id ? updated : s
      ),
    })),

  addSchedule: (schedule) =>
    set((state) => ({
      schedules: [...state.schedules, schedule],
    })),

  removeSchedule: (scheduleId) =>
    set((state) => ({
      schedules: state.schedules.filter((s) => s._id !== scheduleId),
    })),

  getNearestSchedule: () => {
    const schedules = get().schedules;
    const nearestSchedule = getNearestScheduleUtil(schedules);
    set({ nearestSchedule });
  },

  fetchSchedules: async () => {
    set({ loading: true, error: null });
    try {
    ;
      
      const schedules = await getSchedules();
      
      set({ schedules, loading: false });

      const nearest = getNearestScheduleUtil(schedules);
      set({ nearestSchedule: nearest });
    } catch (error: any) {
      set({
        error: error?.message || "Lỗi khi tải lịch trình",
        loading: false,
      });
      console.error("Lỗi fetchSchedules:", error);
    }
  },
}));

export default useScheduleStore;
