import API from "../utils/api";
import useAuthStore from "../stores/authStore";
import { Schedule } from "../types/schedule";
import { log } from "../utils/logger";

export type ScheduleUser = Schedule & {
  staffFullName: string;
  staffPhone: string;
  staffAvatar?: string;
};

const getSchedules = async (): Promise<ScheduleUser[]> => {
  const token = useAuthStore.getState().token;

  if (!token) {
    console.warn("No token found");
    return [];
  }

  try {
    const response = await API.get<ScheduleUser[]>(
      "schedules/getTodaySchedulesByUser",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      }
    );

    // Trả về mảng ScheduleUser[] từ response.data
    return response.data || []; 
  } catch (error) {
    log("Lỗi kéo API", error);
    return [];
  }
};

export default getSchedules;
