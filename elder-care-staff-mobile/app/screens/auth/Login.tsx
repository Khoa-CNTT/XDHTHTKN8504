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
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

type FormData = {
  phone: string;
  password: string;
};

export default function LoginScreen() {
  const { control, handleSubmit } = useForm<FormData>();
  const router = useRouter();
  const [secureText, setSecureText] = useState(true); // Trạng thái ẩn/hiện mật khẩu

  const togglePasswordVisibility = () => {
    setSecureText(!secureText);
  };

  const onSubmit = (data: FormData) => {
    console.log("Login Data:", data);
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
        Đăng ký hay đăng nhập để sử dụng dịch vụ và quản lý hồ sơ sức khỏe của
        bạn và gia đình nhé!
      </Text>

      {/* Ô nhập số điện thoại */}
      <View style={styles.phoneContainer}>
        <TextInput style={styles.countryCode} value="+84" editable={false} />
        <Controller
          control={control}
          name="phone"
          rules={{ required: "Vui lòng nhập số điện thoại" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.phoneInput}
              placeholder="Số điện thoại của bạn"
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
      </View>

      {/* Ô nhập mật khẩu có icon ẩn/hiện */}
      <View style={styles.passwordContainer}>
        <Controller
          control={control}
          name="password"
          rules={{ required: "Vui lòng nhập mật khẩu" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.passwordInput}
              placeholder="Mật khẩu đăng nhập"
              secureTextEntry={secureText}
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
            name={secureText ? "eye-off" : "eye"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* Quên mật khẩu */}
      <TouchableOpacity
        onPress={() => router.push("/screens/auth/ForgotPassword")}
      >
        <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      {/* Nút đăng nhập */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>

      {/* Đăng ký */}
      <TouchableOpacity
        onPress={() => router.push("/screens/auth/Register")}
      >
        <Text style={styles.registerText}>
          Bạn chưa có tài khoản?{" "}
          <Text style={styles.registerLink}>Đăng ký ngay</Text>
        </Text>
      </TouchableOpacity>

      {/* Hỗ trợ */}
      <View style={styles.supportContainer}>
        <Text style={styles.supportText}>Bạn cần liên hệ hỗ trợ?</Text>
        <View style={styles.supportIcons}>
          <TouchableOpacity>
            <Ionicons name="call" size={30} color="#28a745" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome name="wechat" size={30} color="#28a745" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="mail" size={30} color="#28a745" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  logo: {
    width: 260,
    height: 100,
    alignSelf: "center",
    marginBottom: 25,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  highlight: {
    color: "#28A745",
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
    fontSize: 14,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
  },
  countryCode: {
    padding: 12,
    backgroundColor: "#ddd",
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    width: 60,
    textAlign: "center",
  },
  phoneInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    marginBottom: 12,
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPassword: {
    textAlign: "right",
    color: "#28A745",
    marginBottom: 20,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#28A745",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerText: {
    textAlign: "center",
    marginTop: 15,
    color: "#666",
    fontSize: 14,
  },
  registerLink: {
    color: "#28A745",
    fontWeight: "bold",
  },
  supportContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  supportText: {
    color: "#666",
    fontSize: 14,
  },
  supportIcons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 40,
  },
});
