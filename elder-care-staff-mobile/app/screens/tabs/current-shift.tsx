import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MapView from "react-native-maps";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";

import updateScheduleStatus from "../../api/ScheduleStatusApi";
import { Schedule } from "@/types/Schedule";
import useScheduleStore from "../../stores/scheduleStore";
import { getNearestSchedule } from "../../../utils/getNearestSchedule";
import { isWithinNextHour } from "../../../utils/isWithinNextHour";

const ScheduleScreen = () => {
  const { schedules } = useScheduleStore();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchSchedule();
  }, [schedules]);

  const fetchSchedule = async () => {
    const nearestSchedule = getNearestSchedule(schedules);
    if (nearestSchedule) {
      setSchedule(nearestSchedule);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: Schedule["status"]) => {
    if (!schedule) return;

    try {
      setLoading(true);
      const updated = await updateScheduleStatus(schedule._id, newStatus);
      setSchedule(updated);
    } catch (err) {
      console.error("Cập nhật trạng thái lỗi:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderActionButton = () => {
    if (!schedule) return null;

    const isWithinOneHour = isWithinNextHour(schedule.timeSlots.start);

    const buttonStyle = isWithinOneHour
      ? styles.activeButton
      : styles.inactiveButton; // Style khi không trong 1 giờ
    const buttonTextStyle = isWithinOneHour
      ? styles.activeButtonText
      : styles.inactiveButtonText; // Style cho text khi không trong 1 giờ

    switch (schedule.status) {
      case "scheduled":
        return (
          <Button
            mode="contained"
            onPress={() => handleUpdateStatus("waiting_for_client")}
            style={[styles.actionButton, buttonStyle]}
            labelStyle={buttonTextStyle}
          >
            Bắt đầu
          </Button>
        );
      case "waiting_for_client":
        return (
          <Button
            mode="contained"
            onPress={() => handleUpdateStatus("waiting_for_nurse")}
            style={[styles.actionButton, buttonStyle]}
            labelStyle={buttonTextStyle}
          >
            Cả hai bên đã sẵn sàng
          </Button>
        );
      case "on_the_way":
        return (
          <Button
            mode="contained"
            onPress={() => handleUpdateStatus("check_in")}
            style={[styles.actionButton, buttonStyle]}
            labelStyle={buttonTextStyle}
          >
            Tôi đã đến nơi
          </Button>
        );
      case "check_in":
        return (
          <Button
            mode="contained"
            onPress={() => handleUpdateStatus("in_progress")}
            style={[styles.actionButton, buttonStyle]}
            labelStyle={buttonTextStyle}
          >
            Bắt đầu chăm sóc
          </Button>
        );
      case "in_progress":
        return (
          <Button
            mode="contained"
            onPress={() => handleUpdateStatus("check_out")}
            style={[styles.actionButton, buttonStyle]}
            labelStyle={buttonTextStyle}
          >
            Hoàn tất chăm sóc
          </Button>
        );
      case "check_out":
        return (
          <Text style={styles.statusText}>Đang chờ khách xác nhận...</Text>
        );
      case "completed":
        return <Text style={styles.statusText}>Đã hoàn tất!</Text>;
      case "cancelled":
        return <Text style={styles.statusText}>Đã hủy</Text>;
      default:
        return null;
    }
  };

  if (loading || !schedule) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Bản đồ */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 31.2001,
          longitude: 29.9187,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      />

      {/* Nội dung overlay */}
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.showWayBtn}>
          <Icon name="navigate-outline" size={16} color="#000" />
          <Text style={styles.showWayText}>Hiển thị đường đi</Text>
        </TouchableOpacity>

        {/* Thông tin khách hàng */}
        <View style={styles.arrivalInfo}>
          <Text style={styles.expectedLabel}>
            Thời gian dự kiến đến với khách
          </Text>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: "https://via.placeholder.com/40" }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.userName}>
                {schedule.patientName || "Tên điều dưỡng"}
              </Text>
              <Text style={styles.travelInfo}>26 min - 16.3 km</Text>
            </View>
          </View>
        </View>

        {/* Nút hành động: gọi/chat */}
        <View style={styles.buttonRow}>
          <Button
            mode="outlined"
            icon="phone"
            style={styles.button}
            onPress={() => {}}
          >
            Call
          </Button>
          <Button
            mode="outlined"
            icon="chat"
            style={styles.button}
            onPress={() => {}}
          >
            Chat
          </Button>
        </View>

        {/* Nút trạng thái */}
        {renderActionButton()}
      </View>
    </View>
  );
};

export default ScheduleScreen;

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
  timeCountdown: {
    color: "red",
    fontWeight: "bold",
    marginTop: 4,
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
    fontSize: 12,
    color: "gray",
  },
  actionButton: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
  },
  activeButton: {
    backgroundColor: "#4CAF50", // Giữ màu xanh khi isWithinOneHour là true
  },
  inactiveButton: {
    backgroundColor: "#B0B0B0", // Màu nhạt khi isWithinOneHour là false
  },
  activeButtonText: {
    color: "white", 
  },
  inactiveButtonText: {
    color: "#E0E0E0", 
  },
  statusText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
    color: "#888",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  button: {
    flex: 0.48,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  iconButton: {
    alignItems: "center",
  },
  iconText: {
    color: "#4CAF50",
    marginTop: 4,
  },
});
