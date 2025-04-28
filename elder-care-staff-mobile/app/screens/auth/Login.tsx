import loginApi from "../../../api/authApi"; // Đã dùng API riêng
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
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
import useAuthStore from "../../../stores/authStore"; 

type FormData = {
  phone: string;
  password: string;
};

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();
  const [secureText, setSecureText] = useState(true);

  const togglePasswordVisibility = () => setSecureText(!secureText);
  const setSession = useAuthStore((state) => state.setSession);

  const onSubmit = async (data: FormData) => {
    try {
      const { token, user, extraInfo } = await loginApi(data.phone, data.password);

      console.log("Login successful:", user);


      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("extraInfo", JSON.stringify(extraInfo)); // Lưu extraInfo

      setSession(user, token, extraInfo);
      router.replace("/screens/tabs/home");
    } catch (error: any) {
      console.log("Login error:", error);
      Alert.alert(
        "Lỗi đăng nhập",
        error?.response?.data?.message || "Đã xảy ra lỗi"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>
        Chào mừng đến với <Text style={styles.highlight}>ElderCare</Text>
      </Text>
      <Text style={styles.subtitle}>
        Đăng nhập để sử dụng dịch vụ của chúng tôi!
      </Text>

      <View style={styles.phoneContainer}>
        <TextInput style={styles.countryCode} value="+84" editable={false} />
        <Controller
          control={control}
          name="phone"
          rules={{
            required: "Vui lòng nhập số điện thoại",
            pattern: {
              value:
                /^(?:\+84|0)(?:3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/,
              message: "Số điện thoại không hợp lệ",
            },
          }}
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
      {errors.phone && (
        <Text style={styles.errorText}>{errors.phone.message}</Text>
      )}

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
      {errors.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>

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
  highlight: { color: "#28A745", fontWeight: "bold" },
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
    marginBottom: 4,
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
  phoneInput: { flex: 1, padding: 12, fontSize: 16 },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 4,
    paddingRight: 10,
  },
  passwordInput: { flex: 1, padding: 12, fontSize: 16 },
  eyeIcon: { padding: 10 },
  loginButton: {
    backgroundColor: "#28A745",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  supportContainer: { marginTop: 40, alignItems: "center" },
  supportText: { color: "#666", fontSize: 14 },
  supportIcons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 40,
  },
  errorText: { color: "red", fontSize: 13, marginLeft: 4, marginBottom: 4 },
});
