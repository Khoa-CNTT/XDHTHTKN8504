import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

type FormData = {
  phone: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const { control, handleSubmit } = useForm<FormData>();
  const router = useRouter();
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

  const togglePasswordVisibility = () => setSecurePassword(!securePassword);
  const toggleConfirmPasswordVisibility = () =>
    setSecureConfirmPassword(!secureConfirmPassword);

  const onSubmit = (data: FormData) => {
    console.log("Register Data:", data);
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../../assets/images/logo.png")}
        style={styles.logo}
      />

      {/* Tiêu đề */}
      <Text style={styles.title}>
        Chào mừng đến với <Text style={styles.highlight}>ElderCare</Text>
      </Text>
      <Text style={styles.subtitle}>
        Vui lòng nhập số điện thoại của bạn để đăng ký tài khoản
      </Text>

      {/* Số điện thoại (cố định +84) */}
      <View style={styles.inputContainer}>
        <Text style={styles.prefix}>+84</Text>
        <Controller
          control={control}
          name="phone"
          rules={{
            required: "Vui lòng nhập số điện thoại",
            pattern: {
              value: /^[0-9]{9,10}$/,
              message: "Số điện thoại không hợp lệ",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.inputText}
              placeholder="Nhập số điện thoại"
              keyboardType="number-pad"
              value={value}
              onChangeText={onChange}
              maxLength={10} // Giới hạn số ký tự cho số điện thoại (không tính +84)
            />
          )}
        />
      </View>

      {/* Mật khẩu */}
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="password"
          rules={{ required: "Vui lòng nhập mật khẩu" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.inputText}
              placeholder="Nhập mật khẩu (6 ký tự số)"
              secureTextEntry={securePassword}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={securePassword ? "eye-off" : "eye"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* Xác nhận mật khẩu */}
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="confirmPassword"
          rules={{ required: "Vui lòng nhập lại mật khẩu" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.inputText}
              placeholder="Nhập lại mật khẩu"
              secureTextEntry={secureConfirmPassword}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        <TouchableOpacity
          onPress={toggleConfirmPasswordVisibility}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={secureConfirmPassword ? "eye-off" : "eye"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* Nút đăng ký */}
      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.registerButtonText}>Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  highlight: {
    color: "#28A745",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  prefix: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    paddingRight: 10,
  },
  inputText: {
    flex: 1,
    paddingVertical: 12,
  },
  eyeIcon: {
    padding: 10,
  },
  registerButton: {
    backgroundColor: "#28A745",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logo: {
    width: 260,
    height: 100,
    alignSelf: "center",
    marginBottom: 25,
    resizeMode: "contain",
  }
});
