import { create } from "zustand";

// Định nghĩa kiểu dữ liệu cho lịch làm việc
interface Schedule {
  _id: string;
  patientName: string;
  date: string; // Ngày làm việc (dạng string hoặc có thể chuyển thành Date tùy ý)
  timeSlots: { startTime: string; endTime: string }[]; // Thời gian của các ca làm việc
  status: string; // Trạng thái công việc (ví dụ: "completed", "pending", "cancelled")
}

interface ScheduleStore {
  schedules: Schedule[]; // Dữ liệu lịch làm việc
  selectedDay: number; // Ngày được chọn
  setSchedules: (schedules: Schedule[]) => void; // Cập nhật danh sách lịch làm việc
  setSelectedDay: (day: number) => void; // Cập nhật ngày đã chọn
}

const useScheduleStore = create<ScheduleStore>((set) => ({
  schedules: [],
  selectedDay: new Date().getDate(), // Mặc định là ngày hiện tại
  setSchedules: (schedules) => set({ schedules }),
  setSelectedDay: (day) => set({ selectedDay: day }),
}));

export default useScheduleStore;
