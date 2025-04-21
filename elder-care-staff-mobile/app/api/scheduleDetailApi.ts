import { ScheduleResponse } from "@/types/ScheduleDetailResponse";
import API from "@/utils/api";

// Hàm fetch thông tin hồ sơ bệnh nhân từ API
const fetchPatientProfile = async (
  scheduleId: string
): Promise<ScheduleResponse | null> => {
  try {
    // Dùng cú pháp đúng của generic <>{}
    const response = await API.get<{ patientProfile: ScheduleResponse }>(
      `/${scheduleId}/patient-profile`
    );

    // Trả về thông tin hồ sơ bệnh nhân
    return response.data.patientProfile;
  } catch (error: any) {
    // Kiểm tra lỗi từ server (có phản hồi nhưng mã lỗi không phải 2xx)
    if (error.response) {
      console.error("Lỗi từ server:", error.response.data);
    }
    // Kiểm tra lỗi khi không nhận được phản hồi
    else if (error.request) {
      console.error("Không nhận được phản hồi từ server:", error.request);
    }
    // Xử lý lỗi khác
    else {
      console.error("Lỗi khác:", error.message);
    }

    // Trả về null nếu có lỗi xảy ra
    return null;
  }
};
export default fetchPatientProfile;