import { create } from "zustand";
import { CompletedBooking } from "../types/CompletedBooking";
import getCompletedBookings from "../api/completedBookingApi";

interface FetchOptions {
  year?: number;
  month?: number;
}

interface BookingStore {
  completedBookings: CompletedBooking[];
  setCompletedBookings: (bookings: CompletedBooking[]) => void;
  fetchCompletedBookings: (options?: FetchOptions) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const useCompletedBookingStore = create<BookingStore>((set) => ({
  completedBookings: [],
  setCompletedBookings: (bookings) => set({ completedBookings: bookings }),
  loading: false,
  error: null,
  fetchCompletedBookings: async (options = {}) => {
    set({ loading: true, error: null });

    try {
      const bookings = await getCompletedBookings(options); // Gửi object tùy chọn
      if (Array.isArray(bookings)) {
        set((state) => {
          if (
            JSON.stringify(state.completedBookings) !== JSON.stringify(bookings)
          ) {
            return { completedBookings: bookings, loading: false };
          }
          return { loading: false };
        });
      } else {
        set({ error: "Dữ liệu không hợp lệ", loading: false });
      }
    } catch (error) {
      set({ error: `Lỗi khi tải dữ liệu: ${error}`, loading: false });
      console.error("Error fetching completed bookings:", error);
    }
  },
}));
export default useCompletedBookingStore;