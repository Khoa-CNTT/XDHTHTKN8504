import { create } from "zustand";

// Định nghĩa kiểu dữ liệu Shift
interface Shift {
  id: string;
  customerName: string;
  status: string; // Sửa thành string để phù hợp với các trạng thái
  customerPhone: string;
  location: { lat: number; lng: number };
  staffLocation: { lat: number; lng: number };
  address: string;
  time: string;
}

// Tạo Zustand store
interface ShiftStore {
  currentShift: Shift | null;
  fetchShift: (id: string) => void;
  updateStatus: (newStatus: string) => void;
}

// Mock API call (hoặc thay thế bằng API thật)
const mockShift: Shift = {
  id: "123",
  customerName: "Nguyễn Văn A",
  status: "Xác nhận nhận việc",
  customerPhone: "0123456789",
  location: { lat: 10.762622, lng: 106.660172 },
  staffLocation: { lat: 10.762522, lng: 106.660272 },
  address: "123 Đường ABC, Quận 1, TP.HCM",
  time: "10:00 - 12:00",
};

// Khởi tạo Zustand store
 const useShiftStore = create<ShiftStore>((set) => ({
  currentShift: null,

  // Giả lập lấy dữ liệu từ API
  fetchShift: (id) => {
    console.log(`Fetching shift ${id}`);
    set({ currentShift: mockShift });
  },

  // Cập nhật trạng thái mới
  updateStatus: (newStatus) => {
    set((state) => {
      if (state.currentShift) {
        return { currentShift: { ...state.currentShift, status: newStatus } };
      }
      return state;
    });
  },
}));
export default useShiftStore;
