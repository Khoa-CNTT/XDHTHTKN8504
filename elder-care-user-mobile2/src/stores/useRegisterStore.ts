import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import registerApi from "../api/registerApi";
import type User from "../types/register";

interface RegisterState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  register: (phone: string, password: string) => Promise<void>;
}

const extractErrorMessage = (err: any, defaultMsg = "Đã xảy ra lỗi") => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.message) return err.message;
  return defaultMsg;
};

const useRegisterStore = create<RegisterState>((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  register: async (phone, password) => {
    set({ loading: true, error: null });
    try {
      const { user, token } = await registerApi(phone, password);

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      set({ user, token, loading: false });
    } catch (err: any) {
      set({
        error: extractErrorMessage(err, "Lỗi khi đăng ký"),
        loading: false,
      });
    }
  },
}));

export default useRegisterStore;
