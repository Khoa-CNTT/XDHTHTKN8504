import API from "../utils/api";

import { Service } from "../types/Service";
import { Package } from "../types/PackageService";

interface ServiceResponse<T> {
  success: boolean;
  service: Service[];
}

interface PackageResponse{
  success: boolean;
  data: Package[];
}
const getServices = async (): Promise<Service[]> => {
  try {
    const response = await API.get<ServiceResponse<Service[]>>(
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

export const getAllPackages = async (): Promise<Package[]> => {
  try {
    const response = await API.get<PackageResponse>("packages/get-all-package");
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      console.error("API không thành công:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching packages:", error);
    return [];
  }
};




export default getServices;
