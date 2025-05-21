import { create } from "zustand";
import { Booking } from "@/types/Booking";
import getBookingById, { getBookingsForParticipant } from "../api/BookingApi";

interface BookingState {
  booking: Booking | null;
  participantBookings: Booking[]; // Thêm mảng
  loading: boolean;
  error: string | null;

  fetchBooking: (bookingId: string) => Promise<void>;
  fetchBookingsForParticipant: () => Promise<void>; // Thêm hàm
  setBooking: (Booking: Booking) => void;
}

const useBookingStore = create<BookingState>((set) => ({
  booking: null,
  participantBookings: [], // Khởi tạo
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

  fetchBookingsForParticipant: async () => {
    set({ loading: true, error: null });
    try {
      const bookings = await getBookingsForParticipant();
      set({ participantBookings: bookings, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Lỗi không xác định khi lấy danh sách booking",
        loading: false,
      });
    }
  },
  setBooking: (booking: Booking) => set({ booking }),
}));

export default useBookingStore;
