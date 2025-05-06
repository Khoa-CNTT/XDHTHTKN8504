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
import Ionicons from "react-native-vector-icons/Ionicons";

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
            {/* Logo */}
            <Image
                source={require("../asset/img/logo-elder-care.png")} // Đảm bảo đường dẫn chính xác
                style={styles.logo}
            />

            {/* Tiêu đề */}
            <Text style={styles.title}>
                Chào mừng đến với <Text style={styles.highlight}>ElderCare</Text>
            </Text>

            <Text style={styles.subtitle}>
                Vui lòng nhập số điện thoại và mật khẩu để đăng ký tài khoản mới.
            </Text>

            {/* Ô nhập số điện thoại */}
            <View style={styles.inputContainer}>
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
                            placeholder="Số điện thoại của bạn"
                            keyboardType="phone-pad"
                            value={value}
                            onChangeText={onChange}
                            maxLength={10}
                        />
                    )}
                />
            </View>

            {/* Ô nhập mật khẩu có icon ẩn/hiện */}
            <View style={styles.inputContainer}>
                <Controller
                    control={control}
                    name="password"
                    rules={{ required: "Vui lòng nhập mật khẩu" }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.inputText}
                            placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                            secureTextEntry={securePassword}
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                    <Ionicons name={securePassword ? "eye-off" : "eye"} size={24} color="#B0B0B0" />
                </TouchableOpacity>
            </View>

            {/* Ô nhập xác nhận mật khẩu có icon ẩn/hiện */}
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
                    <Ionicons name={secureConfirmPassword ? "eye-off" : "eye"} size={24} color="#B0B0B0" />
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

            {/* Chuyển sang đăng nhập */}
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginText}>
                    Bạn đã có tài khoản? <Text style={styles.loginLink}>Đăng nhập ngay</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#F9FAFB",
      justifyContent: "flex-start",
      paddingTop: 40,
  },
  logo: {
      width: 350,
      height: 180,
      alignSelf: "center",
      marginBottom: 10,
      resizeMode: "contain",
  },
  title: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 12,
      color: "#2D3748",
  },
  highlight: {
      color: "#37B44E",
      fontWeight: "bold",
  },
  subtitle: {
      textAlign: "center",
      color: "#718096",
      marginBottom: 30,
      fontSize: 15,
      lineHeight: 22,
  },
  inputContainer: {
      backgroundColor: "#FFFFFF",
      borderRadius: 10,
      marginBottom: 18,
      paddingRight: 10,
      borderWidth: 1,
      borderColor: "#E2E8F0",
      flexDirection: "row",
      alignItems: "center",
  },
  inputText: {
      flex: 1,
      paddingVertical: 14,
      paddingHorizontal: 16,
      fontSize: 16,
      color: "#2D3748",
  },
  eyeIcon: {
      padding: 12,
  },
  registerButton: {
      backgroundColor: "#37B44E",
      padding: 16,
      borderRadius: 10,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      marginTop: 25,
  },
  registerButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
  },
  loginText: {
      textAlign: "center",
      marginTop: 20,
      color: "#718096",
      fontSize: 15,
  },
  loginLink: {
      color: "#37B44E",
      fontWeight: "bold",
  },
});

export default Register;