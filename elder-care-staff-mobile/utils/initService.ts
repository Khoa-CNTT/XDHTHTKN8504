import useAuthStore from "@/stores/authStore";
import useCompletedBookingStore from "@/stores/completedBookingStore";
import useScheduleStore from "@/stores/scheduleStore";
const initService = async () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  try {
    await Promise.all([
      // useCompletedBookingStore.getState().fetchCompletedBookings(year, month),
      useScheduleStore.getState().fetchSchedules(),
      // useUserStore.getState().fetchUserInfo(),
      // useOtherStore.getState().fetchSomething(),
    ]);
    
  } catch (error) {
    console.error("Lỗi khi init data:", error);
  }
};
export default initService;
