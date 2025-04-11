import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { ForgotPasswordFormData } from '../types';
import { AUTH_COLORS, AUTH_STYLES } from '../constants';

export default function ForgotPassword() {
  const { control, handleSubmit } = useForm<ForgotPasswordFormData>();
  const router = useRouter();

  const onSubmit = (data: ForgotPasswordFormData) => {
    console.log('Phone Number:', data.phone);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/logo.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>Quên mật khẩu</Text>
      <Text style={styles.subtitle}>
        Vui lòng nhập số điện thoại của bạn để đặt lại mật khẩu mới
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.prefix}>+84</Text>
        <Controller
          control={control}
          name="phone"
          rules={{ required: 'Vui lòng nhập số điện thoại' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại của bạn"
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.resetButtonText}>Đặt lại mật khẩu</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/Login')}>
        <Text style={styles.backToLogin}>Quay lại đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: AUTH_STYLES.container,
  logo: AUTH_STYLES.logo,
  title: AUTH_STYLES.title,
  subtitle: AUTH_STYLES.subtitle,
  inputContainer: AUTH_STYLES.inputContainer,
  prefix: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  resetButton: AUTH_STYLES.button,
  resetButtonText: AUTH_STYLES.buttonText,
  backToLogin: {
    color: AUTH_COLORS.primary,
    textAlign: 'center',
    marginTop: 10,
  },
}); 