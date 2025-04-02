import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { LoginFormData } from '../types';
import { AUTH_COLORS, AUTH_STYLES } from '../constants';

export default function LoginScreen() {
  const { control, handleSubmit } = useForm<LoginFormData>();
  const router = useRouter();
  const [secureText, setSecureText] = useState(true);

  const togglePasswordVisibility = () => {
    setSecureText(!secureText);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('Login Data:', data);
      router.replace('/Home');
    } catch (error) {
      console.error('Login error:', error);
    }
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
        Đăng ký hay đăng nhập để sử dụng dịch vụ và quản lý hồ sơ sức khỏe của
        bạn và gia đình nhé!
      </Text>

      <View style={styles.phoneContainer}>
        <TextInput style={styles.countryCode} value="+84" editable={false} />
        <Controller
          control={control}
          name="phone"
          rules={{ required: 'Vui lòng nhập số điện thoại' }}
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

      <View style={styles.passwordContainer}>
        <Controller
          control={control}
          name="password"
          rules={{ required: 'Vui lòng nhập mật khẩu' }}
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
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Ionicons name={secureText ? 'eye-off' : 'eye'} size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/ForgotPassword')}>
        <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/Register')}>
        <Text style={styles.registerText}>
          Bạn chưa có tài khoản?{' '}
          <Text style={styles.registerLink}>Đăng ký ngay</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.supportContainer}>
        <Text style={styles.supportText}>Bạn cần liên hệ hỗ trợ?</Text>
        <View style={styles.supportIcons}>
          <TouchableOpacity>
            <Ionicons name="call" size={30} color={AUTH_COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome name="wechat" size={30} color={AUTH_COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="mail" size={30} color={AUTH_COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: AUTH_STYLES.container,
  logo: AUTH_STYLES.logo,
  title: AUTH_STYLES.title,
  highlight: {
    color: AUTH_COLORS.primary,
    fontWeight: 'bold',
  },
  subtitle: AUTH_STYLES.subtitle,
  phoneContainer: AUTH_STYLES.inputContainer,
  countryCode: {
    padding: 12,
    backgroundColor: '#ddd',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: 60,
    textAlign: 'center',
  },
  phoneInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  passwordContainer: {
    ...AUTH_STYLES.inputContainer,
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
    textAlign: 'right',
    color: AUTH_COLORS.primary,
    marginBottom: 20,
    fontSize: 14,
  },
  loginButton: AUTH_STYLES.button,
  loginButtonText: AUTH_STYLES.buttonText,
  registerText: {
    textAlign: 'center',
    marginTop: 15,
    color: AUTH_COLORS.textSecondary,
    fontSize: 14,
  },
  registerLink: {
    color: AUTH_COLORS.primary,
    fontWeight: 'bold',
  },
  supportContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  supportText: {
    color: AUTH_COLORS.textSecondary,
    fontSize: 14,
  },
  supportIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 40,
  },
}); 