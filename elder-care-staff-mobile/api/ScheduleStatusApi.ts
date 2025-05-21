
import  API  from "../utils/api"; // Import axios instance đã được cấu hình
import useAuthStore from "../stores/authStore"; // Import store để lấy token
import { Schedule } from "../types/Schedule"; // Import kiểu dữ liệu Schedule
import { log } from "@/utils/logger";

interface ApiResponse {
  message: string;
  schedule: Schedule;
}
interface nearestSchedule {
  customerId: string,
  serviceName: string;
  customerAddress: string;
  phoneNumber: string;
  schedule: Schedule;
}

// Lấy lịch trình tiếp theo cho nhân viên
const getNextScheduleForStaff = async (): Promise<nearestSchedule | null> => {
  const token = useAuthStore.getState().token;

  if (!token) {
    throw new Error("Token không tồn tại");
  }

  try {
    const response = await API.get("/schedules/next/staff", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      },
    });

    // Trả về dữ liệu đúng định dạng (Schedule)
    return response.data as nearestSchedule;
  } catch (error: any) {
    // Xử lý lỗi tốt hơn, log ra chi tiết để debug
    log("Error fetching schedule:", error);
    return null; // Hoặc ném lỗi nếu cần thiết

    // Nếu lỗi từ API, kiểm tra thông báo lỗi
    const message =
      error.response?.data?.message || error.message || "Lỗi không xác định";

    // Ném lỗi để xử lý ở nơi gọi API
    throw new Error(message);
  }
};

// Cập nhật trạng thái lịch trình
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

    // Kiểm tra dữ liệu trả về từ API
    if (!data || !data.schedule) {
      throw new Error("Dữ liệu trả về không hợp lệ");
    }

    return data.schedule; // Trả về đối tượng Schedule đã được cập nhật
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Đã có lỗi xảy ra khi cập nhật trạng thái schedule"
    );
  }
};

export default { updateScheduleStatus, getNextScheduleForStaff };
