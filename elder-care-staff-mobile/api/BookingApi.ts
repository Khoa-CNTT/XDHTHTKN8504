import API from "@/utils/api";
import useAuthStore from "../stores/authStore";
import { Booking } from "../types/Booking";

interface ApiResponse {
  message: string;
  booking: Booking;
}

const getBookingById = async (bookingId: string): Promise<Booking> => {
  try {
    const token = useAuthStore.getState().token;
    if (!token) {
      throw new Error("Token không tồn tại");
    }

    const { data } = await API.get<ApiResponse>(
      `bookings/get-booking/${bookingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      }
    );

    if (!data || !data.booking) {
      throw new Error("Dữ liệu trả về không hợp lệ");
    }

    return data.booking;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Đã có lỗi xảy ra khi lấy booking"
    );
  }
};

export default getBookingById;
