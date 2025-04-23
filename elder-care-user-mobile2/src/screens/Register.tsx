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
import { Ionicons } from "@expo/vector-icons"; // Correct import
import axios from "axios";
import LoginScreen from "./LoginScreen";

type FormData = {
  phone: string;
  password: string;
  confirmPassword: string;
};

// Define the type for the navigation prop
// ... other imports
type RegisterScreenNavigationProp = StackNavigationProp<
  {
    Login: undefined; // Changed to "Login"
  },
  "Login"
>;
// ... rest of the code


const Register: React.FC<{}> = () => {
  const { control, handleSubmit } = useForm<FormData>();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

  const togglePasswordVisibility = () => setSecurePassword(!securePassword);
  const toggleConfirmPasswordVisibility = () =>
    setSecureConfirmPassword(!secureConfirmPassword);

  // ... other imports
  // const onSubmit = (data: FormData) => {
  //     // Here you would typically make an API call to register the user
  //     // For this example, we'll just simulate a successful registration
  //     const { phone, password, confirmPassword } = data;
  //     if (
  //       phone === "1234567890" &&
  //       password === "123456" &&
  //       password === confirmPassword
  //     ) {
  //       // Simulate successful registration
  //       console.log("Register Data:", data);
  //       navigation.navigate("Home"); // Corrected line
  //     } else {
  //       // Simulate failed registration
  //       Alert.alert("Registration Failed", "Invalid phone or password.");
  //     }
  //   };
  // ... rest of the code

  const onSubmit = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        Alert.alert("Mật khẩu không khớp", "Vui lòng kiểm tra lại mật khẩu.");
        return;
      }
      const response = await axios.post("http://192.168.100.147:5000/api/v1/auth/signup", {
        phone: data.phone,
        password: data.password,
        role: "family_member"
      });

      // ✅ Xử lý kết quả sau khi đăng nhập thành công
      console.log("Đăng ký thành công!:", response.data);
      navigation.navigate('Login'); // Corrected line
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Đăng ký thất bại", "Vui lòng kiểm tra lại thông tin.");
    }
  };


  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../asset/img/logo-elder-care.jpg")} 
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
  },
});

export default Register;
