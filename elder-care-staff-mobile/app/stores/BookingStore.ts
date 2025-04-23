// stores/bookingStore.ts
import { create } from "zustand";
import { Booking } from "@/types/Booking";
import getBookingById from "../api/BookingApi";


interface BookingState {
  booking: Booking | null;
  loading: boolean;
  error: string | null;
  fetchBooking: (bookingId: string) => Promise<void>;
}

const useBookingStore = create<BookingState>((set) => ({
  booking: null,
  loading: false,
  error: null,

  fetchBooking: async (bookingId: string) => {
    set({ loading: true, error: null });
    try {
      const bookingData = await getBookingById(bookingId);
      set({ booking: bookingData, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Lỗi không xác định khi lấy booking",
        loading: false,
      });
    }
  },
}));

export default useBookingStore;
