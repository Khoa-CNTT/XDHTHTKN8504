import API from "../utils/api";
import useAuthStore from "../stores/authStore";
import { Profile } from "../types/profile";
import { log } from "../utils/logger";

interface ApiResponse<T> {
  success: boolean;
  profile: Profile[];
}
const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  return { Authorization: `Bearer ${token}` };
};
export const getProfiles = async (): Promise<Profile[]> => {

  try {
    const response = await API.get<ApiResponse<Profile[]>>(
      "profiles/get-profiles",
      { headers: 
        {
        ...getAuthHeaders(),
        "Cache-Control": "no-cache",
        }
       
      }
    );
    return response.data.profile;
  } catch (error) {
    log("Error fetching schedules:", error);
    return [];
  }
};

export const createProfile = async (
  data: Partial<Profile>
): Promise<Profile> => {
  const res = await API.post<{ success: boolean; profile: Profile }>(
    "profiles/create",
    data,
    { headers: getAuthHeaders() }
  );
  return res.data.profile;
};

export const updateProfile = async (
  id: string,
  data: Partial<Profile>
): Promise<Profile> => {
  const res = await API.put<{ success: boolean; profile: Profile }>(
    `profiles/update/${id}`,
    data,
    { headers: getAuthHeaders() }
  );
  return res.data.profile;
};

export const deleteProfile = async (id: string): Promise<void> => {
  await API.delete(`profiles/delete/${id}`, { headers: getAuthHeaders() });
};
