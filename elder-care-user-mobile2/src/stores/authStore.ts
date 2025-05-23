// stores/authStore.ts

import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import loginApi from "../api/authAPI";
import type User from "../types/auth";

interface AuthState {
  // checkLoginStatus: any;
  // isLoggedIn: any;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  setSession: (user: User, token: string) => Promise<void>;
  updateUser: (user: User) => Promise<void>; // Thêm dòng này
}

// Tách xử lý lỗi vào hàm riêng để sử dụng lại khi cần
const extractErrorMessage = (err: any, defaultMsg = "Đã xảy ra lỗi") => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.message) return err.message;
  return defaultMsg;
};

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  // Phương thức đăng nhập
  login: async (phone, password) => {
    set({ loading: true, error: null });
    try {
      const data = await loginApi(phone, password);
      const { user, token } = data;

      // Kiểm tra dữ liệu trả về
      if (!user || !token) {
        throw new Error("Dữ liệu trả về không hợp lệ");
      }

      // Lưu token và user vào AsyncStorage
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      set({ user, token, loading: false, error: null });
    } catch (err: any) {
      set({
        error: extractErrorMessage(err, "Lỗi đăng nhập"),
        loading: false,
      });
    }
  },

  // Phương thức thiết lập phiên đăng nhập
  setSession: async (user, token) => {
    try {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      set({ user, token, error: null, loading: false });
    } catch (err: any) {
      set({ error: extractErrorMessage(err, "Lỗi lưu phiên đăng nhập"), loading: false });
    }
  },

  // Phương thức đăng xuất
  logout: async () => {
    try {
      await AsyncStorage.multiRemove(["token", "user"]);
      set({ user: null, token: null, error: null });
    } catch (err: any) {
      set({ error: extractErrorMessage(err, "Lỗi khi đăng xuất") });
    }
  },

  // Phương thức phục hồi phiên đăng nhập
  restoreSession: async () => {
    set({ loading: true });
    try {
      const token = await AsyncStorage.getItem("token");
      const userStr = await AsyncStorage.getItem("user");

      // Kiểm tra sự tồn tại của token và user
      if (!token || !userStr) {
        throw new Error("Không tìm thấy phiên đăng nhập");
      }
      console.log("from authStore", token);
      
      const user: User = JSON.parse(userStr);
      set({ token, user, loading: false, error: null });
    } catch (err: any) {
      set({
        user: null,
        token: null,
        loading: false,
        error: extractErrorMessage(err, "Lỗi phục hồi phiên"),
      });
    }
  },

  // Phương thức cập nhật thông tin user
  updateUser: async (user) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(user));
      set({ user, error: null });
    } catch (err: any) {
      set({ error: extractErrorMessage(err, "Lỗi cập nhật thông tin người dùng") });
    }
  },
}));

export default useAuthStore;