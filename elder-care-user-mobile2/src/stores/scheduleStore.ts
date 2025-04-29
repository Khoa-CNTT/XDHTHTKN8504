import { create } from "zustand";
import { Schedule } from "../types/schedule";
import getNearestSchedule from "../utils/getNearestSchedule";
import getSchedules from "../api/scheduleApi";

interface ScheduleStore {
  schedules: Schedule[];
  nearestSchedule: Schedule | null;

  loading: boolean;
  error: string | null;
  hasFetched: boolean;

  fetchSchedules: () => Promise<void>;
  setSchedules: (schedules: Schedule[]) => void;
  setNearestSchedule: () => void;
  updateSchedule: (updatedSchedule: Schedule) => void;
}

const useScheduleStore = create<ScheduleStore>((set, get) => ({
  schedules: [],
  nearestSchedule: null,

  loading: false,
  error: null,
  hasFetched: false,

  setSchedules: (schedules) => {
    const filtered = schedules.filter(
      (s) => s.status !== "completed" && s.status !== "cancelled"
    );
    const nearest = getNearestSchedule(filtered);
    // Cập nhật state bằng cách truyền một hàm cập nhật
    set((state) => ({
      schedules: filtered,
      nearestSchedule: nearest,
    }));
  },

  fetchSchedules: async () => {
    set({ loading: true, error: null });

    try {
      const schedules = await getSchedules();
      console.log(schedules, "schedules");
      
      const filtered = schedules.filter(
        (s) => s.status !== "completed" && s.status !== "cancelled"
      );
      const nearest = getNearestSchedule(filtered);

      set({
        schedules: filtered,
        nearestSchedule: nearest,
        loading: false,
        error: null,
        hasFetched: true,
      });
    } catch (err: any) {
      set({
        schedules: [],
        nearestSchedule: null,
        loading: false,
        error: err?.message || "Lỗi khi tải dữ liệu",
        hasFetched: true,
      });
    }
  },

  setNearestSchedule: () => {
    const schedules = get().schedules;
    const nearest = getNearestSchedule(schedules);
    set({ nearestSchedule: nearest });
  },

  updateSchedule: (updatedSchedule: Schedule) => {
    set((state) => {
      const updatedSchedules = state.schedules.map((schedule) =>
        schedule._id === updatedSchedule._id ? updatedSchedule : schedule
      );
      const nearest = getNearestSchedule(updatedSchedules);
      return {
        schedules: updatedSchedules,
        nearestSchedule: nearest,
      };
    });
  },
}));

export default useScheduleStore;
