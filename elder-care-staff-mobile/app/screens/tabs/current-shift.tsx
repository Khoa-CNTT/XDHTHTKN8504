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
import { MapPin, Phone, MessageCircle, MapPlus } from "lucide-react-native";
import { router } from "expo-router";
import TooEarlyModal from "../../../components/TooEarlyModal";
import useScheduleStore from "../../../stores/scheduleStore";
import { ScheduleStatus } from "../../../types/ScheduleStatus";
import { useScheduleSocket } from "../../../hooks/useScheduleSocket";
import ScheduleStatusApi from "../../../api/ScheduleStatusApi";
import { MapWithRoute } from "@/components/MapWithRoute";
import canStartSchedule from "@/utils/canStartSchedule";
import { log } from "@/utils/logger";
import { createNewChat } from "@/api/chatService";
import { ChatType } from "@/types/Chat";


const ShiftWorkScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const nearestSchedule = useScheduleStore((state) => state.nearestSchedule);
  const updateSchedule = useScheduleStore((state) => state.updateSchedule);
  log(nearestSchedule)

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
      case "canceled":
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

  const handleStartChat = async ({
    targetUserId,
    chatType,
    title,
  }: {
    targetUserId: string;
    chatType: ChatType;
    title?: string;
  }) => {
    try {
      const chat = await createNewChat({
        targetUserId,
        chatType,
        title,
      });

      if (chat && chat._id) {
        // Truyền chatId qua query param (không đổi tên file)
        router.push({
          pathname: "/screens/chat",
          params: {
            chatId: chat._id,
            title: chat.title || "",
            chatType: chat.chatType,
            customerName: nearestSchedule?.schedule.patientName,
            customerPhone: nearestSchedule?.phoneNumber,
            avatar: nearestSchedule?.avatar
          },
        });
      }
    } catch (error) {
      console.error("Không thể tạo cuộc trò chuyện:", error);
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
          <View style={styles.navigateRow}>
            <TouchableOpacity
              style={styles.navigateButton}
              onPress={() => {
                const address = nearestSchedule.customerAddress;
                if (address) {
                  // encode địa chỉ để đưa vào URL
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    address
                  )}`;
                  Linking.openURL(url);
                } else {
                  console.log("Địa chỉ không hợp lệ");
                }
              }}
            >
              <Text style={styles.navigateText}>Mở điều hướng hệ thống</Text>
              <MapPlus size={16} color="#127df0" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
          <View style={styles.userInfo}>
            <Image
              source={
                nearestSchedule.avatar
                  ? { uri: nearestSchedule.avatar }
                  : require("../../../assets/images/avatar.jpg")
              }
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
              handleStartChat({
                targetUserId: nearestSchedule.customerId,
                chatType: "staff-family",
                title: nearestSchedule.serviceName
              })
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
  container: { flex: 1, backgroundColor: "#f0f4f8" },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.97)",
    paddingHorizontal: 24,
    paddingBottom: 25,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  userName: {
    fontWeight: "700",
    fontSize: 18,
    color: "#222",
  },
  travelInfo: {
    fontSize: 15,
    color: "#666",
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  button: {
    width: "48%",
    alignItems: "center"
  },
  actionButton: {
    marginTop: 12,
    borderRadius: 25,
    paddingVertical: 16,
    backgroundColor: "#3b82f6", // Màu xanh dương hiện đại
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonDisabled: {
    backgroundColor: "#a1a1aa",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  // phần không có lịch
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fefefe",
  },
  emptyImage: {
    width: 220,
    height: 220,
    marginBottom: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#444",
    marginBottom: 10,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
    marginBottom: 26,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  arrivalInfo: {
    fontSize: 16,
    color: "#444",
    marginTop: 8,
    marginBottom: 8,
  },
  navigateRow: {
    marginTop: 5,
    marginBottom: 20
  },

  navigateButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  navigateText: {
    color: "#154b85",
    fontWeight: "600",
    fontSize: 12,
    fontStyle: "italic",
    marginVertical: 10,
  },
});
export default ShiftWorkScreen;
