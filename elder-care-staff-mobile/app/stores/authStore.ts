// stores/authStore.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import loginApi  from "../api/authApi";
import type { User } from "../.types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  restoreSession: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  login: async (phone, password) => {
    set({ loading: true, error: null });
    try {
      const data = await loginApi(phone, password);

      await AsyncStorage.setItem("token", data.token); // 🔐 lưu token

      set({
        user: data.user,
        token: data.token,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err.message || "Lỗi đăng nhập";
      set({ error: message, loading: false });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("token"); // 🔓 xóa token khi logout
    set({ user: null, token: null });
  },

  restoreSession: async () => {
    set({ loading: true });
    try {
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");

      if (token && user) {
        set({
          token,
          user: JSON.parse(user),
          loading: false,
          error: null,
        });
      } else {
        set({
          token: null,
          user: null,
          loading: false,
          error: null,
        });
      }
    } catch (err) {
      set({ loading: false, error: "Lỗi phục hồi phiên đăng nhập" });
    }
  },
}));
export default useAuthStore;
