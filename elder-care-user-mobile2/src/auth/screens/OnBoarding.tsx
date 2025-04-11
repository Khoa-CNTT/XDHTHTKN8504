import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { AUTH_COLORS, AUTH_STYLES } from '../constants';

export default function OnBoardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/image1.png')}
        style={styles.image}
      />

      <Text style={styles.title}>
        Chào mừng đến với <Text style={styles.highlight}>ElderCare</Text>
      </Text>

      <Text style={styles.subtitle}>
        Ứng dụng chăm sóc sức khỏe toàn diện cho người cao tuổi và gia đình
      </Text>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/Login')}
      >
        <Text style={styles.buttonText}>Bắt đầu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: AUTH_STYLES.container,
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginBottom: 30,
  },
  title: AUTH_STYLES.title,
  highlight: {
    color: AUTH_COLORS.primary,
    fontWeight: 'bold',
  },
  subtitle: {
    ...AUTH_STYLES.subtitle,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: AUTH_STYLES.button,
  buttonText: AUTH_STYLES.buttonText,
}); 