import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";

const DriverHomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      

      {/* Online/Offline Switch */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>On/Off</Text>
        <Switch
          value={true} // Replace with your state variable
          onValueChange={() => {}} // Replace with your toggle function
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={true ? "#f4f3f4" : "#f4f3f4"}
        />
      </View>

      {/* Earnings and Ride Information */}
      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <Text style={styles.infoValue}>3100</Text>
          <Text style={styles.infoLabel}>total Earning</Text>
          <FontAwesome5 name="money-bill-alt" size={20} color="#5cb85c" />
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoValue}>02</Text>
          <Text style={styles.infoLabel}>pending Ride</Text>
          <Ionicons name="time-outline" size={20} color="#f0ad4e" />
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoValue}>12</Text>
          <Text style={styles.infoLabel}>complete Ride</Text>
          <Ionicons name="checkmark-circle-outline" size={20} color="#5bc0de" />
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoValue}>04</Text>
          <Text style={styles.infoLabel}>cancel Ride</Text>
          <Ionicons name="close-circle-outline" size={20} color="#d9534f" />
        </View>
      </View>

      {/* New Upcoming Ride */}
      <View style={styles.upcomingRideContainer}>
        <Text style={styles.upcomingRideTitle}>New Upcoming Ride</Text>
        <View style={styles.rideDetailsCard}>
          <View style={styles.riderInfo}>
            <Image
              source={{ uri: "https://via.placeholder.com/50" }} // Replace with actual image URL
              style={styles.riderAvatar}
            />
            <Text style={styles.riderName}>Johnson Smithkover</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#ffc107" />
              <Text style={styles.rating}>4.5</Text>
            </View>
            <View style={styles.rideIdContainer}>
              <Text style={styles.rideId}>256</Text>
            </View>
          </View>
          <Text style={styles.rideTime}>15 Dec'23 at 10:15 AM</Text>
          <Text style={styles.rideDistance}>
            <MaterialIcons name="location-on" size={16} color="#777" /> 9.5 km
          </Text>
          <View style={styles.addressContainer}>
            <Ionicons name="location" size={16} color="#777" />
            <Text style={styles.addressText}>
              220 Yonge St, Toronto, ON M5B 2H1, Canada
            </Text>
          </View>
          <View style={styles.addressContainer}>
            <Ionicons name="flag" size={16} color="#777" />
            <Text style={styles.addressText}>
              17600 Yonge St, Newmarket, ON L3Y 4Z1, Canada
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    backgroundColor: "#27ae60",
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  notificationButton: {
    padding: 8,
  },
  switchContainer: {
    backgroundColor: "#fff",
    padding: 15,
    margin: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  infoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: "#fff",
    width: "45%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  infoValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 14,
    color: "#777",
    marginBottom: 8,
  },
  upcomingRideContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  upcomingRideTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  rideDetailsCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
  },
  riderInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  riderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  riderName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  rating: {
    marginLeft: 3,
    color: "#ffc107",
  },
  rideIdContainer: {
    backgroundColor: "#d4edda",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  rideId: {
    color: "#155724",
    fontWeight: "bold",
    fontSize: 14,
  },
  rideTime: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
  rideDistance: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  addressText: {
    marginLeft: 5,
    color: "#555",
    fontSize: 14,
    flexShrink: 1,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f9f9f9",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  navItem: {
    alignItems: "center",
  },
  navLabel: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
  },
});

export default DriverHomeScreen;
