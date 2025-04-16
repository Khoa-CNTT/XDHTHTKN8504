import API from "@/utils/api";
import { LoginResponse } from "../.types/auth";

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