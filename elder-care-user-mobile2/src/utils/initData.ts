import useScheduleStore from "../stores/scheduleStore";
const initData = async () => {
 

  try {
    await Promise.all([
      useScheduleStore.getState().fetchSchedules(),
      // useUserStore.getState().fetchUserInfo(),
      // useOtherStore.getState().fetchSomething(),
    ]);
  } catch (error) {
    console.error("Lỗi khi init data:", error);
  }
};
export default initData;
