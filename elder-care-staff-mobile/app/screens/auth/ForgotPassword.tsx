import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

const ForgotPassword = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleContinue = () => {
    // Xử lý logic khi nhấn nút Tiếp tục
    console.log("Phone Number:", phoneNumber);
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../../assets/images/logo.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Quên mật khẩu</Text>
      <Text style={styles.subtitle}>
        Vui lòng nhập số điện thoại của bạn để đặt lại mật khẩu mới
      </Text>

      {/* Input số điện thoại */}
      <View style={styles.inputContainer}>
        <Text style={styles.prefix}>+84</Text>
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại của bạn"
          keyboardType="phone-pad"
          onChangeText={(text) => setPhoneNumber(text)}
        />
      </View>

      {/* Nút Tiếp tục */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleContinue}
        disabled={!phoneNumber}
      >
        <Text style={styles.buttonText}>Tiếp tục</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
  },
  logo: {
    width: 260,
    height: 100,
    marginBottom: 20,
 // Màu logo
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#28A745",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 20,
  },
  prefix: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#28A745",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default ForgotPassword;
