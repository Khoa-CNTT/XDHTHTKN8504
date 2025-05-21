import { create } from "zustand";
import getSchedules from "@/api/scheduleApi"; // API fetch lịch trình
import { Schedule } from "../types/Schedule";
import ScheduleStatusApi from "../api/ScheduleStatusApi"; // API lấy lịch trình gần nhất
import { ScheduleStatus } from "@/types/ScheduleStatus";
interface nearestSchedule {
  customerId: string,
  avatar?: string;
  serviceName: string;
  customerAddress: string;
  phoneNumber: string;
  schedule: Schedule;
}


interface ScheduleStore {
  schedules: Schedule[];
  selectedDay: Date;
  nearestSchedule: nearestSchedule | null;
  loading: boolean;
  error: string | null;

  setSchedules: (schedules: Schedule[]) => void;
  setSelectedDay: (day: Date) => void;
  addSchedule: (schedule: Schedule) => void;
  removeSchedule: (scheduleId: string) => void;
  getNearestSchedule: () => Promise<void>;
  fetchSchedules: () => Promise<void>;
  updateSchedule: (
    scheduleId: string,
    newStatus: ScheduleStatus
  ) => void;
}

const useScheduleStore = create<ScheduleStore>((set, get) => ({
  schedules: [],
  selectedDay: new Date(),
  nearestSchedule: null,
  loading: false,
  error: null,

  setSchedules: (schedules) => set({ schedules }),
  setSelectedDay: (date) => set({ selectedDay: date }),



  addSchedule: (schedule) =>
    set((state) => ({
      schedules: [...state.schedules, schedule],
    })),

  removeSchedule: (scheduleId) =>
    set((state) => ({
      schedules: state.schedules.filter((s) => s._id !== scheduleId),
    })),

  // Lấy lịch trình gần nhất của nhân viên
  getNearestSchedule: async () => {
    try {
      // Gọi hàm lấy lịch trình gần nhất
      const schedule = await ScheduleStatusApi.getNextScheduleForStaff();
      // Cập nhật trạng thái nearestSchedule
      set({ nearestSchedule: schedule });
    } catch (error: any) {
      set({ error: error?.message || "Lỗi khi tải lịch trình gần nhất" });
    }
  },

  // Fetch các lịch trình
  fetchSchedules: async () => {
    set({ loading: true, error: null });
    try {
      const schedules = await getSchedules();
      set({ schedules, loading: false });
    } catch (error: any) {
      set({
        error: error?.message || "Lỗi khi tải lịch trình",
        loading: false,
      });
      console.error("Lỗi fetchSchedules:", error);
    }
  },

  updateSchedule: (scheduleId, newStatus) => {
    set((state) => {
      const updatedSchedules = state.schedules.map((s) =>
        s._id === scheduleId ? { ...s, status: newStatus } : s
      );

      let updatedNearest = state.nearestSchedule;
      if (state.nearestSchedule?.schedule._id === scheduleId) {
        updatedNearest = {
          ...state.nearestSchedule,
          schedule: {
            ...state.nearestSchedule.schedule,
            status: newStatus,
          },
        };
      }

      return {
        schedules: updatedSchedules,
        nearestSchedule: updatedNearest,
      };
    });
  },
}));

export default useScheduleStore;
