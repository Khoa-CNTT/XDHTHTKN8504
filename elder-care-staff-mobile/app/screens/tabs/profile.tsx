import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import useAuthStore from "@/stores/authStore";
import ConfirmLogoutModal from "../../../components/ConfirmLogoutModal";
import { useSocketStore } from "@/stores/socketStore";

interface MenuItem {
  id: string;
  icon: string;
  title: string;
}

const menuItems: MenuItem[] = [
  {
    id: "1",
    icon: "person-outline",
    title: "Thay đổi mật khẩu",
  },
  {
    id: "2",
    icon: "heart-outline",
    title: "Thu nhập",
  },
  {
    id: "3",
    icon: "notifications-outline",
    title: "Thông báo",
  },
  {
    id: "4",
    icon: "settings-outline",
    title: "Cài đặt",
  },
  {
    id: "5",
    icon: "help-circle-outline",
    title: "Hỗ trợ khách hàng",
  },
  {
    id: "6",
    icon: "document-text-outline",
    title: "Điều khoản sử dụng",
  },
  { id: "7", icon: "log-out-outline", title: "Đăng xuất" },
];

export default function Profile() {
  const [showLogout, setShowLogout] = useState(false);
  const userData = useAuthStore((state) => state.user);
  const extraInfo = useAuthStore((state) => state.extraInfo);
  const logout = useAuthStore((state) => state.logout);
  const disconnectSocket = useSocketStore((state) => state.disconnect);

  const handleMenuPress = useCallback((item: MenuItem) => {
    switch (item.title) {
      case "Thay đổi mật khẩu":
        router.push("/screens/auth/ChangePassword");
        break;
      case "Thu nhập":
        router.push("/screens/income-screen");
        break;
      case "Thông báo":
        router.push("/screens/notification/notifications");
        break;
      case "Cài đặt":
        router.push("/screens/Test");
        break;
      case "Hỗ trợ khách hàng":
        
        break;
      case "Điều khoản sử dụng":
        // router.push("/screens/terms-screen");
        break;
      case "Đăng xuất":
        setShowLogout(true);
        break;
      default:
        break;
    }
  }, []);

  const handleLogout = async () => {
    try {
      logout();
      disconnectSocket();
      setShowLogout(false);
      router.replace("/screens/auth/Login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={33} color="#000" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Dịch vụ</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Ionicons name="person-circle-outline" size={33} color="#000" />
              </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.profileSection}>
        <Image
          source={
            userData?.avatar
              ? { uri: userData.avatar }
              : require("../../../assets/images/avatar.jpg")
          }
          style={styles.avatar}
        />
        <Text style={styles.name}>{`${extraInfo?.firstName} ${extraInfo?.lastName}` || "unknow"}</Text>
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
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    marginBottom: 20
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#000",
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
