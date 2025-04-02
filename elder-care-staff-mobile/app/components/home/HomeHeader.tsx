import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HomeHeader = () => {
  return (
    <View style={styles.header}>
      <Image
        source={require("../../../assets/images/logo.png")}
        style={styles.logo}
      />
      <View style={styles.headerButtons}>
        <Ionicons
          name="notifications-outline"
          size={24}
          color="black"
          onPress={() => alert("Xem thông báo")}
        />
        <Ionicons
          name="chatbubble-outline"
          size={24}
          color="black"
          onPress={() => alert("Nhắn tin")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 20,
  },
  logo: {
    width: 160,
    height: 80,
    resizeMode: "stretch",
  },
});

export default HomeHeader;
