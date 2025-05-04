import React, { useState, useCallback } from 'react';
 import { View, TouchableOpacity, StyleSheet } from 'react-native';
 import { useNavigation, useRoute } from '@react-navigation/native';
 import { Ionicons } from '@expo/vector-icons';
 import { StackNavigationProp } from '@react-navigation/stack';
 import { RouteProp } from '@react-navigation/native';

 type RootStackParamList = {
  Home: undefined;
  MyBookings: undefined;
  Profile: undefined;
  Map: undefined;
  Booking: undefined; // Changed from Payment to Booking
  DoctorDetails: { doctor: any };
  BookAppointment: { doctor: any };
 };

 type NavigationProp = StackNavigationProp<RootStackParamList>;
 type RouteProps = RouteProp<RootStackParamList>;

 const Footer: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const [activeTab, setActiveTab] = useState<keyof RootStackParamList | null>(route.name as keyof RootStackParamList | null);
  const [pressedTab, setPressedTab] = useState<keyof RootStackParamList | null>(null);

  const handleNavigation = useCallback((screenName: keyof RootStackParamList) => {
    if (screenName === 'DoctorDetails' || screenName === 'BookAppointment') {
      console.log('Cannot navigate directly to this screen');
      return;
    }
    navigation.navigate(screenName);
    setActiveTab(screenName);
  }, [navigation]);

  const handlePressIn = useCallback((tabName: keyof RootStackParamList) => {
    setPressedTab(tabName);
  }, []);

  const handlePressOut = useCallback(() => {
    setPressedTab(null);
  }, []);

  const getTabStyle = (tabName: keyof RootStackParamList) => {
    const isPressed = pressedTab === tabName;
    return [
      styles.tab,
      isPressed && styles.tabPressed,
    ];
  };

  const getIconSize = (tabName: keyof RootStackParamList) => {
    return 28;
  };

  const getIconColor = (tabName: keyof RootStackParamList) => {
    return activeTab === tabName || pressedTab === tabName ? '#00CC00' : '#8E8E93';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={getTabStyle('Home')}
        onPress={() => handleNavigation('Home')}
        onPressIn={() => handlePressIn('Home')}
        onPressOut={handlePressOut}
      >
        <Ionicons
          name="home-outline"
          size={getIconSize('Home')}
          color={getIconColor('Home')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={getTabStyle('Map')}
        onPress={() => handleNavigation('Map')}
        onPressIn={() => handlePressIn('Map')}
        onPressOut={handlePressOut}
      >
        <Ionicons
          name="location-outline"
          size={getIconSize('Map')}
          color={getIconColor('Map')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={getTabStyle('Booking')}
        onPress={() => handleNavigation('Booking')} // Navigate to Booking screen
        onPressIn={() => handlePressIn('Booking')}
        onPressOut={handlePressOut}
      >
        <Ionicons
          name="book-outline" // Changed icon to represent Booking
          size={getIconSize('Booking')}
          color={getIconColor('Booking')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={getTabStyle('MyBookings')}
        onPress={() => handleNavigation('MyBookings')}
        onPressIn={() => handlePressIn('MyBookings')}
        onPressOut={handlePressOut}
      >
        <Ionicons
          name="calendar-outline"
          size={getIconSize('MyBookings')}
          color={getIconColor('MyBookings')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={getTabStyle('Profile')}
        onPress={() => handleNavigation('Profile')}
        onPressIn={() => handlePressIn('Profile')}
        onPressOut={handlePressOut}
      >
        <Ionicons
          name="settings-outline"
          size={getIconSize('Profile')}
          color={getIconColor('Profile')}
        />
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
    backgroundColor: '#FAFAFA', // Light background
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