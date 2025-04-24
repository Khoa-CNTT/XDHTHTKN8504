import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Regex cho mật khẩu mạnh (ít nhất 8 ký tự, chữ hoa, chữ thường, chữ số và ký tự đặc biệt)
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const SetNewPasswordScreen = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<string>("");
  const [passwordMatchError, setPasswordMatchError] = useState<string>("");

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Kiểm tra mật khẩu khi người dùng rời khỏi trường nhập liệu
  const handlePasswordBlur = () => {
    if (!passwordRegex.test(password)) {
      setPasswordStrength(
        "Mật khẩu yếu: Cần chữ hoa, chữ thường, số và ký tự đặc biệt."
      );
    } else {
      setPasswordStrength("Mật khẩu hợp lệ.");
    }
  };

  // Kiểm tra khi xác nhận mật khẩu
  const handleConfirmPasswordBlur = () => {
    if (password !== confirmPassword) {
      setPasswordMatchError("Mật khẩu không khớp.");
    } else {
      setPasswordMatchError("");
    }
  };

  const handleChangePassword = () => {
    if (!passwordRegex.test(password)) {
      setPasswordStrength(
        "Mật khẩu yếu: Cần chữ hoa, chữ thường, số và ký tự đặc biệt."
      );
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMatchError("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    console.log("Mật khẩu đã được thay đổi thành công!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thay Đổi Mật Khẩu</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mật khẩu</Text>
        <View style={styles.passwordInput}>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu của bạn"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            onBlur={handlePasswordBlur} // Kiểm tra mật khẩu khi rời khỏi trường nhập liệu
          />
          <TouchableOpacity
            onPress={handleTogglePasswordVisibility}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        {/* {passwordStrength ? (
          <Text style={styles.passwordStrength}>{passwordStrength}</Text>
        ) : null} */}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Xác nhận mật khẩu</Text>
        <View style={styles.passwordInput}>
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu của bạn"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onBlur={handleConfirmPasswordBlur} // Kiểm tra trùng khớp mật khẩu khi rời khỏi trường
          />
          <TouchableOpacity
            onPress={handleToggleConfirmPasswordVisibility}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        {passwordMatchError ? (
          <Text style={styles.errorText}>{passwordMatchError}</Text>
        ) : null}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Đổi Mật Khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F4F7FC",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#28A745",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: "#DDD",
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 18,
    backgroundColor: "#fff",
    flex: 1,
  },
  passwordInput: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#DDD",
    borderWidth: 1,
    borderRadius: 20,
    paddingRight: 10,
    backgroundColor: "#fff",
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: "#28A745",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
//   passwordStrength: {
//     marginTop: 5,
//     color: passwordStrength.includes("yếu") ? "red" : "green",
//     fontSize: 14,
//   },
  errorText: {
    marginTop: 5,
    color: "red",
    fontSize: 14,
  },
});

export default SetNewPasswordScreen;
