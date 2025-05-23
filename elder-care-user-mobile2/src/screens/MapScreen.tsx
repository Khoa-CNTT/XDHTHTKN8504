import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import useScheduleStore from "../stores/scheduleStore";
import { ScheduleStatus } from "../types/ScheduleStatus";
import { RootStackParamList } from "../navigation/navigation";

import { MapWithRoute } from "../components/MapWithRoute";
import UserInfoCard from "../components/workScreen/UserInfoCard";
import ContactButtons from "../components/workScreen/ContactButtons";
import ActionButtonByStatus from "../components/workScreen/ActionButtonByStatus";
import Footer from "../components/Footer";
import RatingModal from "../components/RatingModal";

import updateScheduleStatus from "../api/ScheduleStatusApi";
import { log } from "../utils/logger";
import { createNewChat } from "../api/chatService";
import { ChatType } from "../types/Chat";

const { height } = Dimensions.get("window");

type NavigationProp = StackNavigationProp<RootStackParamList>;

const MapScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<{ Map: { id: string } }, "Map">>();
  const { id } = route.params;

  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const nearestSchedule = useScheduleStore((state) =>
    state.getScheduleById(id)
  );
  const updateSchedule = useScheduleStore((state) => state.updateSchedule);

  useEffect(() => {
    if (nearestSchedule) {
      setLoading(false);
    }
  }, [nearestSchedule]);

  const handleUpdateStatus = async (newStatus: ScheduleStatus) => {
    if (!nearestSchedule) return;
    setUpdatingStatus(true);
    try {
      await updateScheduleStatus(nearestSchedule._id, newStatus);
      updateSchedule({ scheduleId: nearestSchedule._id, newStatus });

      if (newStatus === "completed") {
        setModalVisible(true);
      }
      
    } catch (error) {
      console.error("Không thể cập nhật trạng thái:", error);
    } finally {
      setUpdatingStatus(false);
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
        navigation.navigate("Chat", {
          chatId: chat._id,
          staffName: nearestSchedule?.staffFullName,
          staffPhone: nearestSchedule?.staffPhone,
          avatar: nearestSchedule?.staffAvatar,
        });
      }
    } catch (error) {
      console.error("Không thể tạo cuộc trò chuyện:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (!nearestSchedule) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noDataText}>Không có lịch gần nhất.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapWithRoute customerAddress={nearestSchedule.role || ""} />

      <View style={styles.sheet}>
        <ScrollView
          contentContainerStyle={styles.sheetContent}
          showsVerticalScrollIndicator={false}
        >
          <UserInfoCard
            name={nearestSchedule.staffFullName || "Tên khách hàng"}
            phone={nearestSchedule.staffPhone}
            avatarUrl={nearestSchedule.staffAvatar}
          />

          <ContactButtons
            phone={nearestSchedule.staffPhone}
            onStartChat={() =>
              handleStartChat({
                targetUserId: nearestSchedule.staffId,
                chatType: "staff-family",
                title: nearestSchedule.serviceName,
              })
            }
          />

          <ActionButtonByStatus
            status={nearestSchedule.status}
            onUpdate={handleUpdateStatus}
            loading={updatingStatus}
          />
        </ScrollView>

        <Footer />
      </View>

      <RatingModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        scheduleId={nearestSchedule._id}
        onSuccess={() => {
          // Optional: thông báo hoặc làm mới
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#333",
  },
  noDataText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#777",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 15,
    maxHeight: height * 0.65,
    paddingTop: 20,
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
});

export default MapScreen;
