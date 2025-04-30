import API from "../utils/api";
import useAuthStore from "../stores/authStore";
import { CreateBookingRequest } from "../types/CreateBookingRequest";
import { Booking } from "../types/Booking";

interface ApiResponse<T> {
  message: string;
  booking: Booking;
}

const createBooking = async (body: CreateBookingRequest) => {
  const token = useAuthStore.getState().token;

  try {
    const response = await API.post<ApiResponse<Booking>>(
      "bookings/create",
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error create booking:",
      error?.response?.data || error.message
    );
    throw error;
  }
};

export default createBooking;
