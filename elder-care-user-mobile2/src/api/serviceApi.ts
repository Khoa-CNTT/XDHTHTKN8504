import API from "../utils/api";

import { Service } from "../types/Service";

interface ApiResponse<T> {
  success: boolean;
  service: Service[];
}

const getServices = async (): Promise<Service[]> => {
  try {
    const response = await API.get<ApiResponse<Service[]>>(
      "services/get-services"
    );
    if (response.data && response.data.success) {
      return response.data.service;
    } else {
      console.error("API không thành công:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};


export default getServices;
