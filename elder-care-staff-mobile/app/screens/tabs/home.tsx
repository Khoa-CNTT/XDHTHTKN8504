import React, { useState } from "react";
import { View, StyleSheet, Text,Alert } from "react-native";
import HomeHeader from "../../../components/home/HomeHeader";
import AvailabilitySwitch from "../../../components/home/AvailabilitySwitch";
import IncomeCard from "../../../components/home/IncomeCard";
import useCompletedBookingStore from "@/stores/completedBookingStore";
import updateAvailability from "../../../api/updateAvailability";
import useAuthStore from "@/stores/authStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import UpcomingSchedule from "@/components/home/UpcomingSchedule";
import useScheduleStore from "@/stores/scheduleStore";
import useBookingStore from "@/stores/BookingStore";
const Home = () => {
  const extraInfo = useAuthStore((state) => state.extraInfo);
  const setExtraInfo = useAuthStore((state) => state.setExtraInfo);

  const isAvailable = extraInfo?.isAvailable ?? false;

  const completedBookings = useCompletedBookingStore(
    (state) => state.completedBookings
  );
  const totalSalary = completedBookings.reduce(
    (total, booking) => total + booking.salary,
    0
  );
  const activeSchedules = useScheduleStore(
    (state) =>
      state.schedules.filter(
        (s) => s.status !== "canceled" && s.status !== "completed"
      ).length
  );
  const acceptedBooking = useBookingStore(
    (state) =>
      state.participantBookings.filter(
        (s) => s.status === "accepted" || s.status === "completed"
      ).length
  );
  const canceledBooking = useBookingStore(
    (state) =>
      state.participantBookings.filter((s) => s.status === "cancelled").length
  );
  const handleToggleAvailability = async (newValue: boolean) => {
    const isTurningOn = !isAvailable && newValue;
    const isTurningOff = isAvailable && !newValue;

    const confirmAndUpdate = async () => {
      try {
        // Optimistically cập nhật giao diện
        if (extraInfo) {
          setExtraInfo({ ...extraInfo, isAvailable: newValue });
        }
        await updateAvailability(newValue);
      } catch (error) {
        console.error("Không thể cập nhật trạng thái:", error);
        // Nếu thất bại, rollback lại trạng thái cũ
        if (extraInfo) {
          setExtraInfo({ ...extraInfo, isAvailable: !newValue });
        }
      }
    };

    if (isTurningOn) {
      Alert.alert(
        "Xác nhận sẵn sàng đơn đặt lịch",
        "Bạn sẽ nhận được thông báo khi có đơn đặt lịch mới!",
        [
          {
            text: "Hủy",
            style: "cancel",
            onPress: () => {
              // Nếu hủy, rollback trạng thái
              if (extraInfo) {
                setExtraInfo({ ...extraInfo, isAvailable: !newValue });
              }
            },
          },
          { text: "Đồng ý", onPress: confirmAndUpdate },
        ]
      );
    } else if (isTurningOff) {
      Alert.alert(
        "Xác nhận tắt trạng thái sẵn sàng",
        "Bạn sẽ không nhận được thông báo đơn đặt lịch mới cho tới khi bật lại.",
        [
          {
            text: "Hủy",
            style: "cancel",
            onPress: () => {
              if (extraInfo) {
                setExtraInfo({ ...extraInfo, isAvailable: !newValue });
              }
            },
          },
          { text: "Đồng ý", onPress: confirmAndUpdate },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <HomeHeader />
      <AvailabilitySwitch
        isAvailable={isAvailable}
        setIsAvailable={handleToggleAvailability}
      />
      <View style={styles.infoContainer}>
        {/* Thu nhập */}
        <IncomeCard
          value={totalSalary}
          label="Thu nhập hiện tại"
          icon={<MaterialIcons name="attach-money" size={24} color="#5cb85c" />}
          color="#5cb85c"
        />
        <IncomeCard
          value={acceptedBooking}
          label="Đơn đặt lịch"
          icon={<Ionicons name="bag-check-outline" size={24} color="#0aeeee" />}
          color="#5cb85c"
        />
        <IncomeCard
          value={activeSchedules}
          label="Ca làm việc"
          icon={
            <Ionicons
              name="calendar-number-outline"
              size={24}
              color="#f78f07"
            />
          }
          color="#5cb85c"
        />
        <IncomeCard
          value={canceledBooking}
          label="Bị hủy"
          icon={<MaterialIcons name="cancel" size={24} color="#ee0b0b" />}
          color="#5cb85c"
        />
      </View>
      <Text style={styles.sectionTitle}>Lịch làm việc sắp tới</Text>
      <UpcomingSchedule />
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 15,
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
});

export default Home;
