import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface HeaderProps {
  onMessagePress?: () => void;
}

const HomeHeader: React.FC<HeaderProps> = ({ onMessagePress }) => {
  const router = useRouter(); // Sử dụng useRouter từ expo-router
  const notificationCount = 0;

  const handleNotificationPress = () => {
    router.push("/screens/notification/notifications"); // Sử dụng router.push thay cho navigation.navigate
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          <Text style={{ color: "#37B44E" }}>Elder</Text>
          <Text style={{ color: "#BBBFBC" }}>Care</Text>
        </Text>
      </View>
      <View style={styles.iconsContainer}>
        <TouchableOpacity
          onPress={handleNotificationPress}
          style={styles.iconContainer}
        >
          <Ionicons name="notifications-outline" size={26} color="#333" />
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={onMessagePress} style={styles.iconContainer}>
          <Ionicons name="chatbubble-outline" size={26} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#EEEEEE",
  },
  titleContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginLeft: 20,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FF4500",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: -1,
  },
});

export default HomeHeader;
