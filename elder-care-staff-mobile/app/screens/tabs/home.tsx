import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import HomeHeader from "../../../components/home/HomeHeader";
import AvailabilitySwitch from "../../../components/home/AvailabilitySwitch";
import IncomeCard from "../../../components/home/IncomeCard";
import WorkStatsCard from "../../../components/home/WorkStatsCard";  
import AvailableWorkList from "../../../components/home/AvailableWorkList"; 
import { router } from "expo-router";
import useCompletedBookingStore from "@/stores/completedBookingStore";
import updateAvailability from "../../../api/updateAvailability";

const Home = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const completedBookings = useCompletedBookingStore(
    (state) => state.completedBookings
  );
  const totalSalary = completedBookings.reduce(
    (total, booking) => total + booking.salary,
    0
  );
  const handleToggleAvailability = async (newValue: boolean) => {
    try {
      await updateAvailability(newValue); // Gọi API
      setIsAvailable(newValue);
      console.log("trạng thái mới", newValue);
      // Cập nhật UI sau khi thành công
    } catch (error) {
      console.error("Không thể cập nhật trạng thái:", error);
      // Bạn có thể hiển thị Toast hoặc Alert ở đây nếu muốn
    }
  };
  return (
    <View style={styles.container}>
      <HomeHeader />
      <AvailabilitySwitch
        isAvailable={isAvailable}
        setIsAvailable={handleToggleAvailability}
      />

      {/* Thu nhập */}
      <IncomeCard
        title="Thu nhập hiện tại"
        icon="cash-outline"
        income={totalSalary}
        color="green"
        onPress={() => {
          router.push("/screens/income-screen");
        }}
      />
      <WorkStatsCard />
      <AvailableWorkList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  divider: {
    marginVertical: 10,
  },
});

export default Home;
