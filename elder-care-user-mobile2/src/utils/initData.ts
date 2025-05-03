import useScheduleStore from "../stores/scheduleStore";
import useProfileStore from "../stores/profileStore";
import { useServicesStore } from "../stores/serviceStore";
import { useBookingStore } from "../stores/BookingStore";
const initData = async () => {
 

  try {
    await Promise.all([
      useServicesStore.getState().fetchServices(),
      useProfileStore.getState().fetchProfiles(),
      useScheduleStore.getState().fetchSchedules(),
      useBookingStore.getState().fetchBookings(),
      // useUserStore.getState().fetchUserInfo(),
      // useOtherStore.getState().fetchSomething(),
    ]);
    
    
  } catch (error) {

    console.error("Lỗi khi init data:", error);
  }
};
export default initData;
