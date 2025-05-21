import API from "@/utils/api";
import useAuthStore from "../stores/authStore";
import { Schedule } from "@/types/Schedule";


interface ApiResponse {
  message: string;
  data: any[]; // Mảng dữ liệu lịch làm việc từ API
}

const getSchedules = async (): Promise<Schedule[]> => {
  const token = useAuthStore.getState().token;

  try {
    const response = await API.get<ApiResponse>("schedules/get-schedules", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      },
    });

    const rawData = response.data.data;

    if (!rawData || !Array.isArray(rawData)) {
      throw new Error("Dữ liệu không hợp lệ từ API");
    }

    if (rawData.length === 0) {
      console.warn("API trả về mảng rỗng");
      return [];
    }

    // Không xử lý thời gian, trả về dữ liệu gốc
    return rawData;
  } catch (error) {
    console.log("Lỗi khi lấy lịch làm việc:", error);
    return [];
  }
};


export default getSchedules;
