// src/screens/SplashScreen.tsx
import React from "react";
import { View, ActivityIndicator, StyleSheet, Image, Text } from "react-native";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../asset/img/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Elder Care</Text>
      <ActivityIndicator size="large" color="#28a745" style={styles.loader} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 5,
  },
  title: {
    fontSize: 40,
    color: "#28a745",
    fontWeight: "bold",
    marginBottom: 10,
  },
  loader: {
    marginTop: 20,
  },
});
