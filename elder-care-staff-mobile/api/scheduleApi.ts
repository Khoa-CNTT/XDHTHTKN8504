import API from "@/utils/api";
import useAuthStore from "../stores/authStore";
import { Schedule } from "@/types/Schedule";

// Hàm chuyển đổi từ ISO string sang thời gian Việt Nam (UTC +7)
const toVietnamDate = (isoString: string): Date => {
  const date = new Date(isoString);
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + 7 * 60 * 60000); // Thêm 7 giờ để chuyển sang múi giờ Việt Nam
};


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
    console.error("Error fetching schedules:", error);
    return [];
  }
};


export default getSchedules;
