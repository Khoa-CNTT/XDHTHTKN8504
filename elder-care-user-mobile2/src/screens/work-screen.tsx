import React from "react";
import { View, StyleSheet,Text, Image, TouchableOpacity} from "react-native";
// import WorkTabs from "../../components/WorkTabs";
import useScheduleStore from "../stores/scheduleStore";
import  ScheduleItem  from "../components/ScheduleItem";
import Footer from "../components/Footer";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/navigation";


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
              <View style={styles.emptyContainer}>
                <Image
                  source={require("../asset/img/empty_schedule.png")}
                  style={styles.emptyImage}
                  resizeMode="contain"
                />
                <Text style={styles.emptyTitle}>
                  Không có lịch chăm sóc hôm nay
                </Text>
                <Text style={styles.emptyText}>
                  Vui lòng kiểm tra lại sau hoặc đặt một lịch mới!
                </Text>
                <TouchableOpacity style={styles.backButton} onPress={() => {navigation.navigate("BookAService")}}>
                  <Text style={styles.backButtonText}>Đặt lịch mới</Text>
                </TouchableOpacity>
              </View>
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 15,
  },
  emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#fff",
    },
    emptyImage: {
      width: 200,
      height: 200,
      marginBottom: 24,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
      textAlign: "center",
    },
    emptyText: {
      fontSize: 14,
      color: "gray",
      textAlign: "center",
      marginBottom: 20,
    },
    backButton: {
      backgroundColor: "#28a745",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 20,
    },
    backButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
  },
);

export default WorkScreen;
