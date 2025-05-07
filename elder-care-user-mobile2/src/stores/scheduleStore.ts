import { create } from "zustand";
import { Schedule } from "../types/schedule";
import getNearestSchedule from "../utils/getNearestSchedule";
import getSchedules from "../api/scheduleApi";

interface ScheduleUser {
  schedule: Schedule;
  staffFullName: string;
  staffPhone: string;
  staffAvatar?: string;
}

interface ScheduleStore {
  schedules: ScheduleUser[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchSchedules: () => Promise<void>;
  setSchedules: (schedules: ScheduleUser[]) => void;
  updateSchedule: (updatedSchedule: Schedule) => void;
  getScheduleById: (id: string) => Schedule | undefined;
}

const useScheduleStore = create<ScheduleStore>((set, get) => ({
  schedules: [],
  loading: false,
  error: null,
  hasFetched: false,

  setSchedules: (schedules) => {
    const filtered = schedules.filter(
      (s) =>
        s.schedule.status !== "completed" && s.schedule.status !== "cancelled"
    );
    set((state) => ({
      schedules: filtered,
    }));
  },

  fetchSchedules: async () => {
    set({ loading: true, error: null });

    try {
      const schedules = await getSchedules();
      console.log("Schedules:", schedules);
      if (!Array.isArray(schedules)) {
        throw new Error("Dữ liệu không hợp lệ");
      }
  
      const filtered = schedules.filter(
        (s) =>
          s.schedule.status !== "completed" && s.schedule.status !== "cancelled"
      );
      console.log("Filtered Schedules:", filtered);
      
      set({
        schedules: schedules,
        loading: false,
        error: null,
        hasFetched: true,
      });
    } catch (err: any) {
      set({
        schedules: [],
        loading: false,
        error: err?.message || "Lỗi khi tải dữ liệu",
        hasFetched: true,
      });
    }
  },

  updateSchedule: (updatedSchedule: Schedule) => {
    set((state) => {
      const updatedSchedules = state.schedules.map((schedule) =>
        schedule.schedule._id === updatedSchedule._id
          ? { ...schedule, schedule: updatedSchedule }
          : schedule
      );

      return {
        schedules: updatedSchedules,
      };
    });
  },

  getScheduleById: (id: string) => {
    const schedules = get().schedules;
    return schedules.find((schedule) => schedule.schedule._id === id)?.schedule;
  },
}));

export default useScheduleStore;
