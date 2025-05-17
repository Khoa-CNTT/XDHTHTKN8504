import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { StackNavigationOptions } from '@react-navigation/stack';

import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/Register';
import ForgotPassword from '../screens/ForgotPassword';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';

import HomeScreen from "../screens/HomeScreen";

import DoctorDetails from "../screens/DoctorDetails";
import BookAppointment from "../screens/BookAppointment";
import MyBookings from "../screens/MyBookings";
import Profile from "../screens/Profile";
import Notifications from "../screens/Notifications";
import MapScreen from "../screens/MapScreen";
import FeaturedServiceScreen from '../screens/FeaturedServiceScreen';
import BookingScreen from '../screens/BookingScreen';
import AddCareRecipientScreen from '../screens/AddCareRecipientScreen';
import BookVisitScreen from '../screens/BookAVisitScreen';
import BookingSuccessScreen from '../screens/BookingSuccessScreen';
import ServiceDetails from '../screens/ServiceDetails';
import { NavigationContainer } from '@react-navigation/native';
import ProfileListScreen from '../screens/ProfileListScreen';
import EditCareRecipientScreen from '../screens/EditCareRecipientScreen';
import BookAService from '../screens/book-a-service';

import WorkScreen from '../screens/work-screen';
import ServiceScreen from '../screens/ServiceScreen'; 
import Seach from '../screens/Seach';

import ChatScreen from '../screens/ChatScreen';
import ReviewScreen from '../screens/ReviewScreen';
import PaymentInfoScreen from '../screens/PaymentInfoScreen';
import TopUpScreen from '../screens/TopUpScreen';
import PaymentMethodScreen from '../screens/PaymentMethodScreen';
import TransferGuideScreen from '../screens/TransferGuideScreen';
import HomeServiceScreen from '../screens/Service';
import AddProfileScreen from '../screens/DanhSachProfile/AddProfileScreen';
import { RootStackParamList } from "./navigation";
import SplashScreen from '../screens/SplashScreen';


const Stack = createStackNavigator<RootStackParamList>();
type StackNavigatorProps = {
  initialRouteName?: keyof RootStackParamList;
};
const defaultScreenOptions: StackNavigationOptions = {
  headerShown: false,
};

const StackNavigator = ({
  initialRouteName,
}: StackNavigatorProps): JSX.Element => {
  return (
    <Stack.Navigator
      id={undefined}
      initialRouteName={initialRouteName}
      screenOptions={defaultScreenOptions}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />

      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="DoctorDetails" component={DoctorDetails} />
      <Stack.Screen name="BookAppointment" component={BookAppointment} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MyBookings" component={MyBookings} />
      <Stack.Screen name="WorkScreen" component={WorkScreen} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="FeaturedService" component={FeaturedServiceScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="BookAService" component={BookAService} />
      <Stack.Screen
        name="AddCareRecipient"
        component={AddCareRecipientScreen}
      />
      <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
      <Stack.Screen name="BookVisit" component={BookVisitScreen} />
      <Stack.Screen name="ProfileList" component={ProfileListScreen} />
      <Stack.Screen
        name="EditCareRecipient"
        component={EditCareRecipientScreen}
      />
      <Stack.Screen name="ServiceScreen" component={ServiceScreen} />
      <Stack.Screen name="Seach" component={Seach} />
      <Stack.Screen name="ReviewScreen" component={ReviewScreen} />
      <Stack.Screen name="PaymentInfoScreen" component={PaymentInfoScreen} />
      <Stack.Screen name="TopUpScreen" component={TopUpScreen} />
      <Stack.Screen
        name="PaymentMethodScreen"
        component={PaymentMethodScreen}
      />
      <Stack.Screen
        name="TransferGuideScreen"
        component={TransferGuideScreen}
      />

      <Stack.Screen name="AddProfileScreen" component={AddProfileScreen} />

      <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
      <Stack.Screen name="ServiceScreenTest" component={HomeServiceScreen} />

      {/* Add other screens here */}
      {/* <Stack.Screen name="AddCareRecipient" component={AddCareRecipientScreen} /> */}
      {/* Add other screens here */}
      {/* <Stack.Screen name="AddCareRecipient" component={AddCareRecipientScreen} /> */}
      {/* Add other screens here */}
    </Stack.Navigator>
  );
};

export default StackNavigator;