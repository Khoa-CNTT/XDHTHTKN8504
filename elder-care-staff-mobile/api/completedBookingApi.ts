import API from "@/utils/api";
import useAuthStore from "../stores/authStore";
import { CompletedBooking } from "../types/CompletedBooking";

// Định nghĩa ApiResponse với kiểu dữ liệu rõ ràng
interface ApiResponse {
  message: string;
  bookings: CompletedBooking[]; // Đảm bảo data trả về là mảng các CompletedBooking
}
interface CompletedBookingParams {
  year?: number;
  month?: number;
}
const getCompletedBookings = async (
  params: CompletedBookingParams
): Promise<CompletedBooking[]> => {
  try {
    const token = useAuthStore.getState().token; // Lấy token từ store
    if (!token) {
      throw new Error("Token không tồn tại"); // Kiểm tra token
    }

    // Gọi API với đúng headers và params
    const response = await API.get<ApiResponse>(
      `bookings/get-bookings-completed`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
        params: { ...params },
      }
    );

    // Kiểm tra status trả về từ API
    if (response.status !== 200) {
      throw new Error("Lỗi khi lấy dữ liệu từ API");
    }

    // Kiểm tra dữ liệu trả về có hợp lệ không
    if (!response.data || !Array.isArray(response.data.bookings)) {
      throw new Error("Dữ liệu trả về không hợp lệ");
    }

    return response.data.bookings; // Trả về danh sách booking hoàn thành
  } catch (error) {
    // Xử lý lỗi và trả về thông báo chi tiết

    console.log("Lỗi API lấy danh sách booking đã hoàn thành:", error);

    return []; // Trả về mảng rỗng nếu có lỗi
  }
};
export default getCompletedBookings;
