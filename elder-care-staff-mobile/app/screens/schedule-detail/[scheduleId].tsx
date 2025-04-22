import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, StyleSheet, Button } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; // Lấy search params và useRouter để back
import usePatientStore from "../../stores/scheduleDetailStore"; // Store bạn tạo

export default function JobDetailScreen() {
  const { scheduleId } = useLocalSearchParams(); // Truy xuất scheduleId từ search params
  const { patientProfile, fetchPatientProfile } = usePatientStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Kiểm tra nếu patientProfile đã có trong store, không cần gọi lại API
  useEffect(() => {
    if (!scheduleId) {
      console.error("scheduleId không tồn tại");
      return;
    }

    if (!patientProfile) {
      const fetchData = async () => {
        setLoading(true);
        await fetchPatientProfile(scheduleId as string); // Lưu ý kiểu dữ liệu scheduleId là string
        setLoading(false);
      };
      fetchData();
    } else {
      setLoading(false); // Nếu đã có dữ liệu từ store thì không cần load lại
    }
  }, [scheduleId, patientProfile, fetchPatientProfile]);

  // Nếu đang loading, hiển thị loading spinner
  if (loading) {
    return <Text>Đang tải...</Text>;
  }

  // Nếu không có thông tin bệnh nhân
  if (!patientProfile) {
    return <Text>Không tìm thấy thông tin bệnh nhân.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chi tiết công việc</Text>
      <Text style={styles.sectionTitle}>Thông tin bệnh nhân</Text>
      <Text>
        Họ và tên: {patientProfile.firstName} {patientProfile.lastName}
      </Text>
      <Text>Địa chỉ: {patientProfile.address}</Text>
      <Text style={styles.sectionTitle}>Liên hệ khẩn cấp</Text>
      <Text>Tên: {patientProfile.emergencyContact.name}</Text>
      <Text>Số điện thoại: {patientProfile.emergencyContact.phone}</Text>
      <Text style={styles.sectionTitle}>Các vấn đề sức khỏe</Text>
      {patientProfile.healthConditions.map((condition, index) => (
        <Text key={index}>
          {condition.condition}: {condition.notes}
        </Text>
      ))}
      <Button title="Quay lại" onPress={() => router.back()} />{" "}
      {/* Quay lại màn hình trước */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
  },
});
