import API from "@/utils/api";
import { LoginResponse } from "../types/auth"; // Đảm bảo đường dẫn chính xác

const loginApi = async (
  phone: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await API.post<LoginResponse>("/auth/login", {
      phone,
      password,
    });

    // Đảm bảo trả về đúng cấu trúc
    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export default loginApi;
