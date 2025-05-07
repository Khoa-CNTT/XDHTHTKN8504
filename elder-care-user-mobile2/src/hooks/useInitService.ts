import { useEffect } from "react";
import useAuthStore from "../stores/authStore";
import { useSocketStore } from "../stores/socketStore";
import initData from "../utils/initData";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigator";

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
          // Connect socket
          connect();

          // Kiểm tra và tham gia phòng nếu có user._id
          if (user?._id) {
            join({userId: user._id});
          } else {
            console.error("Không tìm thấy user ID");
          }

          // Khởi tạo dữ liệu sau khi đăng nhập
          await initData();

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
