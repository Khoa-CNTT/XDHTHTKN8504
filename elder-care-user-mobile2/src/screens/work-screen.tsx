import React from "react";

import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";

import useScheduleStore from "../stores/scheduleStore";
import ScheduleItem from "../components/ScheduleItem";
import Footer from "../components/Footer";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/navigation";
import { Ionicons } from "@expo/vector-icons";

import useAuthStore from "../stores/authStore"; // Import useAuthStore


type NavigationProp = StackNavigationProp<RootStackParamList>;

const WorkScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const Schedules = useScheduleStore((state) => state.schedules);

  const { token } = useAuthStore(); // Get the authentication token from the store

  const handleBookNewService = () => {
    if (token) {
      // If user is logged in (token exists), navigate to BookAService
      navigation.navigate("BookAService");
    } else {
      // If user is not logged in, navigate to LoginScreen
      navigation.navigate("Login");
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={33} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch chăm sóc hôm nay</Text>
        <TouchableOpacity activeOpacity={0.7}>
          {/* <Ionicons name="person-circle-outline" size={33} color="#000" /> */}
        </TouchableOpacity>
      </View>

      {Schedules.length > 0 ? (
        <FlatList
          data={Schedules}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.scheduleList}
          renderItem={({ item }) => (
            <ScheduleItem
              schedule={item}
              onPress={() => {
                navigation.navigate("Map", { id: item._id });
              }}
            />
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../asset/img/empty_schedule.png")}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyTitle}>Không có lịch chăm sóc hôm nay</Text>
          <Text style={styles.emptyText}>
            Vui lòng kiểm tra lại sau hoặc đặt một lịch mới!
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBookNewService} // Use the new handler
          >
            <Text style={styles.backButtonText}>Đặt lịch mới</Text>
          </TouchableOpacity>
        </View>
      )}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#000",
  },
  scheduleList: {
    paddingBottom: 100, // chừa khoảng trống để không bị Footer che
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
});

export default WorkScreen;
