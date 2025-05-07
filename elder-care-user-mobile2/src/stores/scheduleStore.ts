import { create } from "zustand";
import { Schedule } from "../types/schedule";
import getNearestSchedule from "../utils/getNearestSchedule";
import getSchedules from "../api/scheduleApi";

export type ScheduleUser = Schedule & {
  staffFullName: string;
  staffPhone: string;
  staffAvatar?: string;
};

interface ScheduleStore {
  schedules: ScheduleUser[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchSchedules: () => Promise<void>;
  setSchedules: (schedules: ScheduleUser[]) => void;
  updateSchedule: (updatedSchedule: Schedule) => void;
  getScheduleById: (id: string) => ScheduleUser | undefined;
}

const useScheduleStore = create<ScheduleStore>((set, get) => ({
  schedules: [],
  loading: false,
  error: null,
  hasFetched: false,

  setSchedules: (schedules) => {
    const filtered = schedules.filter(
      (s) =>
        s.status !== "completed" && s.status !== "cancelled"
    );
    set((state) => ({
      schedules: filtered,
    }));
  },

  fetchSchedules: async () => {
    set({ loading: true, error: null });

    try {
      const schedules = await getSchedules();
      if (!Array.isArray(schedules)) {
        throw new Error("Dữ liệu không hợp lệ");
      }

      const filtered = schedules.filter(
        (s) =>
          s.status !== "completed" && s.status !== "cancelled"
      );
      set({
        schedules: filtered, // ✅ Đúng rồi
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
        schedule._id === updatedSchedule._id
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
    return schedules.find((schedule) => schedule._id === id);
  },
}));

export default useScheduleStore;
