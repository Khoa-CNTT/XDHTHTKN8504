import React from "react";
import { View, StyleSheet,Text } from "react-native";
// import WorkTabs from "../../components/WorkTabs";
import useScheduleStore from "../stores/scheduleStore";
import  ScheduleItem  from "../components/ScheduleItem";
import Footer from "../components/Footer";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  MapScreen: { id: string };
};
type NavigationProp = StackNavigationProp<RootStackParamList>;
const WorkScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const Schedules = useScheduleStore((state) => state.schedules);
  console.log("from screen: ", Schedules);
  
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Lịch Chăm Sóc Hôm Nay</Text>
      {Schedules.length > 0 ? (
        Schedules.map((item) => (
          <ScheduleItem
            key={item.schedule._id}
            schedule={item}
            onPress={() => {
              navigation.navigate("MapScreen", { id: item.schedule._id });  
            }}
          />
        ))
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Không có công việc nào
        </Text>
      )}
      {/* <WorkTabs /> */}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5",
    paddingTop: 40,
    paddingHorizontal: 10,
    },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#28A745",
    textAlign: "center",
    marginBottom: 15,
  },
});

export default WorkScreen;
