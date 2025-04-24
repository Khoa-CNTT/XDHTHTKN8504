import { getNearestSchedule as getNearestScheduleUtil } from "@/utils/getNearestSchedule";
import { create } from "zustand";
import { Schedule } from "../types/Schedule";

interface ScheduleStore {
  schedules: Schedule[];
  selectedDay: Date;
  nearestSchedule: Schedule | null; // Lưu lịch gần nhất vào store
  setSchedules: (schedules: Schedule[]) => void;
  setSelectedDay: (day: Date) => void;
  updateSchedule: (updated: Schedule) => void;
  addSchedule: (schedule: Schedule) => void; // Thêm một lịch trình mới
  removeSchedule: (scheduleId: string) => void; // Xóa lịch trình
  getNearestSchedule: () => void; // Cập nhật lịch gần nhất trong store
}

const useScheduleStore = create<ScheduleStore>((set, get) => ({
  schedules: [], // Mảng lưu danh sách lịch trình
  selectedDay: new Date(),
  nearestSchedule: null, // Lịch gần nhất mặc định là null
  setSchedules: (schedules) => set({ schedules }),
  setSelectedDay: (date) => set({ selectedDay: date }),

  // Cập nhật một lịch trình
  updateSchedule: (updated) =>
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s._id === updated._id ? updated : s
      ),
    })),

  // Thêm một lịch trình mới
  addSchedule: (schedule) =>
    set((state) => ({
      schedules: [...state.schedules, schedule],
    })),

  // Xóa một lịch trình theo ID
  removeSchedule: (scheduleId) =>
    set((state) => ({
      schedules: state.schedules.filter((s) => s._id !== scheduleId),
    })),

  // Cập nhật lịch gần nhất từ danh sách lịch trình
  getNearestSchedule: () => {
    const schedules = get().schedules; // Lấy danh sách lịch từ store
    const nearestSchedule = getNearestScheduleUtil(schedules); // Gọi hàm getNearestSchedule để tìm lịch gần nhất

    set({ nearestSchedule }); // Lưu lịch gần nhất vào store
  },
}));

export default useScheduleStore;
