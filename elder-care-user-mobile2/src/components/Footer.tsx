import React from 'react';
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

  const handleNavigation = (screenName: keyof RootStackParamList) => {
    if (screenName === 'DoctorDetails' || screenName === 'BookAppointment') {
      console.log('Cannot navigate directly to this screen');
      return;
    }
    navigation.navigate(screenName);
  };

  const isActiveRoute = (routeName: keyof RootStackParamList) => {
    return route.name === routeName;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => handleNavigation('Home')}
      >
        <Ionicons 
          name="home-outline" 
          size={24} 
          color={isActiveRoute('Home') ? '#2E3A59' : '#666'} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.tab}
        onPress={() => handleNavigation('Map')}
      >
        <Ionicons 
          name="location-outline" 
          size={24} 
          color={isActiveRoute('Map') ? '#2E3A59' : '#666'} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.tab}
        onPress={() => handleNavigation('Booking')} // Navigate to Booking screen
      >
        <Ionicons 
          name="book-outline" // Changed icon to represent Booking
          size={24} 
          color={isActiveRoute('Booking') ? '#2E3A59' : '#666'} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => handleNavigation('MyBookings')}
      >
        <Ionicons 
          name="calendar-outline" 
          size={24} 
          color={isActiveRoute('MyBookings') ? '#2E3A59' : '#666'} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => handleNavigation('Profile')}
      >
        <Ionicons 
          name="settings-outline" 
          size={24} 
          color={isActiveRoute('Profile') ? '#2E3A59' : '#666'} 
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
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});

export default Footer;