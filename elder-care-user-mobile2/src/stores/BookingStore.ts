import { create } from "zustand";
import { Booking } from "../types/Booking";
import { BookingStatus } from "../types/BookingStatus";
import { getBookings } from "../api/BookingService";
import { log } from "../utils/logger";

interface BookingState {
    bookings: Booking[];
    filteredBookings: Booking[];
    selectedBooking: Booking | null;
    loading: boolean;
    error: string | null;
    selectedStatus: BookingStatus | null; // Thêm trạng thái lọc hiện tại
    fetchBookings: () => Promise<void>;
    filterByStatus: (status: BookingStatus | null) => void;
    getBookingById: (id: string) => Booking | undefined;
    setSelectedStatus: (status: BookingStatus | null) => void; // Hàm cập nhật trạng thái lọc
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  filteredBookings: [],
  selectedBooking: null,
  loading: false,
  error: null,
  selectedStatus: "accepted", // Khởi tạo trạng thái lọc là 'accepted'

  fetchBookings: async () => {
    set({ loading: true, error: null });

    try {
      const bookings = await getBookings();
      bookings.map((s) =>
        log("avartar: ", s.avartar)
      ) 
      set({ bookings, loading: false });
      get().filterByStatus(get().selectedStatus); 
    } catch (err: any) {
      set({
        error: err?.message || "Lỗi khi tải danh sách lịch đặt.",
        loading: false,
      });
    }
  },

  filterByStatus: (status: BookingStatus) => {
    const allBookings = get().bookings;
    if (status === "accepted") {
      set({
        filteredBookings: allBookings.filter(
          (b) => b.status === "accepted" || b.status === "pending"
        ),
      });
    } else {
      set({
        filteredBookings: allBookings.filter((b) => b.status === status),
      });
    }
  },

  getBookingById: (id: string) => {
    return get().bookings.find((b) => b._id === id);
  },

  setSelectedStatus: (status: BookingStatus | null) => {
    set({ selectedStatus: status });
    get().filterByStatus(status); // Lọc lại khi trạng thái lọc thay đổi
  },
}));

//  bookings: [],
//   filteredBookings: [],
//   selectedBooking: null,
//   loading: false,
//   error: null,

//   fetchBookings: async () => {
//     set({ loading: true, error: null });

//     try {
//       const bookings = await getBookings();
      
//       set({ bookings, filteredBookings: bookings, loading: false });
//     } catch (err: any) {
//       set({
//         error: err?.message || "Lỗi khi tải danh sách lịch đặt.",
//         loading: false,
//       });
//     }
//   },

//   filterByStatus: (status: BookingStatus | null) => {
//     const allBookings = get().bookings;
//     if (!status) {
//       set({ filteredBookings: allBookings });
//     } else {
//       const filtered = allBookings.filter((b) => b.status === status);
//       set({ filteredBookings: filtered });
//     }
//   },

//   getBookingById: (id: string) => {
//     return get().bookings.find((b) => b._id === id);
//   },
// }));
