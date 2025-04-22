import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// type BookingSuccessScreenNavigationProp = StackNavigationProp<
//   { Home: undefined },
//   "Home"
// >;

type RootStackParamList = {
    Home: undefined;
    Booking: undefined;
}
 type NavigationProp = StackNavigationProp<RootStackParamList>;

const BookingSuccessScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleBackToBooking = () => {
    navigation.navigate("Booking"); // Tên route màn hình Home
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../asset/img/hinh1.png")} // Đặt icon tick vào thư mục assets
        style={styles.icon}
      />
      <Text style={styles.title}>Booking Successful</Text>
      <Text style={styles.description}>
        We will notify the caregiver and you will receive the confirmation shortly.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleBackToBooking}>
        <Text style={styles.buttonText}>Back to Booking</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BookingSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0A2137",
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#025B8F",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
