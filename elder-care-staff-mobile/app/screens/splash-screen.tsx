import { useEffect } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";

import useAuthStore from "../../stores/authStore";

export default function SplashScreen() {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const token = useAuthStore((state) => state.token);
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    restoreSession();
  }, []);

  useEffect(() => {
    if (isHydrated) {
      const timeout = setTimeout(() => {
        if (token) {
          router.replace("/screens/tabs/home");
        } else {
          router.replace("/screens/auth/Login");
        }
      }, 3000); // hoặc giữ nguyên 5000 nếu bạn thích

      return () => clearTimeout(timeout);
    }
  }, [isHydrated]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Elder Care</Text>
      <ActivityIndicator size="large" color="#28a745" style={styles.loader} />
    </View>
  );
}

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
