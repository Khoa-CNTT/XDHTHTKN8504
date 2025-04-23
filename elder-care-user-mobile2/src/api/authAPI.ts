import API from "../utils/api"; // Đường dẫn đến tệp api.ts
import LoginResponse from "../types/auth"; // Định nghĩa kiểu dữ liệu cho phản hồi đăng nhập

 const loginApi = async (
  phone: string,
  password: string
): Promise<LoginResponse> => {
  const response = await API.post<LoginResponse>("/auth/login", {
    phone,
    password,
  });
  
  return response.data;
};
export default loginApi;