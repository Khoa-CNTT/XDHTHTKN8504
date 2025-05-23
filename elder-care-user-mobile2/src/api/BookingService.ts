import API from "../utils/api";
import useAuthStore from "../stores/authStore";
import { CreateBookingRequest } from "../types/CreateBookingRequest";
import { Booking } from "../types/Booking";
import { log } from "../utils/logger";

interface ApiResponse<T> {
  message: string;
  data: Booking[];
}

export interface TimeSlot {
  start: string; // "08:00"
}

export interface CreateBookingByPackagePayload {
  packageId: string;
  profileId: string;
  repeatFrom: string; // ví dụ: "2025-05-16"
  timeSlot: TimeSlot;
  notes?: string;
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




export const createBookingByPackage = async (data: CreateBookingByPackagePayload) => {
  const token = useAuthStore.getState().token;
  try {
    const response = await API.post("/bookings/create-booking-package", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }); 
    return response.data;
  } catch (error: any) {
    log("Lỗi gọi API createBookingByPackage:", error);
    throw error.response?.data || { message: "Lỗi không xác định." };
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
    log(response.data.message)
    return response.data.data;
  } catch (error) {
    log("Error fetching schedules:", error);
    return [];
  }
};

export const cancelBooking = async (bookingId: string) => {
  try {
    const response = await API.post(
      `/bookings/cancel-booking-for-user/${bookingId}`,
      {},
    );
    return response.data;
  } catch (error: any) {
    log(
      "Lỗi khi hủy booking:",
      error.response?.data || error.message
    );
    throw error;
  }
};




