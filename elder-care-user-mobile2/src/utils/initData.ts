import useScheduleStore from "../stores/scheduleStore";
import useProfileStore from "../stores/profileStore";
import { useServicesStore } from "../stores/serviceStore";
const initData = async () => {
 

  try {
    await Promise.all([
      useServicesStore.getState().fetchServices(),
      useProfileStore.getState().fetchProfiles(),
      useScheduleStore.getState().fetchSchedules(),
      // useUserStore.getState().fetchUserInfo(),
      // useOtherStore.getState().fetchSomething(),
    ]);
    
  } catch (error) {

    console.error("Lỗi khi init data:", error);
  }
};
export default initData;
