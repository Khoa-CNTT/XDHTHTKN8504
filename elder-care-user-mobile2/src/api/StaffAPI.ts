import API from "../utils/api";
import { StaffResponse, Staff } from "../types/Staff";
import { log } from "../utils/logger";

export const getStaffDetail = async (id: string): Promise<Staff> => {
  try {
    const response = await API.get<StaffResponse>(
      `auth/get-staff-detail/${id}`
    );
    return response.data.staff;
  } catch (error: any) {
    log(error);
    // Nên ném lỗi tiếp để caller biết có lỗi
    throw error;
  }
};
