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
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import loginApi from "../api/authAPI";
import useAuthStore from "../stores/authStore";

type FormData = {
    phone: string;
    password: string;
};

type LoginScreenNavigationProp = StackNavigationProp<
    {
        ForgotPassword: undefined;
        Register: undefined;
        Home: undefined; // Changed to "Home"
    },
    "ForgotPassword" | "Register" | "Home"
>;

const LoginScreen: React.FC<{}> = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [secureText, setSecureText] = useState(true);
    const setSession = useAuthStore((state) => state.setSession); // Trạng thái ẩn/hiện mật khẩu

    const togglePasswordVisibility = () => {
        setSecureText(!secureText);
    };

    const onSubmit = async (data: FormData) => {
        try {
            const { token, user } = await loginApi(data.phone, data.password);

            console.log("Login successful:", user);

            await AsyncStorage.setItem("token", token);
            await AsyncStorage.setItem("user", JSON.stringify(user));

            setSession(user, token);
            navigation.navigate("Home");
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
            {/* Logo */}
            <Image
                source={require("../asset/img/logo-elder-care.png")} // Đường dẫn đến logo
                style={styles.logo}
            />

            {/* Tiêu đề */}
            <Text style={styles.title}>
                Chào mừng đến với <Text style={styles.highlight}>ElderCare</Text>
            </Text>

            <Text style={styles.subtitle}>
                Đăng ký hoặc đăng nhập để sử dụng dịch vụ và quản lý hồ sơ sức khỏe
                của bạn và gia đình.
            </Text>

            {/* Ô nhập số điện thoại */}
            <View>
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
                {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
            </View>

            {/* Ô nhập mật khẩu có icon ẩn/hiện */}
            <View>
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
                            color="#B0B0B0" // Lighter color for eye icon
                        />
                    </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
            </View>

            {/* Quên mật khẩu */}
            <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
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
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
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
                        <Ionicons name="call" size={30} color="#37B44E" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <FontAwesome name="wechat" size={30} color="#37B44E" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="mail" size={30} color="#37B44E" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F9FAFB", // Lighter background
        justifyContent: "flex-start",
        paddingTop: 40
    },
    logo: {
        width: 350,
        height: 180,
        alignSelf: "center",
        marginBottom: 10, // Increased margin
        resizeMode: "contain",
    },
    title: {
        fontSize: 24, // Increased font size
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 12, // Increased margin
        color: "#2D3748", // Darker text
    },
    highlight: {
        color: "#37B44E",
        fontWeight: "bold",
    },
    subtitle: {
        textAlign: "center",
        color: "#718096", // Slightly darker subtitle
        marginBottom: 30, // Increased margin
        fontSize: 15,
        lineHeight: 22,  //Increased line height
    },
    phoneContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF", // White background for input
        borderRadius: 10, // More rounded corners
        marginBottom: 5, // Reduced margin to accommodate error text
        overflow: "hidden",
        borderWidth: 1,  //Added border
        borderColor: "#E2E8F0" //Light border color
    },
    countryCode: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: "#EDF2F7", // Light background for country code
        fontSize: 16,
        fontWeight: "600", // Medium font weight
        color: "#4A5568", // Darker text
        width: 60,
        textAlign: "center",
    },
    phoneInput: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        color: "#2D3748", // Darker text
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF", // White background for input
        borderRadius: 10, // More rounded corners
        marginBottom: 5, // Reduced margin to accommodate error text
        paddingRight: 10,
        borderWidth: 1,  //Added border
        borderColor: "#E2E8F0" //Light border color
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        color: "#2D3748", // Darker text
    },
    eyeIcon: {
        padding: 12,
    },
    forgotPassword: {
        textAlign: "right",
        color: "#37B44E",
        marginBottom: 25, // Increased margin
        fontSize: 14,
        fontWeight: "600"
    },
    loginButton: {
        backgroundColor: "#37B44E",
        padding: 16, // Increased padding
        borderRadius: 10, // More rounded corners
        alignItems: "center",
        shadowColor: "#000", // Add shadow
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 18, // Increased font size
        fontWeight: "bold",
    },
    registerText: {
        textAlign: "center",
        marginTop: 20, // Increased margin
        color: "#718096", // Slightly darker text
        fontSize: 15,
    },
    registerLink: {
        color: "#37B44E",
        fontWeight: "bold",
    },
    supportContainer: {
        marginTop: 50, // Increased margin
        alignItems: "center",
    },
    supportText: {
        color: "#718096", // Slightly darker text
        fontSize: 15,
        marginBottom: 12
    },
    supportIcons: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
        gap: 40,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 3,
        marginLeft: 16,
    },
});

export default LoginScreen;