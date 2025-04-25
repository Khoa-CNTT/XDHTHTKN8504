import API from "../utils/api";
import useAuthStore from "../stores/authStore";
import { Schedule } from "../types/schedule";

interface ApiResponse<T> {
  message: string;
  data: T;
}

const getSchedules = async (): Promise<Schedule[]> => {
  const token = useAuthStore.getState().token;

  if (!token) {
    console.warn("No token found");
    return [];
  }

  try {
    const response = await API.get<ApiResponse<Schedule[]>>(
      "schedules/getSchedulesForUserToday",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }
};

export default getSchedules;
