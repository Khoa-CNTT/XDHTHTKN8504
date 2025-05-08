import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import HomeHeader from "../../../components/home/HomeHeader";
import AvailabilitySwitch from "../../../components/home/AvailabilitySwitch";
import IncomeCard from "../../../components/home/IncomeCard";
import WorkStatsCard from "../../../components/home/WorkStatsCard";
import AvailableWorkList from "../../../components/home/AvailableWorkList";
import { router } from "expo-router";
import useCompletedBookingStore from "@/stores/completedBookingStore";
import updateAvailability from "../../../api/updateAvailability";
import useAuthStore from "@/stores/authStore";
import { useModalStore } from "@/stores/modalStore"; // Import useModalStore

const Home = () => {
  const extraInfo = useAuthStore((state) => state.extraInfo);
  const setExtraInfo = useAuthStore((state) => state.setExtraInfo);
  const { showModal } = useModalStore(); // Lấy phương thức showModal từ Zustand

  const isAvailable = extraInfo?.isAvailable ?? false;

  const completedBookings = useCompletedBookingStore(
    (state) => state.completedBookings
  );
  const totalSalary = completedBookings.reduce(
    (total, booking) => total + booking.salary,
    0
  );

const handleToggleAvailability = async (newValue: boolean) => {
  const isTurningOn = !isAvailable && newValue; // Chuyển từ tắt sang bật
  const isTurningOff = isAvailable && !newValue; // Chuyển từ bật sang tắt

  if (isTurningOn) {
    // Khi bật trạng thái, yêu cầu người dùng xác nhận
    showModal(
      "Xác nhận sẵn sàng đơn đặt lịch",
      "Bạn sẽ nhận được thông báo khi có đơn đặt lịch mới!",
      {
        type: "dialog", // Loại modal là dialog
        onConfirm: async () => {
          try {
            await updateAvailability(newValue); // Gọi API để bật trạng thái
            if (extraInfo) {
              const updatedExtraInfo = { ...extraInfo, isAvailable: newValue };
              await setExtraInfo(updatedExtraInfo); // Cập nhật trạng thái mới
            }
          } catch (error) {
            console.error("Không thể cập nhật trạng thái:", error);
          }
        },
        
      }
    );
  } else if (isTurningOff) {
    // Khi tắt trạng thái, yêu cầu người dùng xác nhận
    showModal(
      "Xác nhận tắt trạng thái sẵn sàng",
      "Bạn sẽ không nhận được thông báo đơn đặt lịch mới cho tới khi bật lại.",
      {
        type: "dialog", // Loại modal là dialog
        onConfirm: async () => {
          try {
            await updateAvailability(newValue); // Gọi API để tắt trạng thái
            if (extraInfo) {
              const updatedExtraInfo = { ...extraInfo, isAvailable: newValue };
              await setExtraInfo(updatedExtraInfo); // Cập nhật trạng thái mới
            }
          } catch (error) {
            console.error("Không thể cập nhật trạng thái:", error);
          }
        },
      }
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

      {/* Thu nhập */}
      <IncomeCard
        title="Thu nhập hiện tại"
        icon="cash-outline"
        income={totalSalary}
        color="green"
        onPress={() => {
          router.push("/screens/income-screen");
        }}
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
