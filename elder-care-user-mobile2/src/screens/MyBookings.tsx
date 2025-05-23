import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useBookingStore } from "../stores/BookingStore";
import { BookingStatus } from "../types/BookingStatus";
import { User, CalendarDays, Clock, DollarSign } from "lucide-react-native";
import Footer from "../components/Footer";
import { cancelBooking } from "../api/BookingService";
import { formatTime } from "../utils/dateHelper";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../navigation/navigation";
import { log } from "../utils/logger";
import useAuthStore from "../stores/authStore"; // Import useAuthStore

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface DetailRowProps {
  icon: React.ReactElement;
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    {icon}
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const Tabs = ({
  selected,
  onChange,
}: {
  selected: BookingStatus;
  onChange: (status: BookingStatus) => void;
}) => {
  const tabs: { key: BookingStatus; label: string }[] = [
    { key: "accepted", label: "Sắp tới" },
    { key: "completed", label: "Đã hoàn thành" },
    { key: "cancelled", label: "Đã hủy" },
  ];

  return (
    <View style={styles.tabsContainer}>
      <Text style={styles.tabsTitle}>Lịch hẹn của tôi</Text>
      <View style={styles.tabs}>
        {tabs.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, selected === key && styles.tabActive]}
            onPress={() => onChange(key)}
          >
            <Text
              style={[styles.tabText, selected === key && styles.tabTextActive]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const MyBookings = () => {
  const navigation = useNavigation<NavigationProp>();

  const { filteredBookings, filterByStatus } = useBookingStore();
  
  const { token } = useAuthStore(); // Get the authentication token from the store


  const [selectedStatus, setSelectedStatus] =
    useState<BookingStatus>("accepted");
  
  useEffect(() => {
    filterByStatus(selectedStatus);
  }, [selectedStatus]);

  const onTabChange = (status: BookingStatus) => setSelectedStatus(status);

  const onCancelBooking = (id: string) => {
    Alert.alert("Xác nhận hủy", "Bạn có chắc chắn muốn hủy lịch hẹn này?", [
      { text: "Không", style: "cancel" },
      {
        text: "Có",
        style: "destructive",
        onPress: async () => {
          try {
            await cancelBooking(id);
            filterByStatus(selectedStatus);
            Alert.alert("Thành công", "Lịch hẹn đã được hủy.");
          } catch {
            Alert.alert("Lỗi", "Không thể hủy lịch hẹn. Vui lòng thử lại.");
          }
        },
      },
    ]);
  };

  // New handler for "Đặt lịch mới" button
  const handleBookNewService = () => {
    if (token) {
      // If user is logged in (token exists), navigate to BookAService
      navigation.navigate("BookAService");
    } else {
      // If user is not logged in, navigate to LoginScreen
      navigation.navigate("Login");
    }
  };

  return (
    <View style={styles.container}>
      <Tabs selected={selectedStatus} onChange={onTabChange} />
      {filteredBookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../asset/img/empty_schedule.png")}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyTitle}>
            Không có lịch nào đang thực hiện hoặc đang chờ!
          </Text>
          <Text style={styles.emptySub}>
            Vui lòng kiểm tra lại sau hoặc đặt lịch mới.
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={handleBookNewService} // Use the new handler here
          >
            <Text style={styles.emptyButtonText}>Đặt lịch mới</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {filteredBookings.map((b) => (
            
            <View key={b._id} style={styles.card}>
              <View style={styles.cardRow}>
                <Image
                  source={
                    b.participants[0]?.userId.avatar
                      ? { uri: b.participants[0]?.userId.avatar }
                      : require("../asset/img/unknownAvatar.png")
                  }
                  style={styles.avatar}
                />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>
                    {b.serviceId?.name || "Dịch vụ"}
                  </Text>
                  <DetailRow
                    icon={<User size={20} color="#37B44E" />}
                    label="Nhân viên:"
                    value={b.participants[0]?.fullName || "Chờ nhân viên"}
                  />
                  {b.repeatFrom && b.repeatTo && (
                    <DetailRow
                      icon={<CalendarDays size={20} color="#37B44E" />}
                      label="Ngày thực hiện:"
                      value={`${formatTime(
                        b.repeatFrom,
                        "date"
                      )} - ${formatTime(b.repeatTo, "date")}`}
                    />
                  )}
                  {b.timeSlot?.start && b.timeSlot?.end && (
                    <DetailRow
                      icon={<Clock size={20} color="#37B44E" />}
                      label="Thời gian:"
                      value={`${b.timeSlot.start} - ${b.timeSlot.end}`}
                    />
                  )}
                  {b.totalPrice !== undefined && (
                    <DetailRow
                      icon={<DollarSign size={20} color="#37B44E" />}
                      label="Tổng tiền:"
                      value={`${b.totalPrice.toLocaleString()}đ`}
                    />
                  )}
                  {b.notes && (
                    <Text style={styles.notes}>Ghi chú: {b.notes}</Text>
                  )}
                </View>
              </View>
              {(b.status === "accepted" || b.status === "pending") && (
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => onCancelBooking(b._id)}
                  >
                    <Text style={styles.buttonText}>Hủy lịch</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.detailButton,
                      b.participants.length === 0 && { opacity: 0.5 },
                    ]}
                    disabled={b.participants.length === 0}

                    onPress={() =>
                    {
                     const participantId = b.participants[0]?.userId._id;


                      if (participantId) {
                        navigation.navigate("DoctorDetails", {
                          participantId,
                        });
                      } else {
                        console.warn("Không có participantId để điều hướng.");
                        console.log(b);
                      }
                    }}
                  >
                    <Text style={styles.buttonText}>Xem nhân viên</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tabsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 10,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tab: {
    paddingVertical: 8,
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: "#0F172A",
  },
  tabText: {
    color: "#9E9E9E",
    fontWeight: "600",
    fontSize: 16,
  },
  tabTextActive: {
    color: "#0F172A",
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  cardRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 14,
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  detailLabel: {
    marginLeft: 8,
    fontWeight: "600",
    color: "#37B44E",
    fontSize: 14,
    width: 110,
    flexShrink: 0,
  },
  detailValue: {
    flex: 1,
    color: "#1F2937",
    fontWeight: "700",
    fontSize: 15,
  },
  notes: {
    marginTop: 6,
    fontSize: 14,
    fontStyle: "italic",
    color: "#374151",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 6,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#EF4444",
  },
  detailButton: {
    backgroundColor: "#0F172A",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 25,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySub: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 18,
    textAlign: "center",
  },
  emptyButton: {
    backgroundColor: "#0F172A",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default MyBookings;