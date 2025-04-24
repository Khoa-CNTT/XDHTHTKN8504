import API from "@/utils/api";
import useAuthStore from "../stores/authStore";

interface ApiResponse {
  message: string;
}

const updateAvailability = async (isAvailable: boolean) => {
  try {
    const token = useAuthStore.getState().token;
    if (!token) {
      throw new Error("Token không tồn tại");
    }

    const { data } = await API.patch<ApiResponse>(
      `user/availability`,
      { isAvailable },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Cập nhật thành công:", data.message);
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Đã có lỗi xảy ra khi cập nhật trạng thái schedule"
    );
  }
};

export default updateAvailability;
