import { create } from "zustand";
import { Profile } from "../types/profile";
import {
  getProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
} from "../api/ProfileServiceApi";

interface ProfileStore {
  profiles: Profile[];
  currentProfile: Profile | null;

  isLoading: boolean;
  error: string | null;

  fetchProfiles: () => Promise<void>;
  getProfileById: (id: string) => Profile | undefined;
  addProfile: (data: Partial<Profile>) => Promise<void>;
  editProfile: (id: string, data: Partial<Profile>) => Promise<void>;
  removeProfile: (id: string) => Promise<void>;
}

const useProfileStore = create<ProfileStore>((set, get) => ({
  profiles: [],
  currentProfile: null,

  isLoading: false,
  error: null,

  fetchProfiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const profiles = await getProfiles();
      set({ profiles });
    } catch (error) {
      console.error("Error fetching profiles", error);
      set({ error: "Không thể tải dữ liệu" });
    } finally {
      set({ isLoading: false });
    }
  },

  addProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newProfile = await createProfile(data);
      set({ profiles: [...get().profiles, newProfile] }); // Using get() to get the current state
    } catch (error) {
      console.error("Error creating profile", error);
      set({ error: "Không thể tạo mới profile" });
    } finally {
      set({ isLoading: false });
    }
  },

  editProfile: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await updateProfile(id, data);
      set({
        profiles: get().profiles.map((p) => (p._id === id ? updated : p)), // Using get() to get the current state
      });
    } catch (error) {
      console.error("Error updating profile", error);
      set({ error: "Không thể cập nhật profile" });
    } finally {
      set({ isLoading: false });
    }
  },

  removeProfile: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteProfile(id);
      set({
        profiles: get().profiles.filter((p) => p._id !== id), // Using get() to get the current state
      });
    } catch (error) {
      console.error("Error deleting profile", error);
      set({ error: "Không thể xóa profile" });
    } finally {
      set({ isLoading: false });
    }
  },
  getProfileById: (id: string) => {
    return get().profiles.find((p) => p._id === id);
  },
}));

export default useProfileStore;
