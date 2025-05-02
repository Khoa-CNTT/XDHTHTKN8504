import API from "../utils/api";
import useAuthStore from "../stores/authStore";
import { CreateBookingRequest } from "../types/CreateBookingRequest";
import { Booking } from "../types/Booking";

interface ApiResponse<T> {
  message: string;
  data: Booking[];
}

export const createBooking = async (body: CreateBookingRequest) => {
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

export const getBookings = async (): Promise<Booking[]> => {
  const token = useAuthStore.getState().token;

  if (!token) {
    console.warn("No token found");
    return [];
  }

  try {
    const response = await API.get<ApiResponse<Booking[]>>(
      "bookings/get-bookings-for-customer",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }
};



