import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Define the type for the navigation prop
// ... other imports
type OTPVerificationScreenNavigationProp = StackNavigationProp<
  {
    Home: undefined; // Changed to "Home"
  },
  "Home"
>;
// ... rest of the code


const OTPVerificationScreen: React.FC<{}> = () => {
  const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length === 1 && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

// ... other imports
const handleVerify = () => {
  const enteredOtp = otp.join("");
  if (enteredOtp.length === 4) {
    // Here you would typically make an API call to verify the OTP
    // For this example, we'll just simulate a successful verification
    if (enteredOtp === "1234") {
      // Simulate successful OTP verification
      console.log("Mã OTP:", enteredOtp);
      navigation.navigate("Home"); // Corrected line
    } else {
      // Simulate failed OTP verification
      Alert.alert("OTP Verification Failed", "Invalid OTP.");
    }
  }
};
// ... rest of the code

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác nhận Mã OTP</Text>
      <Text style={styles.subtitle}>
        Chúng tôi đã gửi mã xác nhận đến số điện thoại sau {"\n"}
        <Text style={styles.phone}>******4128</Text>
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={value}
            onChangeText={(text) => handleChange(index, text)}
            ref={(ref) => (inputRefs.current[index] = ref!)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>

      <Text style={styles.resendText}>Bạn chưa nhận được mã?</Text>
      <TouchableOpacity disabled={timer > 0}>
        <Text style={[styles.resendButton, timer > 0 && { color: "gray" }]}>
          Gửi lại mã {timer > 0 ? `(${timer}s)` : ""}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  subtitle: { fontSize: 16, textAlign: "center", marginVertical: 10 },
  phone: { fontWeight: "bold" },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  resendText: { fontSize: 14, marginTop: 20 },
  resendButton: { fontSize: 16, color: "#6C63FF", fontWeight: "bold" },
});

export default OTPVerificationScreen;
