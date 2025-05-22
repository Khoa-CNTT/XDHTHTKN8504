import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native'; // Import Alert
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import useAuthStore from "../stores/authStore"; // Import useAuthStore

type RootStackParamList = {
  Home: undefined;
  MyBookings: undefined;
  Profile: undefined;
  Map: undefined;
  Booking: undefined;
  DoctorDetails: { doctor: any };
  BookAppointment: { doctor: any };
  WorkScreen: undefined;
  Login: undefined; // Đảm bảo Login được khai báo
};

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList>;

const Footer: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const [activeTab, setActiveTab] = useState<keyof RootStackParamList | null>(route.name as keyof RootStackParamList | null);
  const [pressedTab, setPressedTab] = useState<keyof RootStackParamList | null>(null);
  const [iconSizes, setIconSizes] = useState<{ [key in keyof RootStackParamList]: number }>({
    Home: 28,
    Map: 28,
    Booking: 28,
    MyBookings: 28,
    Profile: 28,
    DoctorDetails: 28,
    BookAppointment: 28,
    WorkScreen: 28,
    Login: 28, // Thêm Login vào đây nếu cần kích thước icon mặc định
  });

  const { token } = useAuthStore(); // Lấy token từ authStore

  const handleNavigation = useCallback((screenName: keyof RootStackParamList) => {
    if (screenName === 'DoctorDetails' || screenName === 'BookAppointment') {
      console.log('Cannot navigate directly to this screen');
      return;
    }
    navigation.navigate(screenName);
    setActiveTab(screenName);
  }, [navigation]);

  // Hàm xử lý khi nhấn vào tab Profile
  const handleProfilePress = () => {
    if (token) {
      // Nếu người dùng đã đăng nhập, điều hướng đến màn hình Profile
      navigation.navigate("Profile");
    } else {
      // Nếu người dùng chưa đăng nhập, hiển thị thông báo và điều hướng đến LoginScreen
      Alert.alert(
        "Yêu cầu đăng nhập",
        "Bạn cần đăng nhập để truy cập trang cá nhân. Bạn có muốn đăng nhập ngay bây giờ không?",
        [
          {
            text: "Không",
            style: "cancel"
          },
          { text: "Đăng nhập", onPress: () => navigation.navigate("Login") }
        ]
      );
    }
  };

  const handlePressIn = useCallback((tabName: keyof RootStackParamList) => {
    setPressedTab(tabName);
    setIconSizes(prevSizes => ({
      ...prevSizes,
      [tabName]: 36, // Increased size on press
    }));
  }, []);

  const handlePressOut = useCallback(() => {
    if (pressedTab) {
      setIconSizes(prevSizes => {
        const newSizes = { ...prevSizes };
        for (const key in newSizes) {
          newSizes[key as keyof RootStackParamList] = 28;
        }
        return newSizes;
      });
      setPressedTab(null);
    }
  }, []);

  const getTabStyle = (tabName: keyof RootStackParamList) => {
    const isPressed = pressedTab === tabName;
    return [
      styles.tab,
      isPressed && styles.tabPressed,
    ];
  };

  const getIconSize = (tabName: keyof RootStackParamList) => {
    return iconSizes[tabName];
  };

  const getIconColor = (tabName: keyof RootStackParamList) => {
    return activeTab === tabName || pressedTab === tabName ? '#37B44E' : '#BBBFBC';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={getTabStyle('Home')}
        onPress={() => handleNavigation('Home')}
        onPressIn={() => handlePressIn('Home')}
        onPressOut={handlePressOut}
      >
        <View style={{alignItems: 'center', justifyContent: 'center', transform: pressedTab === 'Home' ? [{ scale: 1.3 }] : [{scale: 1}]}}>
        <Ionicons
          name="home"
          size={getIconSize('Home')}
          color={getIconColor('Home')}
        />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={getTabStyle('Map')}
        onPress={() => handleNavigation('WorkScreen')}
        onPressIn={() => handlePressIn('Map')}
        onPressOut={handlePressOut}
      >
        <View style={{alignItems: 'center', justifyContent: 'center', transform: pressedTab === 'Map' ? [{ scale: 1.3 }] : [{scale: 1}]}}>
        <Ionicons
          name="location"
          size={getIconSize('Map')}
          color={getIconColor('Map')}
        />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={getTabStyle('Booking')}
        onPress={() => handleNavigation('Booking')} // Navigate to Booking screen
        onPressIn={() => handlePressIn('Booking')}
        onPressOut={handlePressOut}
      >
        <View style={{alignItems: 'center', justifyContent: 'center', transform: pressedTab === 'Booking' ? [{ scale: 1.3 }] : [{scale: 1}]}}>
        <Ionicons
          name="book" // Changed icon to represent Booking
          size={getIconSize('Booking')}
          color={getIconColor('Booking')}
        />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={getTabStyle('MyBookings')}
        onPress={() => handleNavigation('MyBookings')}
        onPressIn={() => handlePressIn('MyBookings')}
        onPressOut={handlePressOut}
      >
        <View style={{alignItems: 'center', justifyContent: 'center', transform: pressedTab === 'MyBookings' ? [{ scale: 1.3 }] : [{scale: 1}]}}>
        <Ionicons
          name="calendar"
          size={getIconSize('MyBookings')}
          color={getIconColor('MyBookings')}
        />
        </View>
      </TouchableOpacity>
      {/* Nút "Settings" (Profile) đã được sửa đổi */}
      <TouchableOpacity
        style={getTabStyle('Profile')}
        onPress={handleProfilePress} // Gọi hàm xử lý mới
        onPressIn={() => handlePressIn('Profile')}
        onPressOut={handlePressOut}
      >
        <View style={{alignItems: 'center', justifyContent: 'center', transform: pressedTab === 'Profile' ? [{ scale: 1.3 }] : [{scale: 1}]}}>
        <Ionicons
          name="settings"
          size={getIconSize('Profile')}
          color={getIconColor('Profile')}
        />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute', // Fix the Footer at the bottom
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff', // Light background
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#D3D3D3', // Light gray border
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 50, // Make it a circle
  },
  tabPressed: {
    // borderColor: '#4CAF50', // Green border color
    // borderWidth: 2,
    // padding: 8, // Adjust padding to accommodate the border
  },
});

export default Footer;