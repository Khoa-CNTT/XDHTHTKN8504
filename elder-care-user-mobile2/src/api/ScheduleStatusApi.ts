import API from "../utils/api";
import useAuthStore from "../stores/authStore";
import { Schedule } from "../types/schedule";

interface ApiResponse {
  message: string;
  schedule: Schedule;
}

const updateScheduleStatus = async (
  scheduleId: string,
  status: string
): Promise<Schedule> => {
  try {
    const token = useAuthStore.getState().token;
    if (!token) {
      throw new Error("Token không tồn tại");
    }

    const { data } = await API.patch<ApiResponse>(
      `schedules/update-schedule/${scheduleId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      }
    );

    if (!data || !data.schedule) {
      throw new Error("Dữ liệu trả về không hợp lệ");
    }

    return data.schedule;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Đã có lỗi xảy ra khi cập nhật trạng thái schedule"
    );
  }
};

export default updateScheduleStatus;
