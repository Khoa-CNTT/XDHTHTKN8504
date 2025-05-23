import useScheduleStore from "../stores/scheduleStore";
import useProfileStore from "../stores/profileStore";

import { useBookingStore } from "../stores/BookingStore";
import { useWalletStore } from "../stores/WalletStore";
import {log} from "../utils/logger"

const initData = async () => {
 

  try {
    await Promise.all([
      
      useProfileStore.getState().fetchProfiles(),
      useScheduleStore.getState().fetchSchedules(),
      useBookingStore.getState().fetchBookings(),
      useWalletStore.getState().fetchWallet(),
      // useUserStore.getState().fetchUserInfo(),
      // useOtherStore.getState().fetchSomething(),
    ]);
    
    
  } catch (error) {

    log("Thông báo lúc khởi tạo, Lỗi khi init data:", error);
  }
};
export default initData;
