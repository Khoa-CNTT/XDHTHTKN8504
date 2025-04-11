import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { StackNavigationOptions } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AllDoctors from '../screens/AllDoctors';
import DoctorDetails from '../screens/DoctorDetails';
import BookAppointment from '../screens/BookAppointment';
import MyBookings from '../screens/MyBookings';
import Profile from '../screens/Profile';
import Favorites from '../screens/Favorites';
import Notifications from '../screens/Notifications';
import MapScreen from '../screens/MapScreen';

export type RootStackParamList = {
  Home: undefined;
  AllDoctors: undefined;
  DoctorDetails: { doctor: any };
  BookAppointment: { doctor: any };
  Profile: undefined;
  MyBookings: undefined;
  Favorites: undefined;
  Notifications: undefined;
  Map: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const defaultScreenOptions: StackNavigationOptions = {
  headerShown: false,
};

const StackNavigator = () => {
  return (
    <Stack.Navigator 
      id={undefined}
      screenOptions={defaultScreenOptions}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AllDoctors" component={AllDoctors} />
      <Stack.Screen name="DoctorDetails" component={DoctorDetails} />
      <Stack.Screen name="BookAppointment" component={BookAppointment} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MyBookings" component={MyBookings} />
      <Stack.Screen name="Favorites" component={Favorites} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Map" component={MapScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;