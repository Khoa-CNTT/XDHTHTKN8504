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
import {
  User,
  CalendarDays,
  Clock,
  Stethoscope,
  DollarSign,
} from "lucide-react-native";
import Footer from "../components/Footer";
import { cancelBooking } from "../api/BookingService";
import { formatTime } from "../utils/dateHelper";
import { log } from "../utils/logger";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/navigation";


type NavigationProp = StackNavigationProp<RootStackParamList>;

interface DetailRowProps {
  label: string;
  value: string;
  icon: React.ReactElement;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, icon }) => (
  <View style={styles.detailRow}>
    {icon}
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const AppointmentTabs = ({
  onTabChange,
}: {
  onTabChange: (status: BookingStatus) => void;
}) => {
  const [selectedTab, setSelectedTab] = useState<BookingStatus>("accepted");

  const handleTabPress = (tab: BookingStatus) => {
    setSelectedTab(tab);
    onTabChange(tab);
  };

  return (
    <View style={styles.tabsContainer}>
      <Text style={styles.tabsTitle}>Lịch hẹn của tôi</Text>
      <View style={styles.tabs}>
        {(["accepted", "completed", "cancelled"] as BookingStatus[]).map(
          (tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => handleTabPress(tab)}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText,
                ]}
              >
                {tab === "accepted"
                  ? "Sắp tới"
                  : tab === "completed"
                  ? "Đã hoàn thành"
                  : "Đã hủy"}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
};

const MyBookings: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { fetchBookings, filteredBookings, filterByStatus } = useBookingStore();
  const [selectedStatus, setSelectedStatus] =
    useState<BookingStatus>("accepted");

  useEffect(() => {
    filterByStatus(selectedStatus);
  }, [selectedStatus]);

  const handleTabChange = (status: BookingStatus) => {
    setSelectedStatus(status);
  };

  const handleCancel = (bookingId: string) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn hủy lịch hẹn này?", [
      { text: "Không", style: "cancel" },
      {
        text: "Có",
        style: "destructive",
        onPress: async () => {
          try {
            log("booking id requset cancel: ", bookingId);
            await cancelBooking(bookingId);
            await fetchBookings();
            filterByStatus(selectedStatus);
            Alert.alert("Thành công", "Lịch hẹn đã được hủy.");
          } catch (error) {
            console.error(error);
            Alert.alert("Lỗi", "Không thể hủy lịch hẹn. Vui lòng thử lại.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <AppointmentTabs onTabChange={handleTabChange} />
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
          <Text style={styles.emptyText}>
            Vui lòng kiểm tra lại sau hoặc đặt một lịch mới!
          </Text>
          <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            navigation.navigate("BookAService");
          }}>
            <Text style={styles.backButtonText}>Đặt lịch mới</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {filteredBookings.map((booking) => (
            <View key={booking._id} style={styles.card}>
              <View style={styles.cardContent}>
                <Image
                  source={require("../asset/img/use.jpg")}
                  style={styles.image}
                />
                <View style={styles.info}>
                  <DetailRow
                    label="Nhân viên y tế:"
                    value={`${booking.profileId?.firstName || "Đang chờ"} ${
                      booking.profileId?.lastName || ""
                    }`}
                    icon={<User size={22} color="#37B44E" />}
                  />
                  <DetailRow
                    label="Dịch vụ:"
                    value={booking.serviceId?.name || "N/A"}
                    icon={<Stethoscope size={22} color="#37B44E" />}
                  />
                  {booking.repeatFrom && booking.repeatTo && (
                    <DetailRow
                      label="Ngày thực hiện:"
                      value={`${formatTime(
                        booking.repeatFrom,
                        "date"
                      )} - ${formatTime(booking.repeatTo, "date")}`}
                      icon={<CalendarDays size={22} color="#37B44E" />}
                    />
                  )}
                  {booking.timeSlot?.start && booking.timeSlot?.end && (
                    <DetailRow
                      label="Thời gian:"
                      value={`${booking.timeSlot.start} - ${booking.timeSlot.end}`}
                      icon={<Clock size={22} color="#37B44E" />}
                    />
                  )}
                  {booking.totalPrice !== undefined && (
                    <DetailRow
                      label="Tổng tiền:"
                      value={`${booking.totalPrice.toLocaleString()}đ`}
                      icon={<DollarSign size={22} color="#37B44E" />}
                    />
                  )}
                  {booking.notes && (
                    <Text style={styles.notesText}>
                      Ghi chú: {booking.notes}
                    </Text>
                  )}
                </View>
              </View>
              {(booking.status === "accepted" ||
                booking.status === "pending") && (
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancel(booking._id)}
                  >
                    <Text style={styles.buttonText}>Hủy lịch hẹn</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rescheduleButton}>
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
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  tabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#000",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  tabText: {
    color: "#9E9E9E",
    fontWeight: "500",
    fontSize: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#0F172A",
  },
  activeTabText: {
    color: "#0F172A",
    fontWeight: "700",
    fontSize: 16,
  },

  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    marginBottom: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    marginLeft: 8,
    fontWeight: "bold",
    flex: 0.4,
  },
  detailValue: {
    flex: 0.6,
  },
  notesText: {
    fontStyle: "italic",
    color: "#555",
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12, // hoặc dùng marginRight bên từng nút nếu React Native version cũ
    marginTop: 16,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: "#D32F2F", // đỏ đất hợp với màu chủ đạo
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  rescheduleButton: {
    flex: 1,
    backgroundColor: "#28A745", // màu chủ đạo
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
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
  

export default MyBookings;
