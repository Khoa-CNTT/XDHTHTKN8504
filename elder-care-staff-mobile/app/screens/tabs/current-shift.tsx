import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import useShiftStore from "../../stores/shiftStore";

const STATUS_STEPS = [
  "Xác nhận nhận việc",
  "Đang di chuyển",
  "Đã tới nơi",
  "Đang chăm sóc",
  "Hoàn thành công việc",
  "Báo cáo công việc",
];

interface BriefcaseProps {
  shiftId: string;
}

const Briefcase: React.FC<BriefcaseProps> = ({ shiftId }) => {
  const { currentShift, fetchShift, updateStatus } = useShiftStore();

  useEffect(() => {
    fetchShift(shiftId);
  }, [shiftId]);

  if (!currentShift) return <Text style={styles.loading}>Đang tải...</Text>;

  const handleNextStatus = () => {
    const currentIndex = STATUS_STEPS.indexOf(currentShift.status);
    if (currentIndex < STATUS_STEPS.length - 1) {
      updateStatus(STATUS_STEPS[currentIndex + 1]);
    }
  };

  const handleCallCustomer = () => {
    Linking.openURL(`tel:${currentShift.customerPhone}`);
  };

  return (
    <View style={styles.container}>
      {/* Hiển thị bản đồ */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: currentShift.staffLocation.lat,
          longitude: currentShift.staffLocation.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* Vị trí nhân viên */}
        <Marker
          coordinate={{
            latitude: currentShift.staffLocation.lat,
            longitude: currentShift.staffLocation.lng,
          }}
          title="Vị trí của bạn"
          pinColor="blue"
        />

        {/* Vị trí khách hàng */}
        <Marker
          coordinate={{
            latitude: currentShift.location.lat,
            longitude: currentShift.location.lng,
          }}
          title="Khách hàng"
          pinColor="red"
        />
      </MapView>

      {/* Thông tin ca làm việc */}
      <View style={styles.infoContainer}>
        <Text style={styles.customerName}>{currentShift.customerName}</Text>
        <Text style={styles.infoText}>📍 {currentShift.address}</Text>
        <Text style={styles.infoText}>⏰ {currentShift.time}</Text>
        <Text style={styles.status}>🔄 {currentShift.status}</Text>

        {/* Button gọi và nhắn tin */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.callButton}
            onPress={handleCallCustomer}
          >
            <Text style={styles.buttonText}>📞 Gọi khách</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageButton}>
            <Text style={styles.buttonText}>💬 Nhắn tin</Text>
          </TouchableOpacity>
        </View>

        {/* Nút cập nhật trạng thái */}
        <TouchableOpacity
          style={styles.nextStatusButton}
          onPress={handleNextStatus}
        >
          <Text style={styles.buttonText}>
            ➡️{" "}
            {STATUS_STEPS[STATUS_STEPS.indexOf(currentShift.status) + 1] ||
              "Hoàn thành"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4" },
  map: { flex: 1 },
  infoContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  customerName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#28A745",
    marginBottom: 5,
  },
  infoText: { fontSize: 16, color: "#444", marginBottom: 3 },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E67E22",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  callButton: {
    flex: 1,
    backgroundColor: "#28A745",
    padding: 10,
    marginRight: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  messageButton: {
    flex: 1,
    backgroundColor: "#17A2B8",
    padding: 10,
    marginLeft: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  nextStatusButton: {
    backgroundColor: "#E67E22",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  loading: { textAlign: "center", fontSize: 18, marginTop: 20 },
});

export default Briefcase;
