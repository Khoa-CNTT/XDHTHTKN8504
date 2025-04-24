import { PatientProfile } from "../types/PatientProfile";
import API from "@/utils/api";

// Hàm fetch thông tin hồ sơ bệnh nhân từ API
const fetchPatientProfile = async (
  scheduleId: string
): Promise<PatientProfile | null> => {
  // Trả về PatientProfile thay vì ScheduleResponse
  try {
    // Gọi API để lấy thông tin hồ sơ bệnh nhân
    const response = await API.get<{
      message: string;
      patientProfile: PatientProfile;
    }>(`/schedules/${scheduleId}/patient-profile`);

    // Trả về chỉ profile của bệnh nhân
    return response.data.patientProfile;
  } catch (error: any) {
  if (error.response) {
    // Lỗi từ server
    console.error("Lỗi từ server:", error.response.data);
  } else if (error.request) {
    // Không có phản hồi từ server
    console.error("Không nhận được phản hồi từ server:", error.request);
  } else {
    // Lỗi khác
    console.error("Lỗi khác:", error.message);
  }

    // Trả về null nếu có lỗi xảy ra
    return null;
  }
};

export default fetchPatientProfile;
