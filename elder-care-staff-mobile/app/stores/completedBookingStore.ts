import { create } from "zustand";
import { CompletedBooking } from "../../types/CompletedBooking";
import getCompletedBookings from "../api/completedBookingApi"; // Import hàm API

interface BookingStore {
  completedBookings: CompletedBooking[];
  setCompletedBookings: (bookings: CompletedBooking[]) => void;
  fetchCompletedBookings: (year: number, month: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const useCompletedBookingStore = create<BookingStore>((set) => ({
  completedBookings: [], // Khởi tạo mảng danh sách booking rỗng
  setCompletedBookings: (bookings: CompletedBooking[]) =>
    set({ completedBookings: bookings }),
  loading: false,
  error: null,
  fetchCompletedBookings: async (year: number, month: number) => {
    set({ loading: true, error: null }); // Khi bắt đầu fetch thì set loading = true
    try {
      const bookings = await getCompletedBookings(year, month);
      // Kiểm tra dữ liệu nhận được
      if (Array.isArray(bookings)) {
        // Kiểm tra nếu dữ liệu mới và cũ không thay đổi
        set((state) => {
          if (
            JSON.stringify(state.completedBookings) !== JSON.stringify(bookings)
          ) {
            return { completedBookings: bookings, loading: false };
          }
          return { loading: false }; // Nếu dữ liệu không thay đổi thì không cần cập nhật
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
