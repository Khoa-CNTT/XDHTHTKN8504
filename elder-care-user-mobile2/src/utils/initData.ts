import useScheduleStore from "../stores/scheduleStore";
import useProfileStore from "../stores/profileStore";
import { useServicesStore } from "../stores/serviceStore";
import { useBookingStore } from "../stores/BookingStore";
import { useWalletStore } from "../stores/WalletStore";
import {log} from "../utils/logger"
import { usePackageStore } from "../stores/PackageService";
const initData = async () => {
 

  try {
    await Promise.all([
      useServicesStore.getState().fetchServices(),
      usePackageStore.getState().fetchPackages(),
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
