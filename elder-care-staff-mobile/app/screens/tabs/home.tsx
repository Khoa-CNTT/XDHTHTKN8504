import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Divider } from "react-native-paper";
import HomeHeader from "../../components/home/HomeHeader";
import AvailabilitySwitch from "../../components/home/AvailabilitySwitch";
import IncomeCard from "../../components/home/IncomeCard";
import WorkStatsCard from "../../components/home/WorkStatsCard";  
import AvailableWorkList from "../../components/home/AvailableWorkList"; 

const Home = () => {
  const [isAvailable, setIsAvailable] = useState(false);
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
        income="0 VND"
        color="green"
        onPress={() => alert("Xem chi tiết thu nhập")}
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
