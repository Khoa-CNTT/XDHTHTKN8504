import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Divider } from "react-native-paper";
import HomeHeader from "../../components/home/HomeHeader";
import AvailabilitySwitch from "../../components/home/AvailabilitySwitch";
import IncomeCard from "../../components/home/IncomeCard";
import WorkStatsCard from "../../components/home/WorkStatsCard";  
import AvailableWorkList from "../../components/home/AvailableWorkList"; // Import the AvailableWorkList component


const Home = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const income = "5,000,000 VNĐ";
  const workHistory = 10;

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
        income="10,000,000 VND"
        color="green"
        onPress={() => alert("Xem chi tiết thu nhập")}
      />
      <WorkStatsCard workHistory={workHistory} />
      {/* Công việc đang làm */}
      <AvailableWorkList />

      <Divider style={styles.divider} />

      {/* Số ca đã làm */}
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
