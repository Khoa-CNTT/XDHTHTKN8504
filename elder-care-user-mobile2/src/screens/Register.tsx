import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import useRegisterStore from "../stores/useRegisterStore";

type RootStackParamList = {
  Login: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">;

type FormData = {
  phone: string;
  password: string;
  confirmPassword: string;
};

const Register: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { control, handleSubmit, reset } = useForm<FormData>();
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

  const togglePasswordVisibility = () => setSecurePassword(!securePassword);
  const toggleConfirmPasswordVisibility = () => setSecureConfirmPassword(!secureConfirmPassword);

  const { register, loading, error } = useRegisterStore();

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      Alert.alert("Mật khẩu không khớp", "Vui lòng kiểm tra lại mật khẩu.");
      return;
    }

    await register(data.phone, data.password);

    if (!error) {
      Alert.alert("Đăng ký thành công!", "Vui lòng đăng nhập.");
      reset();
      navigation.navigate("Login");
    } else {
      Alert.alert("Đăng ký thất bại", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../asset/img/logo-elder-care.jpg")} style={styles.logo} />
      <Text style={styles.title}>
        Chào mừng đến với <Text style={styles.highlight}>ElderCare</Text>
      </Text>
      <Text style={styles.subtitle}>
        Vui lòng nhập số điện thoại của bạn để đăng ký tài khoản
      </Text>

      {/* Số điện thoại */}
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
              maxLength={10}
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
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Ionicons name={securePassword ? "eye-off" : "eye"} size={24} color="#666" />
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
        <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
          <Ionicons name={secureConfirmPassword ? "eye-off" : "eye"} size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Nút đăng ký */}
      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        <Text style={styles.registerButtonText}>
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

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
  },
});

export default Register;
