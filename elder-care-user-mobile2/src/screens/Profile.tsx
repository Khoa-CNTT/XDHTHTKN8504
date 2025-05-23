import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Pressable,

  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Footer from "../components/Footer";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import useAuthStore from "../stores/authStore";
import * as ImagePicker from "expo-image-picker";
import { uploadAvatar } from "../api/uploadService";
import { RootStackParamList } from "../navigation/navigation";
import RatingModal from "../components/RatingModal";


type NavigationProp = StackNavigationProp<RootStackParamList>;

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const menuItems: MenuItem[] = [
  { id: "payment", title: "Ví điện tử", icon: "chevron-forward" },
  { id: "notifications", title: "Thông báo", icon: "chevron-forward" },
  { id: "profile", title: "Danh sách Hồ sơ", icon: "chevron-forward" },
  { id: "help", title: "Trợ giúp và Hỗ trợ", icon: "chevron-forward" },
  { id: "terms", title: "Điều khoản và Điều kiện", icon: "chevron-forward" },
  { id: "logout", title: "Đăng xuất", icon: "chevron-forward" },
  // {id: "test", title: "Test", icon: "chevron-forward"}
];

const Profile: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout, updateUser } = useAuthStore();

  const [avatarSource, setAvatarSource] = useState<
    string | ReturnType<typeof require> | null
  >(user?.avatarUrl || require("../asset/img/hinh1.png"));
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);


  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Bạn cần cấp quyền truy cập thư viện ảnh!");
      }
      if (user?.avatarUrl) {
        setAvatarSource(user.avatarUrl);
      }
    })();
  }, [user?.avatarUrl]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatarSource(uri);
      try {
        const uploadedUrl = await uploadAvatar(uri);
        if (uploadedUrl) {
          updateUser({ ...user, avatarUrl: uploadedUrl });
        } else {
          alert("Lỗi khi tải ảnh lên.");
        }
      } catch {
        alert("Lỗi khi tải ảnh lên.");
      }
    }
  };

  const handleMenuPress = (id: string) => {

    switch (id) {
      case "logout":
        setShowLogoutModal(true);
        break;
      case "terms":
        setShowTermsModal(true);
        break;
      case "payment":
        navigation.navigate("PaymentInfoScreen");
        break;
      case "notifications":
        navigation.navigate("Notifications");
        break;
      case "profile":
        navigation.navigate("ProfileList");
        break;
      case "help":
        navigation.navigate("BookAService");
        break;
      // case "test":
      //   navigation.navigate("DoctorDetails")
      //   break;
      default:
        break;

    }
  };

const handleLogoutConfirm = async () => {
  try {
    await logout();
    setShowLogoutModal(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
    alert("Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.");
  }
};

  const renderIcon = (id: string) => {
    switch (id) {
      case "payment":
        return <Ionicons name="wallet-outline" size={20} color="#000" />;
      case "notifications":
        return <Ionicons name="notifications-outline" size={20} color="#000" />;
      case "profile":
        return <Ionicons name="person-circle-outline" size={20} color="#000" />;
      case "help":
        return <Ionicons name="help-circle-outline" size={20} color="#000" />;

      case "terms":
        return <Ionicons name="document-text-outline" size={20} color="#000" />;
      case "logout":
        return <Ionicons name="log-out-outline" size={20} color="#000" />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Trang cá nhân</Text>

        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
            <Image
              source={
                typeof avatarSource === "string"
                  ? { uri: avatarSource }
                  : avatarSource
              }
              style={styles.avatar}
            />
            <View style={styles.editIconContainer}>
              <Ionicons name="create" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{user?.phone || "+84"}</Text>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index !== menuItems.length - 1 && styles.menuItemBorder,
              ]}
              onPress={() => handleMenuPress(item.id)}
            >
              <View style={styles.menuItemLeft}>
                {renderIcon(item.id)}
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name={item.icon} size={20} color="#000" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Footer />

      {/* Modal Đăng xuất */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đăng xuất</Text>
            <Text style={styles.modalText}>
              Bạn có chắc chắn muốn đăng xuất?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.buttonText}>Hủy</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonLogout]}
                onPress={handleLogoutConfirm}
              >
                <Text style={[styles.buttonText, styles.buttonLogoutText]}>
                  Đồng ý
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Điều khoản và Điều kiện */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTermsModal}
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: "80%" }]}>
            <Text style={styles.modalTitle}>Điều khoản và Điều kiện</Text>
            <ScrollView style={{ marginVertical: 16 }}>
              <Text style={styles.modalText}>
                Đây là nội dung điều khoản và điều kiện sử dụng ứng dụng.
                {"\n\n"}1. Điều khoản 1...
                {"\n\n"}2. Điều khoản 2...
                {"\n\n"}3. Điều khoản 3...
                {"\n\n"}Bạn có thể thêm nội dung dài hơn tại đây.
              </Text>
            </ScrollView>
            <Pressable
              style={[styles.button, styles.buttonLogout]}
              onPress={() => setShowTermsModal(false)}
            >
              <Text style={[styles.buttonText, styles.buttonLogoutText]}>
                Đóng
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 30,
    color: "#000",
  },
  profileSection: { alignItems: "center", marginBottom: 32 },
  avatarContainer: { position: "relative", marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#000",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: { fontSize: 18, fontWeight: "600", color: "#000", marginBottom: 8 },
  menuContainer: { paddingHorizontal: 16 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: "#F7F9FC" },
  menuItemLeft: { flexDirection: "row", alignItems: "center" },
  menuItemText: { fontSize: 16, color: "#2E3A59", marginLeft: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "600", color: "#2E3A59" },
  modalText: { fontSize: 16, color: "#000", textAlign: "left" },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  buttonCancel: { backgroundColor: "#F7F9FC" },
  buttonLogout: { backgroundColor: "#FF4B4B" },
  buttonText: { fontSize: 16, fontWeight: "600", color: "#2E3A59" },
  buttonLogoutText: { color: "white" },
});

export default Profile;
