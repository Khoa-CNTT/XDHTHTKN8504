import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import loginApi from "../api/authApi";
import type { User } from "../types/User";
import { Doctor } from "@/types/Doctor";
import type { Nurse } from "@/types/Nurse";
import type { ExtraInfo } from "@/types/User"; // Đảm bảo đường dẫn chính xác

interface AuthState {
  user: User | null;
  token: string | null;
  extraInfo: ExtraInfo; // Thêm trạng thái cho extraInfo
  loading: boolean;
  error: string | null;
  isHydrated: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  setSession: (
    user: User,
    token: string,
    extraInfo: ExtraInfo
  ) => Promise<void>;
  setExtraInfo: (extraInfo: ExtraInfo) => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  extraInfo: null, // Khởi tạo extraInfo
  loading: false,
  error: null,
  isHydrated: false,

  login: async (phone, password) => {
    set({ loading: true, error: null });
    try {
      const data = await loginApi(phone, password);
      const { user, token, extraInfo } = data;

      if (!user || !token || !extraInfo) {
        throw new Error("Dữ liệu trả về không hợp lệ");
      }
      console.log("token from useAuthStore", token);
      

      // Lưu trữ vào AsyncStorage
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("extraInfo", JSON.stringify(extraInfo)); // Lưu extraInfo

      set({ user, token, extraInfo, loading: false, error: null });
    } catch (err: any) {
      set({ error: "Lỗi đăng nhập", loading: false });
    }
  },

  setSession: async (user, token, extraInfo) => {
    try {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("extraInfo", JSON.stringify(extraInfo)); // Lưu extraInfo

      set({ user, token, extraInfo, error: null, loading: false });
    } catch (err: any) {
      set({ error: "Lỗi lưu phiên đăng nhập", loading: false });
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.multiRemove(["token", "user", "extraInfo"]); // Xóa thông tin
      set({ user: null, token: null, extraInfo: null, error: null });
    } catch (err: any) {
      set({ error: "Lỗi khi đăng xuất" });
    }
  },

  restoreSession: async () => {
    set({ loading: true });
    try {
      const token = await AsyncStorage.getItem("token");
      const userStr = await AsyncStorage.getItem("user");
      const extraInfoStr = await AsyncStorage.getItem("extraInfo"); // Lấy extraInfo

      if (!token || !userStr || !extraInfoStr) {
        throw new Error("Không tìm thấy phiên đăng nhập");
      }

      const user: User = JSON.parse(userStr);
      const extraInfo: ExtraInfo = JSON.parse(extraInfoStr); // Phục hồi extraInfo

      set({
        token,
        user,
        extraInfo,
        loading: false,
        error: null,
        isHydrated: true,
      });
    } catch (err: any) {
      set({
        user: null,
        token: null,
        extraInfo: null, // Reset extraInfo khi lỗi
        loading: false,
        error: "Lỗi phục hồi phiên",
        isHydrated: true,
      });
    }
  },
  setExtraInfo: async (extraInfo) => {
    try {
      await AsyncStorage.setItem("extraInfo", JSON.stringify(extraInfo));
      set({ extraInfo });
    } catch (error) {
      console.error("Lỗi khi cập nhật extraInfo:", error);
    }
  },
}));

export default useAuthStore;
