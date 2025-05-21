import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from "react-native";
import BalanceCard from "../../components/Income/BalanceCard";
import BookingItem from "../../components/Income/BookingItem";
import { router } from "expo-router";
import { LineChart } from "react-native-chart-kit";
import useBookingStore from "@/stores/BookingStore";
import { Booking } from "@/types/Booking";
import { Ionicons } from "@expo/vector-icons";
const screenWidth = Dimensions.get("window").width;

const IncomeScreen: React.FC = () => {
  const participantBookings = useBookingStore.getState().participantBookings;

  const completedBookings = participantBookings.filter(
    (booking) => booking.status === "completed"
  );
  const acceptedBooking = useBookingStore(
    (state) =>
      state.participantBookings.filter(
        (s) => s.status === "accepted"
      ).length
  );

  const totalSalary = completedBookings.reduce(
    (total, booking) => total + booking.totalDiscount,
    0
  );
  const totalCompleted = completedBookings.length;


  const handleSelectJob = (job: Booking) => {
    if (job._id) {
      router.push(`/screens/schedule-detail/${job._id}`);
    } else {
      console.warn("bookingId is missing in selected job:", job);
    }
  };

  const getChartData = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    // Dữ liệu tổng thu nhập từng ngày
    const data = days.map((day) => {
      return completedBookings
        .filter((b) => new Date(b.updatedAt).getDate() === day)
        .reduce((sum, b) => sum + b.totalDiscount, 0);
    });

    // Label mỗi 7 ngày, ngày khác để trống
    const labels = days.map((day) => (day % 7 === 0 ? String(day) : ""));

    return {
      labels,
      datasets: [{ data }],
    };
  };


  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={33} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dịch vụ</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="person-circle-outline" size={33} color="#000" />
        </TouchableOpacity>
      </View>
      <BalanceCard
        salary={totalSalary}
        completed={totalCompleted}
        distance={acceptedBooking}
      />

      <Text style={styles.sectionTitle}>Biểu đồ thu nhập</Text>
      <LineChart
        data={getChartData()}
        width={screenWidth - 32}
        height={220}
        yAxisSuffix="đ"
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(40, 167, 69, ${opacity})`,
          labelColor: () => "#555",
          strokeWidth: 3, // Độ dày đường nét
          propsForDots: {
            r: "6", // Bán kính chấm điểm
            strokeWidth: "2",
            stroke: "#28A745", // Màu viền chấm điểm
            fill: "#a4de02", // Màu nền chấm điểm
          },
        }}
        style={{
          marginHorizontal: 16,
          borderRadius: 20, // Bo tròn góc biểu đồ
          backgroundColor: "#f9fff7", // Màu nền nhẹ nhàng
        }}
        withDots={false}
        bezier
      />
      <Text style={styles.sectionTitle}>Lịch sử hoạt động</Text>
      {completedBookings.length === 0 ? (
        <Text style={styles.noBookingsText}>Chưa có chuyến nào hoàn thành</Text>
      ) : (
        <FlatList
          data={completedBookings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <BookingItem item={item} onPress={() => handleSelectJob(item)} />
          )}
          scrollEnabled={false}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f9" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#000",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
    color: "#333",
  },
  noBookingsText: {
    fontSize: 16,
    textAlign: "center",
    color: "#999",
    marginVertical: 20,
  },
});

export default IncomeScreen;
