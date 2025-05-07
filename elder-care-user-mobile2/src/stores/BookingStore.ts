import { create } from "zustand";
import { Booking } from "../types/Booking"; 
import { BookingStatus } from "../types/BookingStatus";
import  {getBookings}  from "../api/BookingService";

interface BookingState {
  bookings: Booking[];
  filteredBookings: Booking[];
  selectedBooking: Booking | null;
  loading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
  filterByStatus: (status: BookingStatus | null) => void;
  getBookingById: (id: string) => Booking | undefined;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  filteredBookings: [],
  selectedBooking: null,
  loading: false,
  error: null,

  fetchBookings: async () => {
    set({ loading: true, error: null });

    try {
      const bookings = await getBookings();
      
      set({ bookings, filteredBookings: bookings, loading: false });
    } catch (err: any) {
      set({
        error: err?.message || "Lỗi khi tải danh sách lịch đặt.",
        loading: false,
      });
    }
  },

  filterByStatus: (status: BookingStatus | null) => {
    const allBookings = get().bookings;
    if (!status) {
      set({ filteredBookings: allBookings });
    } else {
      const filtered = allBookings.filter((b) => b.status === status);
      set({ filteredBookings: filtered });
    }
  },

  getBookingById: (id: string) => {
    return get().bookings.find((b) => b._id === id);
  },
}));
