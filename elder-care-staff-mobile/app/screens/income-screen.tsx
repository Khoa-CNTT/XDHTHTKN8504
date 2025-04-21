import React from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface Trip {
  id: string;
  name: string;
  avatar: number;
  distance: string;
  duration: string;
  timeInfo: string;
}"https://randomuser.me/api/portraits/men/2.jpg"

const trips: Trip[] = [
  {
    id: "1",
    name: "Nade",
    avatar: require("../../assets/images/avatar.jpg"),
    distance: "14 km",
    duration: "20 Minutes",
    timeInfo: "half an hour ago",
  },
  {
    id: "2",
    name: "Ahmed",
    avatar: require("../../assets/images/avatar.jpg"),
    distance: "17 km",
    duration: "25 Minutes",
    timeInfo: "Today at 10:20 pm",
  },
  {
    id: "3",
    name: "Shrouk",
    avatar: require("../../assets/images/avatar.jpg"),
    distance: "18 km",
    duration: "28 Minutes",
    timeInfo: "Today at 9:00 pm",
  },
];

export default function IncomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>THU NHẬP</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.todayText}>Today</Text>
        <Text style={styles.amountText}>1200 EGP</Text>
        <Text style={styles.ridersText}>🚴 14 Riders</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoValue}>19h 48m</Text>
            <Text style={styles.infoLabel}>Duration</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoValue}>200 Km</Text>
            <Text style={styles.infoLabel}>Distance</Text>
          </View>
        </View>
      </View>

      <View style={styles.tripsHeader}>
        <Text style={styles.sectionTitle}>Trips</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tripItem}>
            <Image source={item.avatar} style={styles.avatar} />
            <View style={styles.tripDetails}>
              <Text style={styles.tripName}>{item.name}</Text>
              <Text style={styles.tripMeta}>
                {item.distance} · {item.duration}
              </Text>
            </View>
            <Text style={styles.timeInfo}>{item.timeInfo}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f9", // Nền màu sáng và dễ chịu
    paddingTop: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 20,
    backgroundColor: "#4cd964", // Màu xanh mát, hiện đại
    height: 150,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
    // textAlign: "center",
  },
  balanceCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginTop: -50,
    borderRadius: 20,
    padding: 25,
    elevation: 5, // Tăng độ đổ bóng nhẹ
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  todayText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
  },
  amountText: {
    fontSize: 38,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 12,
    color: "#333", // Màu tối cho số tiền
  },
  ridersText: {
    fontSize: 16,
    textAlign: "center",
    color: "#4cd964", // Màu xanh cho Riders
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  infoBox: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#f9f9f9", // Nền sáng nhẹ nhàng
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  infoValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  infoLabel: {
    fontSize: 14,
    color: "#888",
  },
  tripsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  seeAll: {
    fontSize: 16,
    color: "#4cd964", // Màu xanh cho "See All"
  },
  tripItem: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 18,
    borderWidth: 2,
    borderColor: "#ddd", // Viền nhẹ cho ảnh
  },
  tripDetails: {
    flex: 1,
  },
  tripName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333", // Màu đen cho tên chuyến đi
  },
  tripMeta: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  timeInfo: {
    fontSize: 13,
    color: "#888",
  },
});
