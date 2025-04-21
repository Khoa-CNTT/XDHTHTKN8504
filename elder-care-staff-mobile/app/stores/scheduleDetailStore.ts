import { PatientProfile } from "@/types/PatientProfile"; // đúng kiểu dữ liệu
import fetchPatientProfile from "../api/scheduleDetailApi";
import { create } from "zustand";

// Định nghĩa kiểu của store
interface PatientStore {
  patientProfile: PatientProfile | null; // Sửa ở đây: dùng PatientProfile
  setPatientProfile: (profile: PatientProfile) => void;
  fetchPatientProfile: (scheduleId: string) => Promise<void>;
}

// Tạo store bằng Zustand
export const usePatientStore = create<PatientStore>((set) => ({
  patientProfile: null,
  setPatientProfile: (profile) => set({ patientProfile: profile }),
  fetchPatientProfile: async (scheduleId) => {
    try {
      const response = await fetchPatientProfile(scheduleId);
      if (response) {
        set({ patientProfile: response });
      }
    } catch (error) {
      console.error("Lỗi khi lấy hồ sơ bệnh nhân:", error);
    }
  },
}));
