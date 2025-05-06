import { create } from "zustand";
import getSchedules from "@/api/scheduleApi"; // API fetch lịch trình
import { Schedule } from "../types/Schedule";
import ScheduleStatusApi from "../api/ScheduleStatusApi"; // API lấy lịch trình gần nhất
interface nearestSchedule {
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
  updateSchedule: (updated: Schedule) => void;
  addSchedule: (schedule: Schedule) => void;
  removeSchedule: (scheduleId: string) => void;
  getNearestSchedule: () => Promise<void>;
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

  // Lấy lịch trình gần nhất của nhân viên
  getNearestSchedule: async () => {
    try {
      // Gọi hàm lấy lịch trình gần nhất
      const schedule = await ScheduleStatusApi.getNextScheduleForStaff();
      if (!schedule) {
        throw new Error("Không có lịch trình gần nhất");
      }
      // Cập nhật trạng thái nearestSchedule
      set({ nearestSchedule: schedule });
    } catch (error: any) {
      console.log("Error fetching nearest schedule:", error);
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
}));

export default useScheduleStore;
