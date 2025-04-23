import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Divider } from "react-native-paper";
import HomeHeader from "../../components/home/HomeHeader";
import AvailabilitySwitch from "../../components/home/AvailabilitySwitch";
import IncomeCard from "../../components/home/IncomeCard";
import WorkStatsCard from "../../components/home/WorkStatsCard";  
import AvailableWorkList from "../../components/home/AvailableWorkList"; 
import { router } from "expo-router";
import useCompletedBookingStore from "@/app/stores/completedBookingStore";

const Home = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const completedBookings = useCompletedBookingStore(
    (state) => state.completedBookings
  );
  const totalSalary = completedBookings.reduce(
    (total, booking) => total + booking.salary,
    0
  );

  return (
    <View style={styles.container}>
      <HomeHeader />
      <AvailabilitySwitch
        isAvailable={isAvailable}
        setIsAvailable={setIsAvailable}
      />

      {/* Thu nhập */}
      <IncomeCard
        title="Thu nhập hiện tại"
        icon="cash-outline"
        income={totalSalary}
        color="green"
        onPress={ () => {router.push('/screens/income-screen')} }
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
