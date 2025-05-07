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
  WorkScreen: undefined; // Added WorkScreen
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
    DoctorDetails: 28,  // Added DoctorDetails
    BookAppointment: 28,  // Added BookAppointment
    WorkScreen: 28, // Added WorkScreen
  });

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
      <TouchableOpacity
        style={getTabStyle('Profile')}
        onPress={() => handleNavigation('Profile')}
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
