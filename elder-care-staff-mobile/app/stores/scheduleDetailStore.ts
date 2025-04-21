import { create } from "zustand";
import { ScheduleResponse } from "@/types/ScheduleDetailResponse";
import fetchPatientProfile  from "../api/scheduleDetailApi";

// Định nghĩa kiểu của store
interface PatientStore {
  patientProfile: ScheduleResponse | null; // Hồ sơ bệnh nhân
  setPatientProfile: (profile: ScheduleResponse) => void; // Action để cập nhật thông tin bệnh nhân
  fetchPatientProfile: (scheduleId: string) => Promise<void>; // Action để gọi API
}

// Tạo store bằng Zustand
export const usePatientStore = create<PatientStore>((set) => ({
  patientProfile: null, // Khởi tạo state mặc định là null
  setPatientProfile: (profile) => set({ patientProfile: profile }), // Action để cập nhật hồ sơ bệnh nhân
  fetchPatientProfile: async (scheduleId) => {
    try {
      // Gọi API để lấy dữ liệu bệnh nhân
      const response = await fetchPatientProfile(scheduleId);
      if (response) {
        set({ patientProfile: response }); // Cập nhật state với thông tin bệnh nhân
      }
    } catch (error) {
      console.error("Lỗi khi lấy hồ sơ bệnh nhân:", error);
    }
  },
}));
