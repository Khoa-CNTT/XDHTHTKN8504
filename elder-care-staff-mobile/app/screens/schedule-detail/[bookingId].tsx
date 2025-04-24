import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { formatTime } from "../../../utils/dateHelper";
import useBookingStore from "../../../stores/BookingStore";
import { ActivityIndicator } from "react-native-paper";
import { Button } from "react-native-paper";

import {
  CalendarDays,
  Clock,
  ClipboardList,
  User,
  CheckCircle,
  DollarSign,
} from "lucide-react-native";
import { MotiView } from "moti";

const LabeledText = ({ label, value }: { label: string; value: string }) => (
  <Text style={styles.text}>
    <Text style={styles.bold}>{label}: </Text>
    {value}
  </Text>
);

const AnimatedCard = ({
  icon,
  title,
  children,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) => (
  <MotiView
    from={{ opacity: 0, translateY: 20 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ type: "timing", duration: 500, delay }}
    style={styles.card}
  >
    {icon}
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  </MotiView>
);

const BookingDetailScreen = () => {
  const { bookingId } = useLocalSearchParams();
  const { booking, loading, fetchBooking } = useBookingStore();

  useEffect(() => {
    if (!booking && typeof bookingId === "string") {
      fetchBooking(bookingId);
    }
  }, [booking, bookingId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#28A745" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>
          Không tìm thấy thông tin lịch hẹn.
        </Text>
      </View>
    );
  }

  const {
    timeSlot,
    totalDiscount,
    profileId,
    serviceId,
    status,
    notes,
    repeatFrom,
    repeatTo,
  } = booking;
  console.log("Booking details:", booking);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chi tiết lịch hẹn</Text>

      <AnimatedCard
        icon={<Clock color="#28A745" size={24} />}
        title="Thông tin công việc"
        delay={100}
      >
        <LabeledText label="Dịch vụ" value={serviceId.name} />
        <LabeledText
          label="Ca"
          value={`${timeSlot.startTime} - ${timeSlot.endTime}`}
        />
        <LabeledText
          label="Ngày"
          value={`${formatTime(repeatFrom, "date")} - ${formatTime(
            repeatTo,
            "date"
          )}`}
        />
      </AnimatedCard>

      <AnimatedCard
        icon={<User color="#28A745" size={24} />}
        title="Thông tin khách hàng"
        delay={200}
      >
        <LabeledText
          label="Họ tên"
          value={`${profileId.firstName} ${profileId.lastName}`}
        />
        <LabeledText label="Địa chỉ" value={profileId.address} />
      </AnimatedCard>

      <AnimatedCard
        icon={<ClipboardList color="#28A745" size={24} />}
        title="Lưu ý & Sức khỏe"
        delay={300}
      >
        <LabeledText label="Ghi chú" value={notes} />
        <LabeledText
          label="Sức khỏe"
          value={profileId.healthConditions
            .map((h) => `${h.condition} - ${h.notes}`)
            .join(", ")}
        />
        <LabeledText
          label="Liên hệ khẩn"
          value={`${profileId.emergencyContact.name} (${profileId.emergencyContact.phone})`}
        />
      </AnimatedCard>

      <AnimatedCard
        icon={<DollarSign color="#28A745" size={24} />}
        title="Thu nhập"
        delay={400}
      >
        <LabeledText label="Tổng tiền" value={`${totalDiscount} VND`} />
      </AnimatedCard>

      <AnimatedCard
        icon={<CheckCircle color="#28A745" size={24} />}
        title="Trạng thái"
        delay={500}
      >
        <LabeledText label="Tình trạng" value={status} />
      </AnimatedCard>

      <Button
        mode="contained"
        onPress={() => {
          router.back();
        }}
        style={{
          marginTop: 24,
          width: "80%",
          alignSelf: "center",
          backgroundColor: "#28A745",
        }}
        labelStyle={{
          color: "white",
          fontWeight: "bold",
        }}
      >
        Quay lại
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#ffffff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#28A745",
    textAlign: "center",
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
    color: "#666",
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "#f2fdf4",
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize:20,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#28A745",
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },
});

export default BookingDetailScreen;
