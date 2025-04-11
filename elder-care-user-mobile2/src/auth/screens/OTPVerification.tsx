import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { OTPVerificationData } from '../types';
import { AUTH_COLORS, AUTH_STYLES } from '../constants';

export default function OTPVerificationScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '']);
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

  const handleVerify = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 4) {
      console.log('Mã OTP:', enteredOtp);
      router.replace('/Login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác nhận Mã OTP</Text>
      <Text style={styles.subtitle}>
        Chúng tôi đã gửi mã xác nhận đến số điện thoại sau {'\n'}
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

      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.verifyButtonText}>Xác nhận</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/Login')}>
        <Text style={styles.backToLogin}>Quay lại đăng nhập</Text>
      </TouchableOpacity>

      <Text style={styles.resendText}>Bạn chưa nhận được mã?</Text>
      <TouchableOpacity disabled={timer > 0}>
        <Text style={[styles.resendButton, timer > 0 && { color: 'gray' }]}>
          Gửi lại mã {timer > 0 ? `(${timer}s)` : ''}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AUTH_COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: AUTH_COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: AUTH_COLORS.textSecondary,
  },
  phone: {
    fontWeight: 'bold',
    color: AUTH_COLORS.text,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    marginHorizontal: 5,
  },
  verifyButton: AUTH_STYLES.button,
  verifyButtonText: AUTH_STYLES.buttonText,
  backToLogin: {
    fontSize: 16,
    color: AUTH_COLORS.primary,
    fontWeight: 'bold',
  },
  resendText: {
    fontSize: 14,
    marginTop: 20,
    color: AUTH_COLORS.textSecondary,
  },
  resendButton: {
    fontSize: 16,
    color: AUTH_COLORS.primary,
    fontWeight: 'bold',
  },
}); 