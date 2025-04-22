import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

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
          onPress={() => 
            router.push("/screens/notification/notifications")}
        />
        <Ionicons
          name="chatbubble-outline"
          size={24}
          color="black"
          onPress={() => 
            router.push("../chat")}
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
