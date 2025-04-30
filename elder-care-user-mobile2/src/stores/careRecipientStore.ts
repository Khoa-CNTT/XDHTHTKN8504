// import { create } from "zustand";
// import CareProfilesApi from "../api/careRecipientAPI";
// import type { Profile } from "../types/careRecipient";

// interface CareRecipientState {
//   profiles: Profile[];
//   loading: boolean;
//   error: string | null;
//   fetchProfiles: (userId: string) => Promise<void>;
// }

// const useCareRecipientStore = create<CareRecipientState>((set) => ({
//   profiles: [],
//   loading: false,
//   error: null,

//   fetchProfiles: async (userId: string) => {
//     set({ loading: true, error: null });
//     try {
//       const response = await CareProfilesApi.getProfilesByUser(userId);
//       console.log("Fetched profiles:", response.profiles);
      
//       set({ profiles: response.profiles, loading: false });
//     } catch (error: any) {
//       set({
//         error: error?.response?.data?.message || "Không thể tải danh sách hồ sơ",
//         loading: false,
//       });
//     }
//   },
// }));

// export default useCareRecipientStore;
