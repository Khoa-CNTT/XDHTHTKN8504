import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Button } from "react-native-paper";
import { MapPin, Phone, MessageCircle } from "lucide-react-native";
import { router } from "expo-router";
import TooEarlyModal from "../../../components/TooEarlyModal";
import useScheduleStore from "../../../stores/scheduleStore";
import { ScheduleStatus } from "../../../types/ScheduleStatus";
import { useScheduleSocket } from "../../../hooks/useScheduleSocket";
import ScheduleStatusApi from "../../../api/ScheduleStatusApi";
import { MapWithRoute } from "@/components/MapWithRoute";
import canStartSchedule from "@/utils/canStartSchedule";

const ShiftWorkScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const nearestSchedule = useScheduleStore((state) => state.nearestSchedule);
  const updateSchedule = useScheduleStore((state) => state.updateSchedule);

  useScheduleSocket(nearestSchedule?.schedule._id || "");

  const handleUpdateStatus = async (newStatus: ScheduleStatus) => {
    if (!nearestSchedule) return;
    try {
      await ScheduleStatusApi.updateScheduleStatus(
        nearestSchedule.schedule._id,
        newStatus
      );
      updateSchedule(nearestSchedule.schedule._id, newStatus);
    } catch (error) {
      console.error("Không thể cập nhật trạng thái:", error);
    }
  };

  const renderActionButtonByStatus = (status: ScheduleStatus, start: Date) => {
    const isTimeReady = canStartSchedule(start);
    switch (status) {
      case "scheduled":
        return (
          <TouchableOpacity
            style={[
              styles.actionButton,
              !isTimeReady && { backgroundColor: "#ccc" },
            ]}
            disabled={!isTimeReady}
            onPress={() => handleUpdateStatus("waiting_for_client")}
          >
            <Text style={styles.actionButtonText}>
              {isTimeReady ? "Bắt đầu" : "Chưa đến thời gian"}
            </Text>
          </TouchableOpacity>
        );
      case "waiting_for_client":
        return (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Chờ khách hàng sẵn sàng</Text>
          </TouchableOpacity>
        );
      case "waiting_for_nurse":
        return (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleUpdateStatus("on_the_way")}
          >
            <Text style={styles.actionButtonText}>Bắt đầu di chuyển</Text>
          </TouchableOpacity>
        );
      case "on_the_way":
        return (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleUpdateStatus("check_in")}
          >
            <Text style={styles.actionButtonText}>Đã đến nơi</Text>
          </TouchableOpacity>
        );
      case "check_in":
        return (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleUpdateStatus("in_progress")}
          >
            <Text style={styles.actionButtonText}>Bắt đầu chăm sóc</Text>
          </TouchableOpacity>
        );
      case "in_progress":
        return (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleUpdateStatus("check_out")}
          >
            <Text style={styles.actionButtonText}>Kết thúc chăm sóc</Text>
          </TouchableOpacity>
        );
      case "check_out":
        return (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>
              Chờ khách hàng xác nhận hoàn thành
            </Text>
          </TouchableOpacity>
        );
      case "completed":
      case "cancelled":
        return (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/screens/tabs/home")}
          >
            <Text style={styles.actionButtonText}>Về màn hình chính</Text>
          </TouchableOpacity>
        );
      default:
        return (
          <Text style={styles.actionButtonText}>Trở về màn hình chính</Text>
        );
    }
  };

  if (!nearestSchedule) {
    return (
      <View style={styles.emptyContainer}>
        <Image
          source={require("../../../assets/images/empty_schedule.png")} // Bạn cần thêm ảnh này vào thư mục assets
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <Text style={styles.emptyTitle}>
          Hiện tại bạn không có lịch làm việc
        </Text>
        <Text style={styles.emptyText}>
          Vui lòng kiểm tra lại sau hoặc quay về trang chủ.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/screens/tabs/home")}
        >
          <Text style={styles.backButtonText}>Về trang chủ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapWithRoute customerAddress={nearestSchedule.customerAddress} />

      <View style={styles.overlay}>
        <View style={styles.arrivalInfo}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: "https://via.placeholder.com/40" }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.userName}>
                {nearestSchedule.schedule.patientName || "Tên khách hàng"}
              </Text>
              <Text style={styles.travelInfo}>
                {nearestSchedule.serviceName}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <Button
            mode="outlined"
            icon={() => <Phone size={20} />}
            style={styles.button}
            onPress={() => {
              const phoneNumber = nearestSchedule.phoneNumber;
              if (phoneNumber) {
                Linking.openURL(`tel:${phoneNumber}`);
              } else {
                console.log("Số điện thoại không hợp lệ");
              }
            }}
          >
            Call
          </Button>
          <Button
            mode="outlined"
            icon={() => <MessageCircle size={20} />}
            style={styles.button}
            onPress={() => {
              router.push("/screens/chat");
            }}
          >
            Chat
          </Button>
        </View>

        <TooEarlyModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />

        {nearestSchedule?.schedule.timeSlots[0]?.start &&
          renderActionButtonByStatus(
            nearestSchedule.schedule.status,
            new Date(nearestSchedule.schedule.timeSlots[0].start)
          )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  map: { ...StyleSheet.absoluteFillObject },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  arrivalInfo: { marginBottom: 16 },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: { fontWeight: "bold", fontSize: 16 },
  travelInfo: { fontSize: 14, color: "gray" },
  actionButton: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 20,
  },
  actionButtonText: {
    padding: 14,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: { width: "48%" },

  // Giao diện khi không có lịch
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

export default ShiftWorkScreen;
