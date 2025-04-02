import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RegisterFormData } from '../types';
import { AUTH_COLORS, AUTH_STYLES } from '../constants';

export default function Register() {
  const { control, handleSubmit } = useForm<RegisterFormData>();
  const router = useRouter();
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

  const togglePasswordVisibility = () => setSecurePassword(!securePassword);
  const toggleConfirmPasswordVisibility = () => setSecureConfirmPassword(!secureConfirmPassword);

  const onSubmit = (data: RegisterFormData) => {
    console.log('Register Data:', data);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/logo.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>
        Chào mừng đến với <Text style={styles.highlight}>ElderCare</Text>
      </Text>
      <Text style={styles.subtitle}>
        Vui lòng nhập số điện thoại của bạn để đăng ký tài khoản
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.prefix}>+84</Text>
        <Controller
          control={control}
          name="phone"
          rules={{
            required: 'Vui lòng nhập số điện thoại',
            pattern: {
              value: /^[0-9]{9,10}$/,
              message: 'Số điện thoại không hợp lệ',
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

      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="password"
          rules={{ required: 'Vui lòng nhập mật khẩu' }}
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
          <Ionicons
            name={securePassword ? 'eye-off' : 'eye'}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="confirmPassword"
          rules={{ required: 'Vui lòng nhập lại mật khẩu' }}
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
          <Ionicons
            name={secureConfirmPassword ? 'eye-off' : 'eye'}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.registerButtonText}>Đăng ký</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/Login')}>
        <Text style={styles.loginText}>
          Bạn đã có tài khoản?{' '}
          <Text style={styles.loginLink}>Đăng nhập</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: AUTH_STYLES.container,
  logo: AUTH_STYLES.logo,
  title: AUTH_STYLES.title,
  highlight: {
    color: AUTH_COLORS.primary,
  },
  subtitle: AUTH_STYLES.subtitle,
  inputContainer: AUTH_STYLES.inputContainer,
  prefix: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingRight: 10,
  },
  inputText: {
    flex: 1,
    paddingVertical: 12,
  },
  eyeIcon: {
    padding: 10,
  },
  registerButton: AUTH_STYLES.button,
  registerButtonText: AUTH_STYLES.buttonText,
  loginText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  loginLink: {
    color: AUTH_COLORS.primary,
    fontWeight: 'bold',
  },
}); 