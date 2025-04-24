import API from "../utils/api";
import type { RegisterResponse } from "../types/register";

const registerApi = async (
  phone: string,
  password: string
): Promise<RegisterResponse> => {
  const response = await API.post<RegisterResponse>("/auth/signup", {
    phone,
    password,
    role: "family_member",
  });

  return response.data;
};

export default registerApi;
