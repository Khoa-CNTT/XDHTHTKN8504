import useCompletedBookingStore from "@/stores/completedBookingStore";
import useScheduleStore from "@/stores/scheduleStore";
import { useSocketStore } from "@/stores/socketStore";
import useBookingStore from "@/stores/BookingStore";
import { log } from "./logger";

const initService = async () => {

 
  try { 
    await Promise.all([
      useBookingStore.getState().fetchBookingsForParticipant(),
      useScheduleStore.getState().fetchSchedules(),
      useScheduleStore.getState().getNearestSchedule(),
      // useUserStore.getState().fetchUserInfo(),
      // useOtherStore.getState().fetchSomething(),
    ]);
    const nearestSchedule = useScheduleStore.getState().nearestSchedule;
    if (nearestSchedule){
      const scheduleId = nearestSchedule.schedule._id;
      useSocketStore.getState().join({scheduleId});
    }
    
  } catch (error) {
    console.error("Lỗi khi init data:", error);
  }
};
export default initService;
