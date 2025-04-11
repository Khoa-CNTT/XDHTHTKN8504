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
  DoctorDetails: { doctor: any };
  BookAppointment: { doctor: any };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList>;

const Footer: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  const handleNavigation = (screenName: keyof RootStackParamList) => {
    console.log(`Attempting to navigate to ${screenName}`);
    try {
      if (screenName === 'DoctorDetails' || screenName === 'BookAppointment') {
        console.log('Cannot navigate directly to this screen');
        return;
      }
      navigation.navigate({
        name: screenName,
        params: undefined
      });
      console.log(`Successfully navigated to ${screenName}`);
    } catch (error) {
      console.error(`Navigation error to ${screenName}:`, error);
    }
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
          name="home" 
          size={24} 
          color={isActiveRoute('Home') ? '#2E3A59' : '#666'} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.tab}
        onPress={() => handleNavigation('Map')}
      >
        <Ionicons 
          name="location" 
          size={24} 
          color={isActiveRoute('Map') ? '#2E3A59' : '#666'} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => handleNavigation('MyBookings')}
      >
        <Ionicons 
          name="calendar" 
          size={24} 
          color={isActiveRoute('MyBookings') ? '#2E3A59' : '#666'} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => handleNavigation('Profile')}
      >
        <Ionicons 
          name="person" 
          size={24} 
          color={isActiveRoute('Profile') ? '#2E3A59' : '#666'} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: 20,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});

export default Footer;
