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
import { Phone, MessageCircle } from "lucide-react-native";
import { useRoute, RouteProp } from "@react-navigation/native";

import useScheduleStore from "../stores/scheduleStore";
import { ScheduleStatus } from "../types/ScheduleStatus";
import { MapWithRoute } from "../components/MapWithRoute";
import updateScheduleStatus from "../api/ScheduleStatusApi";
import Footer from "../components/Footer";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Home: undefined;
};
type NavigationProp = StackNavigationProp<RootStackParamList>;

const MapScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<{ Map: { id: string } }, "Map">>();
  const { id } = route.params;

  const [loading, setLoading] = useState(true);
  const nearestSchedule = useScheduleStore((state) =>
    state.getScheduleById(id)
  );

  useEffect(() => {
    if (nearestSchedule) {
      setLoading(false);
    }
  }, [nearestSchedule]);

  useEffect(() => {
    if (nearestSchedule?.status === "completed") {
      navigation.navigate("Home");
    }
  }, [nearestSchedule?.status]); // Watch for status changes to navigate to Home

  const updateSchedule = useScheduleStore((state) => state.updateSchedule);

  const handleUpdateStatus = async (newStatus: ScheduleStatus) => {
    if (!nearestSchedule) return;
    try {
      await updateScheduleStatus(nearestSchedule._id, newStatus);
      // Update the schedule in the store
      updateSchedule({ scheduleId: nearestSchedule._id, newStatus });
    } catch (error) {
      console.error("Không thể cập nhật trạng thái:", error);
    }
  };

  const renderActionButtonByStatus = (status: ScheduleStatus) => {
    switch (status) {
      case "scheduled":
        return (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>
              Lịch chưa tới thời gian thực hiện
            </Text>
          </TouchableOpacity>
        );
      case "waiting_for_client":
        return (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleUpdateStatus("waiting_for_nurse")}
          >
            <Text style={styles.actionButtonText}>Sẵn sàng</Text>
          </TouchableOpacity>
        );
      case "on_the_way":
        return (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>
              Nhân viên đang trên đường tới
            </Text>
          </TouchableOpacity>
        );
      case "check_in":
        return (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Nhân viên đã tới</Text>
          </TouchableOpacity>
        );
      case "in_progress":
        return (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Đang chăm sóc</Text>
          </TouchableOpacity>
        );
      case "check_out":
        return (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleUpdateStatus("completed")}
          >
            <Text style={styles.actionButtonText}>Xác nhận hoàn thành</Text>
          </TouchableOpacity>
        );
      case "completed":
      case "cancelled":
        return (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Kết thúc chăm sóc</Text>
          </TouchableOpacity>
        );
      default:
        return (
          <Text style={styles.actionButtonText}>Trở về màn hình chính</Text>
        );
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!nearestSchedule) {
    return (
      <View>
        <Text>Không có lịch gần nhất.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapWithRoute customerAddress={nearestSchedule?.serviceName || ""} />
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.arrivalInfo}>
            <View style={styles.userInfo}>
              <Image
                source={{ uri: "https://via.placeholder.com/40" }}
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
              onPress={() => {}}
            >
              Chat
            </Button>
          </View>

          {renderActionButtonByStatus(nearestSchedule.status)}
        </View>
        <Footer />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
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
    flexDirection: "column",
    justifyContent: "space-between",
    maxHeight: "65%",
  },
  content: {
    flexGrow: 1,
    paddingBottom: 70,
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
