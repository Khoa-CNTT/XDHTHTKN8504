import useCompletedBookingStore from "@/stores/completedBookingStore";
import useScheduleStore from "@/stores/scheduleStore";
import { useSocketStore } from "@/stores/socketStore";

const initService = async () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
 
  try { 
    await Promise.all([
      useCompletedBookingStore.getState().fetchCompletedBookings(year, month),
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
