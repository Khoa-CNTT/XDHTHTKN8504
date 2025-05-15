import API from "../utils/api";

import { Service } from "../types/Service";
import { Package } from "../types/PackageService";
import { log } from "../utils/logger";

interface ServiceResponse<T> {
  success: boolean;
  service: Service[];
}

interface PackageResponse {
  success: boolean;
  packages: Package[];
}
const getServices = async (): Promise<Service[]> => {
  try {
    const response = await API.get<ServiceResponse<Service[]>>(
      "services/get-services",
      {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        params: {
          _t: Date.now(), // để chắc chắn browser không cache
        },
      }
    );
    if (response.data && response.data.success) {
      return response.data.service;
    } else {
      console.log("API không thành công:", response.data);
      return [];
    }
  } catch (error) {
    console.log("Error fetching services:", error);
    return [];
  }
};

export const getAllPackages = async (): Promise<Package[]> => {
  try {
    const response = await API.get<PackageResponse>(
      "packages/get-all-package",
      {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        params: {
          _t: Date.now(),
        },
      }
    );
    if (response.data && response.data.success) {
      return response.data.packages;
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
