import { create } from "zustand";
import { Schedule } from "../types/schedule";
import getSchedules from "../api/scheduleApi";
import { ScheduleStatus } from "../types/ScheduleStatus";
import { useSocketStore } from "./socketStore";
import { log } from "../utils/logger";

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
    // Giữ nguyên tất cả lịch, không lọc trạng thái
    set(() => ({
      schedules,
    }));
  },

  fetchSchedules: async () => {
    set({ loading: true, error: null });

    try {
      const schedules = await getSchedules();
      log(schedules)

      // Giữ nguyên tất cả lịch, không lọc trạng thái
      set({
        schedules,
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
      const updatedSchedules = state.schedules.map((schedule) =>
        schedule._id === scheduleId
          ? { ...schedule, status: newStatus }
          : schedule
      );

      // Không lọc bỏ lịch hoàn thành hay huỷ
      return { schedules: updatedSchedules };
    });
  },

  getScheduleById: (id: string) => {
    return get().schedules.find((schedule) => schedule._id === id);
  },
}));

export default useScheduleStore;
