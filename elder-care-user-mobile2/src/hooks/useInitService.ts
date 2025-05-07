import { useEffect } from "react";
import useAuthStore from "../stores/authStore";
import { useSocketStore } from "../stores/socketStore";
import initData from "../utils/initData";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigator";
import useScheduleStore from "../stores/scheduleStore"; // Import useScheduleStore

type NavigationProp = StackNavigationProp<RootStackParamList>;

const useInitService = () => {
  const { restoreSession } = useAuthStore.getState();
  const { connect, join } = useSocketStore.getState();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const navigation = useNavigation<NavigationProp>(); 
  // Phục hồi session ngay khi app khởi chạy
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Khi có token rồi mới connect + init data
  useEffect(() => {
    const afterLoginInit = async () => {
      if (token) {
        console.log("token from init: ", token);
        
        try {
          await initData();
          connect();
          const schedules = useScheduleStore.getState().schedules;
           if (schedules.length > 0) {
            schedules.forEach((scheduleUser) => {
            const scheduleId = scheduleUser._id;
            useSocketStore.getState().join({ scheduleId });
            console.log("✅ Đã tham gia phòng với scheduleId:", scheduleId);
            })}

          // Điều hướng đến màn hình "Home" và loại bỏ tất cả màn hình trước đó
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }], 
          });
        } catch (error) {
          console.error("Có lỗi khi khởi tạo dịch vụ:", error);
        }
      }
    };

    // Kiểm tra và gọi afterLoginInit khi token hoặc user._id thay đổi
    if (token && user) {
      afterLoginInit();
    }
  }, [token, user, connect, join, navigation]);
};

export default useInitService;
