import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import BalanceCard from "../components/Income/BalanceCard";
import BookingItem from "../components/Income/BookingItem";
import LoadingIndicator from "../components/LoadingIndicator";
import useBookingStore from "../stores/completedBookingStore";
import useCompletedBookingStore from "../stores/completedBookingStore";

const IncomeScreen: React.FC = () => {
    const completedBookings = useCompletedBookingStore((state) => state.completedBookings);
    const fetchCompletedBookings = useCompletedBookingStore((state) => state.fetchCompletedBookings);
    const loading = useCompletedBookingStore((state) => state.loading);
    const error = useCompletedBookingStore((state) => state.error);
    const totalSalary = completedBookings.reduce((total, booking) => total + booking.salary, 0);
    const totalCompleted = completedBookings.length;
    useEffect(() => {
  
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (completedBookings.length === 0) {
      fetchCompletedBookings(currentYear, currentMonth);
    }
  }, [fetchCompletedBookings, completedBookings.length]); // Chỉ gọi lại nếu completedBookings chưa có dữ liệu

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>THU NHẬP</Text>
      </View>
      <BalanceCard salary= {totalSalary} completed={totalCompleted} distance="200 Km" />

      <Text style={styles.sectionTitle}>Đã hoàn thành</Text>
      {completedBookings.length === 0 ? (
        <Text>No completed bookings</Text>
      ) : (
        <FlatList
          data={completedBookings}
          keyExtractor={(item) => item.bookingId}
          renderItem={({ item }) => <BookingItem item={item} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f9", // Màu nền sáng nhẹ nhàng
    padding: 0, // Padding tổng thể
  },
  header: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 25,
    paddingTop: 20,
    backgroundColor: "#28A745", // Màu xanh mát, hiện đại
    height: 150,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  headerTitle: {
    textAlign: "center",
    justifyContent: "center",
    fontSize: 28, // Tăng kích thước chữ cho tiêu đề
    fontWeight: "bold",
    color: "#fff", // Màu chữ đậm hơn để dễ đọc
    marginBottom: 20, // Khoảng cách dưới tiêu đề
  },
  balanceContainer: {
    marginBottom: 30, // Khoảng cách dưới BalanceCard
    marginTop: 20, // Khoảng cách trên BalanceCard
    alignItems: "center", // Căn giữa nội dung BalanceCard
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", // Màu chữ cho các phần mục tiêu đề
    marginTop: 20,
    marginBottom: 15, // Khoảng cách dưới phần tiêu đề "Trips"
    paddingHorizontal: 20,
  },
  noBookingsText: {
    fontSize: 18,
    color: "#999", // Màu chữ xám để làm nổi bật thông báo không có bookings
    textAlign: "center", // Căn giữa
    marginTop: 50, // Khoảng cách trên
  },
  flatListContainer: {
    marginTop: 20,
  },
  flatListContent: {
    paddingBottom: 20, // Đảm bảo có khoảng cách dưới khi cuộn
  },
});


export default IncomeScreen;
