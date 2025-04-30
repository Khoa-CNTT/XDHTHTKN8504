// import API from "../utils/api";
// import type { Profile, ProfilesResponse } from "../types/careRecipient";

// const CareProfilesApi = {
//   getProfilesByUser: async (userId: string): Promise<ProfilesResponse> => {
//     const response = await API.get(`/profiles/user/${userId}`);
//     return response.data;
//   },

//   createProfile: async (
//     userId: string,
//     firstName: string,
//     lastName: string,
//     relationship: string,
//     address: string,
//     emergencyContact: { name: string; phone: string },
//     healthConditions: { condition: string; notes: string }[]
//   ): Promise<Profile> => {
//     const response = await API.post("/profiles/create", {
//       userId,
//       firstName,
//       lastName,
//       relationship,
//       address,
//       emergencyContact,
//       healthConditions,
//     });
//     return response.data.profile;
//   },
// };

// export default CareProfilesApi;
