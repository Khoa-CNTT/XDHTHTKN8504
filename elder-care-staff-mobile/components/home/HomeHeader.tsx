import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Bell, MessageCircle } from "lucide-react-native"; // Import biểu tượng từ lucide-react-native
import { router } from "expo-router";

const HomeHeader = () => {
  return (
    <View style={styles.header}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
      />
      <View style={styles.headerButtons}>
        <View style={styles.icon}>
          <Bell
            size={30}
            color="#28A745"
            onPress={() => router.push("/screens/notification/notifications")}
          />
        </View>
        <View style={styles.icon}>
          <MessageCircle
            size={30}
            color="#28A745"
            onPress={() => router.push("../chat")}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "white",
    elevation: 3, // Thêm shadow cho toàn bộ header
    shadowColor: "#000", // Màu shadow
    shadowOffset: { width: 0, height: 2 }, // Độ lệch của shadow
    shadowOpacity: 0.1, // Độ mờ của shadow
    shadowRadius: 4, // Độ rộng của shadow
    borderBottomWidth: 1, // Đường viền dưới header để phân biệt với phần còn lại của giao diện
    borderBottomColor: "#ddd", // Màu của đường viền dưới
  },
  headerButtons: {
    flexDirection: "row",
    gap: 20, // Khoảng cách giữa các nút
  },
  logo: {
    width: 130,
    height: 130,
    resizeMode: "contain",
    aspectRatio: 2, // Đảm bảo logo không bị méo
  },
  icon: {
    padding: 10,
    borderRadius: 50, // Hình tròn xung quanh các biểu tượng
    backgroundColor: "#f0f0f0", // Màu nền nhạt cho các biểu tượng
    elevation: 2, // Thêm hiệu ứng shadow nhẹ cho các nút
  },
});

export default HomeHeader;
