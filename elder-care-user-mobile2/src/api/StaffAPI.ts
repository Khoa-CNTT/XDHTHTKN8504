import API from "../utils/api";
import { Staff } from "../types/Staff";
import { log } from "../utils/logger";

interface GetStaffResponse {
  message: string;
  staff: Staff[]; // server trả về array dù chỉ 1 phần tử
}

export const getStaffDetail = async (
  staffId: string
): Promise<Staff | null> => {
  try {
    const response = await API.get<GetStaffResponse>(`get-staff-detail/${staffId}`);

    log("[API Staff] " + response.data.message);
    log("[API Staff] Dữ liệu trả về:", response.data.staff);

    if (response.data.staff && response.data.staff.length > 0) {
      return response.data.staff[0]; // lấy phần tử đầu tiên
    }

    return null;
  } catch (error: any) {
    log("[API Staff] Lỗi khi lấy thông tin nhân viên:", error.message || error);
    return null;
  }
};
