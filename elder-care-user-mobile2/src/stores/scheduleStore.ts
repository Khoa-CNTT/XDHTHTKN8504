import { create } from "zustand";
import { Schedule } from "../types/schedule";
import getSchedules from "../api/scheduleApi";
import { ScheduleStatus } from "../types/ScheduleStatus";
import { useSocketStore } from "./socketStore";

export type ScheduleUser = Schedule & {
  staffFullName: string;
  staffPhone: string;
  staffAvatar?: string;
};

interface ScheduleStore {
  schedules: ScheduleUser[];
  // schedule: ScheduleUser;
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchSchedules: () => Promise<void>;
  setSchedules: (schedules: ScheduleUser[]) => void;
  updateSchedule: (data: {
    scheduleId: string;
    newStatus: ScheduleStatus;
  }) => void;
  getScheduleById: (id: string) => ScheduleUser | undefined;
}

const useScheduleStore = create<ScheduleStore>((set, get) => ({
  schedules: [],
  loading: false,
  error: null,
  hasFetched: false,

  setSchedules: (schedules) => {
    const filtered = schedules.filter(
      (s) => s.status !== "completed" && s.status !== "cancelled"
    );
    set(() => ({
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
        (s) => s.status !== "completed" && s.status !== "cancelled"
      );

      set({
        schedules: filtered,
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

  updateSchedule: ({ scheduleId, newStatus }) => {
    set((state) => {
      const updatedSchedules = state.schedules
        .map((schedule) =>
          schedule._id === scheduleId
            ? { ...schedule, status: newStatus }
            : schedule
        )
        .filter((s) => s.status !== "completed" && s.status !== "cancelled");

      return { schedules: updatedSchedules };
    });
  },

  getScheduleById: (id: string) => {
    return get().schedules.find((schedule) => schedule._id === id);
  },
}));

export default useScheduleStore;
