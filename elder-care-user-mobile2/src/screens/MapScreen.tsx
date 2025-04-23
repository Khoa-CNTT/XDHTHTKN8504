import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import MapView from "react-native-maps";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import Footer from "../components/Footer";

const MapScreen = () => {
  return (
    <View style={styles.container}>
      {/* Bản đồ */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 31.2001,
          longitude: 29.9187,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      />

      {/* Nội dung phía trên */}
      <View style={styles.overlay}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Nút chỉ đường */}
          <TouchableOpacity style={styles.showWayBtn}>
            <Icon name="navigate-outline" size={18} color="#000" />
            <Text style={styles.showWayText}>Show The Way</Text>
          </TouchableOpacity>

          {/* Thông tin người dùng */}
          <View style={styles.userInfo}>
            <Image
              source={{ uri: "https://via.placeholder.com/40" }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.userName}>Mahmoud Atef</Text>
              <Text style={styles.travelInfo}>26 min • 16.3 km</Text>
            </View>
          </View>

          {/* Thông tin thanh toán */}
          <View style={styles.paymentRow}>
            <Text style={styles.paymentType}>Cash</Text>
            <Text style={styles.paymentAmount}>120 EGP</Text>
          </View>

          {/* Nút gọi và trò chuyện */}
          <View style={styles.buttonRow}>
            <Button
              mode="outlined"
              icon="phone"
              style={styles.actionButton}
              onPress={() => {}}
            >
              Call
            </Button>
            <Button
              mode="outlined"
              icon="chat"
              style={styles.actionButton}
              onPress={() => {}}
            >
              Chat
            </Button>
          </View>

          {/* Nút đã đến nơi */}
          <Button
            mode="contained"
            style={styles.arrivedButton}
            labelStyle={styles.arrivedButtonText}
          >
            I have arrived
          </Button>
        </ScrollView>
      </View>

      {/* Footer cố định */}
      <Footer />
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 100, // 👈 Thêm padding để tránh bị chồng nút
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    maxHeight: "60%", // Giới hạn chiều cao nếu nội dung dài
  },
  showWayBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  showWayText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  travelInfo: {
    fontSize: 14,
    color: "#666",
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  paymentType: {
    fontSize: 16,
    fontWeight: "600",
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  actionButton: {
    flex: 0.48,
    borderRadius: 10,
    borderColor: "#ccc",
  },
  arrivedButton: {
    backgroundColor: "#38B2AC",
    paddingVertical: 10,
    borderRadius: 14,
    elevation: 3,
  },
  arrivedButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
