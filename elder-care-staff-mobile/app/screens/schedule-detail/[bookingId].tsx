// screens/BookingDetailScreen.tsx

import React, { useEffect } from "react";
import { View, ScrollView, StyleSheet, Linking } from "react-native";
import { Text, Card, Divider, ActivityIndicator } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Sử dụng MaterialCommunityIcons
import useBookingStore from "../../stores/BookingStore"; // Import store Zustand
import { Booking } from "@/types/Booking";
import { useLocalSearchParams } from "expo-router";



const BookingDetailScreen = () => {
   const { bookingId } = useLocalSearchParams();
  const { booking, loading, error, fetchBooking } = useBookingStore(); 


  useEffect(() => {
    if (!booking) {
      if (typeof bookingId === "string") {
        fetchBooking(bookingId);
      }
    }
  }, [booking, bookingId, fetchBooking]);

  // Nếu đang tải dữ liệu, hiển thị loading indicator
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={true} size="large" color="#28A745" />
        <Text>Đang tải thông tin...</Text>
      </View>
    );
  }

  // Nếu có lỗi khi lấy dữ liệu
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Lỗi: {error}</Text>
      </View>
    );
  }

  // Nếu không có dữ liệu booking
  if (!booking) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Thông tin đặt lịch không có sẵn.</Text>
      </View>
    );
  }

  const profile = booking.profileId;
  const service = booking.serviceId;

  // Hàm gọi điện thoại
  const handleCall = (phone: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  // Hàm render tình trạng sức khỏe
  const renderHealthConditions = () => {
    return profile?.healthConditions?.map((cond, idx) => (
      <View key={idx} style={{ marginBottom: 6 }}>
        <Text style={styles.text}>- {cond.condition}</Text>
        {cond.notes && (
          <Text style={[styles.text, styles.note]}>Ghi chú: {cond.notes}</Text>
        )}
      </View>
    ));
  };

  // Hàm render liên hệ khẩn cấp
  const renderEmergencyContact = () => {
    const emergencyContact = profile?.emergencyContact;
    if (emergencyContact) {
      return (
        <>
          <Text style={styles.text}>- Họ tên: {emergencyContact.name}</Text>
          <Text style={styles.text}>
            - SĐT:
            <Text
              style={styles.linkText}
              onPress={() => handleCall(emergencyContact.phone)}
            >
              {emergencyContact.phone}
            </Text>
          </Text>
        </>
      );
    }
    return null;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Lịch làm việc</Text>
      {/* 1. Thông tin đặt lịch */}
      <Card style={styles.card}>
        <Card.Title
          title="🗓️ Thông tin đặt lịch"
          left={() => <Icon name="calendar" size={24} color="#28A745" />} // Sử dụng MaterialCommunityIcons
        />
        <Card.Content>
          <Text style={styles.text}>
            Dịch vụ: {service?.name || "Không có"}
          </Text>
          <Text style={styles.text}>
            Thời gian: {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
          </Text>
          <Text style={styles.text}>Trạng thái: {booking.status}</Text>
          <Text style={styles.text}>
            Giá: {service?.price?.toLocaleString()} VND
          </Text>
          <Text style={styles.text}>
            Lặp lại: {booking.isRecurring ? "Có" : "Không"}
          </Text>
        </Card.Content>
      </Card>

      {/* 2. Tình trạng sức khỏe */}
      <Card style={styles.card}>
        <Card.Title
          title="❤️ Tình trạng sức khỏe"
          left={() => <Icon name="heart" size={24} color="#28A745" />} // Thay đổi icon
        />
        <Card.Content>
          <Text style={styles.text}>
            Khách hàng: {profile.firstName} {profile.lastName} (
            {profile.relationship})
          </Text>
          <Text style={styles.text}>Địa chỉ: {profile.address}</Text>
          <Divider style={{ marginVertical: 8 }} />
          {renderHealthConditions()}
        </Card.Content>
      </Card>

      {/* 3. Lưu ý & liên hệ khẩn cấp */}
      <Card style={styles.card}>
        <Card.Title
          title="📌 Lưu ý & Liên hệ khẩn cấp"
          left={() => <Icon name="information" size={24} color="#28A745" />} // Thay đổi icon
        />
        <Card.Content>
          <Text style={styles.text}>Lưu ý: {booking.notes || "Không có"}</Text>
          <Divider style={{ marginVertical: 8 }} />
          <Text style={styles.text}>Liên hệ khẩn cấp:</Text>
          {renderEmergencyContact()}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f8fa",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#28A745",
    textAlign: "center",
    marginBottom: 15,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
  note: {
    fontStyle: "italic",
    color: "#555",
  },
  linkText: {
    color: "#28A745",
    textDecorationLine: "underline",
  },
});

export default BookingDetailScreen;
