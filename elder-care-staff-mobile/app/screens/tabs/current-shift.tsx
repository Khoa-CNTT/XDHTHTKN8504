import React, { useEffect, useState } from "react";
import {log} from "../../../utils/logger"
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from "react-native";
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

  // Hàm cập nhật trạng thái lịch
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

  const renderActionButtonByStatus = (
    status: ScheduleStatus,
    start: Date
  ) => {
    console.log("🔍 start time", start);
    const isTimeReady = canStartSchedule(start);
    console.log("✅ isTimeReady", isTimeReady);
    switch (status) {
      case "scheduled":
        return (
          <TouchableOpacity
            style={[
              styles.actionButton,
              !isTimeReady && { backgroundColor: "#ccc" }, // màu xám nếu chưa sẵn sàng
            ]}
            disabled={!isTimeReady} // không cho bấm nếu chưa sẵn sàng
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
        return (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/screens/tabs/home")}
          >
            <Text style={styles.actionButtonText}>Trở về màn hình chính</Text>
          </TouchableOpacity>
        );
      case "cancelled":
        return (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/screens/tabs/home")}
          >
            <Text style={styles.actionButtonText}>Kết thúc chăm sóc</Text>
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
      <View>
        <Text>Không có lịch gần nhất.</Text>
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
              source={{
                uri: "https://via.placeholder.com/40", // Placeholder ảnh bệnh nhân
              }}
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

        {nearestSchedule && nearestSchedule.schedule.timeSlots[0]?.start
          ? renderActionButtonByStatus(
              nearestSchedule.schedule.status,
              new Date(nearestSchedule.schedule.timeSlots[0].start)
            )
          : null}
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
  showWayBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  showWayText: {
    marginLeft: 6,
    color: "#000",
    fontWeight: "bold",
  },
  arrivalInfo: {
    marginBottom: 16,
  },
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
  userName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  travelInfo: {
    fontSize: 14,
    color: "gray",
  },
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
  button: {
    width: "48%",
  },
});

export default ShiftWorkScreen;
