import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import { Button } from "react-native-paper";
import { MapPin, Phone, MessageCircle } from "lucide-react-native"; // Importing Lucide icons
import { router } from "expo-router";
import TooEarlyModal from "../../../components/TooEarlyModal";
import useScheduleStore from "../../../stores/scheduleStore";
import { ScheduleStatus } from "../../../types/ScheduleStatus";
import { useScheduleSocket } from "../../../hooks/useScheduleSocket";
import updateScheduleStatus from "../../../api/ScheduleStatusApi";

const ShiftWorkScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const nearestSchedule = useScheduleStore((state) => state.nearestSchedule);
  const getNearestSchedule = useScheduleStore(
    (state) => state.getNearestSchedule
  );
  const updateSchedule = useScheduleStore((state) => state.updateSchedule);

  // Lấy lịch gần nhất khi load màn hình
  useEffect(() => {
    getNearestSchedule();
  }, []);

  // Kết nối socket với lịch hiện tại
  useScheduleSocket(nearestSchedule?._id || "");

  // Hàm cập nhật trạng thái lịch
  const handleUpdateStatus = async (newStatus: ScheduleStatus) => {
    if (!nearestSchedule) return;
    try {
      const updatedSchedule = await updateScheduleStatus(
        nearestSchedule._id,
        newStatus
      );
      updateSchedule(updatedSchedule); // cập nhật local store
    } catch (error) {
      console.error("Không thể cập nhật trạng thái:", error);
    }
  };

  const renderActionButtonByStatus = (status: ScheduleStatus) => {
    switch (status) {
      case "scheduled":
        return (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleUpdateStatus("waiting_for_client")}
          >
            <Text style={styles.actionButtonText}>Bắt đầu</Text>
          </TouchableOpacity>
        );
      case "waiting_for_client":
        return (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Chờ khách hàng sẵn sàng</Text>
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
          <Text style={styles.actionButtonText}>
            Chờ khách xác nhận hoàn tất
          </Text>
        );
      case "completed":
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
        return <Button>Bắt đầu</Button>;
    }
  };

  if (!nearestSchedule) {
    return (
      <View style={styles.centered}>
        <Text>Không có lịch gần nhất.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 31.2001,
          longitude: 29.9187,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      />

      <View style={styles.overlay}>
        <TouchableOpacity style={styles.showWayBtn}>
          <MapPin size={16} color="#000" />
          <Text style={styles.showWayText}>Hiển thị đường đi</Text>
        </TouchableOpacity>

        <View style={styles.arrivalInfo}>
          <Text style={styles.expectedLabel}>
            Thời gian dự kiến đến với khách
          </Text>
          <View style={styles.userInfo}>
            <Image
              source={{
                uri:
                  // nearestSchedule.patientAvatar ||
                  "https://via.placeholder.com/40",
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.userName}>
                {nearestSchedule.patientName || "Tên khách hàng"}
              </Text>
              <Text style={styles.travelInfo}>Chưa có thông tin</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <Button
            mode="outlined"
            icon={() => <Phone size={20} />}
            style={styles.button}
            onPress={() => {}}
          >
            Call
          </Button>
          <Button
            mode="outlined"
            icon={() => <MessageCircle size={20} />}
            style={styles.button}
            onPress={() => {}}
          >
            Chat
          </Button>
        </View>

        <TooEarlyModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />

        {renderActionButtonByStatus(nearestSchedule.status)}
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
  expectedLabel: {
    fontSize: 12,
    color: "gray",
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
    color: "white",
    textAlign: "center",
    padding: 15,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  button: {
    flex: 0.48,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ShiftWorkScreen;
