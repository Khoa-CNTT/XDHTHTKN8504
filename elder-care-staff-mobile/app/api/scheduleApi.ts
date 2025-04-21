import API from "@/utils/api";
import useAuthStore from "../stores/authStore";

// Định nghĩa kiểu dữ liệu trả về
interface Schedule {
  _id: string;
  patientName: string;
  date: string;
  timeSlots: { startTime: string; endTime: string }[];
  status: string;
}
const getSchedules = async (): Promise<Schedule[]> => {
  const token = useAuthStore.getState().token;
  try {
    const response = await API.get("schedules/get-schedules", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Response data:", response.data); // Kiểm tra dữ liệu trả về từ API
    // Ép kiểu explicit cho response.data
    return response.data as Schedule[]; // Đảm bảo rằng dữ liệu trả về là kiểu Schedule[]
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
};
export default getSchedules;
