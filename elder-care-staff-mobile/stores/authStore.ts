import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import loginApi from "../api/authApi";
import type User from "../types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isHydrated: boolean; // Thêm isHydrated để theo dõi trạng thái đã phục hồi hay chưa
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  setSession: (user: User, token: string) => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  isHydrated: false, // Khởi tạo isHydrated là false

  login: async (phone, password) => {
    set({ loading: true, error: null });
    try {
      const data = await loginApi(phone, password);
      const { user, token } = data;

      if (!user || !token) {
        throw new Error("Dữ liệu trả về không hợp lệ");
      }

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      set({ user, token, loading: false, error: null });
    } catch (err: any) {
      set({ error: "Lỗi đăng nhập", loading: false });
    }
  },

  setSession: async (user, token) => {
    try {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      set({ user, token, error: null, loading: false });
    } catch (err: any) {
      set({ error: "Lỗi lưu phiên đăng nhập", loading: false });
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.multiRemove(["token", "user"]);
      set({ user: null, token: null, error: null });
    } catch (err: any) {
      set({ error: "Lỗi khi đăng xuất" });
    }
  },

  restoreSession: async () => {
    set({ loading: true });
    try {
      const token = await AsyncStorage.getItem("token");
      const userStr = await AsyncStorage.getItem("user");

      if (!token || !userStr) {
        throw new Error("Không tìm thấy phiên đăng nhập");
      }

      const user: User = JSON.parse(userStr);
      set({ token, user, loading: false, error: null, isHydrated: true }); // Cập nhật isHydrated
    } catch (err: any) {
      set({
        user: null,
        token: null,
        loading: false,
        error: "Lỗi phục hồi phiên",
        isHydrated: true, // Dù không có user/token, vẫn set isHydrated là true
      });
    }
  },
}));

export default useAuthStore;
