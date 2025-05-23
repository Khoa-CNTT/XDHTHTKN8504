import React, { useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
  Animated,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/navigation";
import useAuthStore from "../stores/authStore";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const Footer: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { token } = useAuthStore();

  // Animated.Value cho từng icon
  const iconScales = useRef<Record<string, Animated.Value>>({}).current;
  const getIconScale = (key: string) => {
    if (!iconScales[key]) {
      iconScales[key] = new Animated.Value(1);
    }
    return iconScales[key];
  };

  const [pressedTab, setPressedTab] = useState<keyof RootStackParamList | null>(
    null
  );
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [pendingTab, setPendingTab] = useState<keyof RootStackParamList | null>(
    null
  );

  const activeTab = route.name as keyof RootStackParamList;

  const handleTabPress = (tabKey: keyof RootStackParamList) => {
    // Kiểm tra yêu cầu đăng nhập cho 3 tab
    if (
      (tabKey === "Booking" ||
        tabKey === "MyBookings" ||
        tabKey === "Profile") &&
      !token
    ) {
      setPendingTab(tabKey);
      setAlertVisible(true);
      return;
    }

    switch (tabKey) {
      case "Home":
        navigation.navigate("Home");
        break;
      case "WorkScreen":
        navigation.navigate("WorkScreen");
        break;
      case "Booking":
        navigation.navigate("Booking");
        break;
      case "MyBookings":
        navigation.navigate("MyBookings");
        break;
      case "Profile":
        navigation.navigate("Profile");
        break;
      default:
        break;
    }
  };

  const handleConfirmLogin = () => {
    setAlertVisible(false);
    navigation.navigate("Login");
  };

  const handleCancelLogin = () => {
    setAlertVisible(false);
    setPendingTab(null);
  };

  const onPressIn = (key: string) => {
    Animated.spring(getIconScale(key), {
      toValue: 1.2,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = (key: string) => {
    Animated.spring(getIconScale(key), {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  // Render từng tab thủ công
  return (
    <>
      <View style={styles.container}>
        {/* Home */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.tab,
            {
              backgroundColor:
                activeTab === "Home"
                  ? "rgba(55, 180, 78, 0.15)"
                  : "transparent",
            },
          ]}
          onPress={() => handleTabPress("Home")}
          onPressIn={() => {
            setPressedTab("Home");
            onPressIn("Home");
          }}
          onPressOut={() => {
            setPressedTab(null);
            onPressOut("Home");
          }}
        >
          <Animated.View
            style={{
              transform: [
                { scale: pressedTab === "Home" ? getIconScale("Home") : 1 },
              ],
            }}
          >
            <Ionicons
              name="home"
              size={28}
              color={activeTab === "Home" ? "#37B44E" : "#9DA3A6"}
            />
          </Animated.View>
          <Text
            style={[
              styles.label,
              { color: activeTab === "Home" ? "#37B44E" : "#9DA3A6" },
            ]}
          >
            Trang chủ
          </Text>
        </TouchableOpacity>

        {/* WorkScreen */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.tab,
            {
              backgroundColor:
                activeTab === "WorkScreen"
                  ? "rgba(55, 180, 78, 0.15)"
                  : "transparent",
            },
          ]}
          onPress={() => handleTabPress("WorkScreen")}
          onPressIn={() => {
            setPressedTab("WorkScreen");
            onPressIn("WorkScreen");
          }}
          onPressOut={() => {
            setPressedTab(null);
            onPressOut("WorkScreen");
          }}
        >
          <Animated.View
            style={{
              transform: [
                {
                  scale:
                    pressedTab === "WorkScreen"
                      ? getIconScale("WorkScreen")
                      : 1,
                },
              ],
            }}
          >
            <Ionicons
              name="location"
              size={28}
              color={activeTab === "WorkScreen" ? "#37B44E" : "#9DA3A6"}
            />
          </Animated.View>
          <Text
            style={[
              styles.label,
              { color: activeTab === "WorkScreen" ? "#37B44E" : "#9DA3A6" },
            ]}
          >
            Theo dõi
          </Text>
        </TouchableOpacity>

        {/* Booking */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.tab,
            {
              backgroundColor:
                activeTab === "Booking"
                  ? "rgba(55, 180, 78, 0.15)"
                  : "transparent",
            },
          ]}
          onPress={() => handleTabPress("Booking")}
          onPressIn={() => {
            setPressedTab("Booking");
            onPressIn("Booking");
          }}
          onPressOut={() => {
            setPressedTab(null);
            onPressOut("Booking");
          }}
        >
          <Animated.View
            style={{
              transform: [
                {
                  scale: pressedTab === "Booking" ? getIconScale("Booking") : 1,
                },
              ],
            }}
          >
            <Ionicons
              name="book"
              size={28}
              color={activeTab === "Booking" ? "#37B44E" : "#9DA3A6"}
            />
          </Animated.View>
          <Text
            style={[
              styles.label,
              { color: activeTab === "Booking" ? "#37B44E" : "#9DA3A6" },
            ]}
          >
            Đặt lịch
          </Text>
        </TouchableOpacity>

        {/* MyBookings */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.tab,
            {
              backgroundColor:
                activeTab === "MyBookings"
                  ? "rgba(55, 180, 78, 0.15)"
                  : "transparent",
            },
          ]}
          onPress={() => handleTabPress("MyBookings")}
          onPressIn={() => {
            setPressedTab("MyBookings");
            onPressIn("MyBookings");
          }}
          onPressOut={() => {
            setPressedTab(null);
            onPressOut("MyBookings");
          }}
        >
          <Animated.View
            style={{
              transform: [
                {
                  scale:
                    pressedTab === "MyBookings"
                      ? getIconScale("MyBookings")
                      : 1,
                },
              ],
            }}
          >
            <Ionicons
              name="calendar"
              size={28}
              color={activeTab === "MyBookings" ? "#37B44E" : "#9DA3A6"}
            />
          </Animated.View>
          <Text
            style={[
              styles.label,
              { color: activeTab === "MyBookings" ? "#37B44E" : "#9DA3A6" },
            ]}
          >
            Lịch sử
          </Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.tab,
            {
              backgroundColor:
                activeTab === "Profile"
                  ? "rgba(55, 180, 78, 0.15)"
                  : "transparent",
            },
          ]}
          onPress={() => handleTabPress("Profile")}
          onPressIn={() => {
            setPressedTab("Profile");
            onPressIn("Profile");
          }}
          onPressOut={() => {
            setPressedTab(null);
            onPressOut("Profile");
          }}
        >
          <Animated.View
            style={{
              transform: [
                {
                  scale: pressedTab === "Profile" ? getIconScale("Profile") : 1,
                },
              ],
            }}
          >
            <Ionicons
              name="person-circle"
              size={28}
              color={activeTab === "Profile" ? "#37B44E" : "#9DA3A6"}
            />
          </Animated.View>
          <Text
            style={[
              styles.label,
              { color: activeTab === "Profile" ? "#37B44E" : "#9DA3A6" },
            ]}
          >
            Cá nhân
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={isAlertVisible}
        onRequestClose={handleCancelLogin}
      >
        <View style={customAlertStyles.centeredView}>
          <View style={customAlertStyles.modalView}>
            <Text style={customAlertStyles.modalTitle}>Yêu cầu đăng nhập</Text>
            <Text style={customAlertStyles.modalText}>
              Bạn cần đăng nhập để sử dụng chức năng này. Đăng nhập ngay?
            </Text>
            <View style={customAlertStyles.buttonContainer}>
              <TouchableOpacity
                style={[
                  customAlertStyles.button,
                  customAlertStyles.buttonCancel,
                ]}
                onPress={handleCancelLogin}
              >
                <Text style={customAlertStyles.textStyle}>Không</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  customAlertStyles.button,
                  customAlertStyles.buttonConfirm,
                ]}
                onPress={handleConfirmLogin}
              >
                <Text style={customAlertStyles.textStyle}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E1E5EA",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 30,
    minWidth: 60,
  },
  label: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: "600",
  },
});

const customAlertStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 28,
    width: 280,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },
  modalText: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 25,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  button: {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 18,
    minWidth: 100,
    alignItems: "center",
  },
  buttonCancel: {
    backgroundColor: "#E5E5E5",
  },
  buttonConfirm: {
    backgroundColor: "#37B44E",
  },
  textStyle: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
});

export default Footer;
