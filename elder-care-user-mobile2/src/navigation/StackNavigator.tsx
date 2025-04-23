import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { StackNavigationOptions } from '@react-navigation/stack';

import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/Register';
import ForgotPassword from '../screens/ForgotPassword';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';

import HomeScreen from "../screens/HomeScreen";
import AllDoctors from "../screens/AllDoctors";
import DoctorDetails from "../screens/DoctorDetails";
import BookAppointment from "../screens/BookAppointment";
import MyBookings from "../screens/MyBookings";
import Profile from "../screens/Profile";
import Favorites from "../screens/Favorites";
import Notifications from "../screens/Notifications";
import MapScreen from "../screens/MapScreen";
import FeaturedServiceScreen from '../screens/FeaturedServiceScreen';
import BookingScreen from '../screens/BookingScreen';
import AddCareRecipientScreen from '../screens/AddCareRecipientScreen';
import BookVisitScreen from '../screens/BookAVisit.Screen';

import BookingSuccessScreen from '../screens/BookingSuccessScreen';




export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTPVerification: undefined;
  // Add other screens here
  Home: undefined;
  AllDoctors: undefined;
  DoctorDetails: { doctor: any };
  BookAppointment: { doctor: any };
  Profile: undefined;
  MyBookings: undefined;
  Favorites: undefined;
  Notifications: undefined;
  Map: undefined;
  FeaturedService: undefined;
  Booking: undefined;
  AddCareRecipient: undefined;
  BookVisit: undefined;
  BookingSuccess: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const defaultScreenOptions: StackNavigationOptions = {
  headerShown: false,
};

const StackNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator 
      id={undefined}
      screenOptions={defaultScreenOptions}
    >
      {/* <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} /> 
       */}

      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AllDoctors" component={AllDoctors} />
      <Stack.Screen name="DoctorDetails" component={DoctorDetails} />
      <Stack.Screen name="BookAppointment" component={BookAppointment} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MyBookings" component={MyBookings} />
      <Stack.Screen name="Favorites" component={Favorites} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="FeaturedService" component={FeaturedServiceScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="AddCareRecipient" component={AddCareRecipientScreen} />
      <Stack.Screen name="BookVisit" component={BookVisitScreen} />
      
      


      <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />

      {/* Add other screens here */}
      {/* <Stack.Screen name="AddCareRecipient" component={AddCareRecipientScreen} /> */}
      {/* Add other screens here */}
      {/* <Stack.Screen name="AddCareRecipient" component={AddCareRecipientScreen} /> */}
      {/* Add other screens here */}
    </Stack.Navigator>
  );
};

export default StackNavigator;
