import React from "react";
import { View, StyleSheet,Text } from "react-native";
// import WorkTabs from "../../components/WorkTabs";
import useScheduleStore from "../stores/scheduleStore";
import  ScheduleItem  from "../components/ScheduleItem";
import Footer from "../components/Footer";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Map: { id: string };
};
type NavigationProp = StackNavigationProp<RootStackParamList>;
const WorkScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const Schedules = useScheduleStore((state) => state.schedules);
  
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Lịch Chăm Sóc Hôm Nay</Text>
      {Schedules.length > 0 ? (
        Schedules.map((item) => (
          <ScheduleItem
            key={item._id}
            schedule={item}
            onPress={() => {
              navigation.navigate("Map", { id: item._id });  
            }}
          />
        ))
      ) : (
        <Text style={{ textAlign: "center", marginTop: 15 }}>
          Không có lịch hẹn nào hôm nay!
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
    paddingTop: 50,
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
