import React, { useEffect, useState } from "react";
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

import { useRoute, RouteProp } from "@react-navigation/native";

import useScheduleStore from "../stores/scheduleStore";
import { ScheduleStatus } from "../types/ScheduleStatus";
import { MapWithRoute } from "../components/MapWithRoute";
import updateScheduleStatus from "../api/ScheduleStatusApi";

type MapRouteParams = {
  Map: { id: string };
};

const MapScreen: React.FC = () => {

  const route = useRoute<RouteProp<{ Map: { id: string } }, "Map">>();
  const { id } = route.params;
  const nearestSchedule = useScheduleStore((state) => state.getScheduleById(id));

  const updateSchedule = useScheduleStore((state) => state.updateSchedule);
  

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
          >
            <Text style={styles.actionButtonText}>Lịch chưa tới thời gian thực hiện</Text>
          </TouchableOpacity>
        );
      case "waiting_for_client":
        return (
          <TouchableOpacity style={styles.actionButton}
             onPress={() => handleUpdateStatus("waiting_for_nurse")}
          >
            <Text style={styles.actionButtonText}>Chờ khách hàng sẵn sàng</Text>
          </TouchableOpacity>
        );
      case "on_the_way":
        return (
          <TouchableOpacity
            style={styles.actionButton}
          >
            <Text style={styles.actionButtonText}>Nhân viên đang trên đường tới</Text>
          </TouchableOpacity>
        );
      case "check_in":
        return (
          <TouchableOpacity
            style={styles.actionButton}
          >
            <Text style={styles.actionButtonText}>Nhân viên đã tới</Text>
          </TouchableOpacity>
        );
      case "in_progress":
        return (
          <TouchableOpacity
            style={styles.actionButton}
          >
            <Text style={styles.actionButtonText}>Đang chăm sóc</Text>
          </TouchableOpacity>
        );
      case "check_out":
        return (
          <TouchableOpacity style={styles.actionButton}
             onPress={() => handleUpdateStatus("completed")}
          >
            <Text style={styles.actionButtonText}>Xác nhận hoàn thành</Text>
          </TouchableOpacity>
        );
      case "completed":
      case "cancelled":
        return (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {}}
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
      <MapWithRoute customerAddress={nearestSchedule.serviceName} />

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
                {nearestSchedule.staffFullName || "Tên khách hàng"}
              </Text>
              <Text style={styles.travelInfo}>
                {nearestSchedule.staffPhone}
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
              const phoneNumber = nearestSchedule.staffPhone;
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
              
            }}
          >
            Chat
          </Button>
        </View>

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

export default MapScreen;
