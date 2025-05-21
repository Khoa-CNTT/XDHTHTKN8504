import API from "../utils/api";
import useAuthStore from "../stores/authStore";
import { Review } from "../types/Review";
import { log } from "../utils/logger";

interface GetReviewResponse {
  message: string;
  reviews: Review[];
}

export const getReviewsByStaffId = async (
  staffId: string
): Promise<Review[]> => {
  try {
    const response = await API.get<GetReviewResponse>(`reviews/${staffId}`);

    log("[API Review] " + response.data.message);
    return response.data.reviews;
  } catch (error: any) {
    log("[API Review] Lỗi khi lấy đánh giá:", error.message || error);
    return [];
  }
};

interface CreateReviewPayload {
  rating: number;
  comment?: string;
}

interface CreateReviewResponse {
  message: string;
  newReview: Review;
}

export const createReview = async (
  scheduleId: string,
  payload: CreateReviewPayload
): Promise<Review | null> => {
  try {
    const token = useAuthStore.getState().token;
    if (!token) {
      log("[API Review] Token không tồn tại, vui lòng đăng nhập lại");
      return null;
    }

    const response = await API.post<CreateReviewResponse>(
      `/reviews/${scheduleId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    log("[API Review] " + response.data.message);
    return response.data.newReview;
  } catch (error: any) {
    log(
      "[API Review] Lỗi khi tạo review:",
      error.response?.data?.message || error.message || error
    );
    return null;
  }
};
