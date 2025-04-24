import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import ConfirmLogoutModal from "../../../components/ConfirmLogoutModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import useAuthStore from "@/stores/authStore";



const menuItems = [
  { id: "1", icon: "person-outline", title: "Thay đổi mật khẩu" },
  { id: "2", icon: "heart-outline", title: "Thu nhập" },
  { id: "3", icon: "notifications-outline", title: "Thông báo" },
  { id: "4", icon: "settings-outline", title: "Cài đặt" },
  { id: "5", icon: "help-circle-outline", title: "Hộ trợ khách hàng" },
  { id: "6", icon: "document-text-outline", title: "Điều khoản sử dụng" },
  { id: "7", icon: "log-out-outline", title: "Đăng xuất" },
];

export default function Profile() {
  const [showLogout, setShowLogout] = useState(false);
  const userData = useAuthStore((state) => state.user);
  const handleMenuPress = (item: any) => {
    if (item.title === "Log Out") {
      setShowLogout(true);
    } else {
      router.push("/screens/income-screen");
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("userInfo");

      setShowLogout(false);
      router.replace("/screens/auth/Login"); // Điều hướng về màn hình login
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hồ sơ</Text>

      {/* Avatar */}
      <View style={styles.profileSection}>
        <Image
          source={
            userData?.avatarUrl
              ? { uri: userData.avatarUrl }
              : require("../../../assets/images/avatar.jpg")
          }
          style={styles.avatar}
        />
        <Text style={styles.name}>{userData?.name || "unknow"}</Text>
        <Text style={styles.phone}>{userData?.phone || "Unknow"}</Text>
      </View>

      {/* Menu List */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuPress(item)}
          >
            <Ionicons name={item.icon as any} size={20} color="#333" />
            <Text style={styles.menuText}>{item.title}</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
          </TouchableOpacity>
        )}
      />

      <ConfirmLogoutModal
        visible={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#28A745",
  },

  profileSection: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  name: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  phone: { fontSize: 14, color: "gray", marginTop: 5 },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: { flex: 1, fontSize: 16, marginLeft: 10 },
});
