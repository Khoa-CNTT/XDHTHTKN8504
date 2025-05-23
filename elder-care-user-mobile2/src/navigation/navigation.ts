export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTPVerification: undefined;
  // Add other screens here
  Home: undefined;
  DoctorDetails: {
    participantId: string;
  };
  BookAppointment: { doctor: any };
  Profile: undefined;
  MyBookings: undefined;
  Favorites: undefined;
  Notifications: undefined;
  Map: { id: string };
  FeaturedService: undefined;
  Booking: undefined;
  AddCareRecipient: undefined;
  BookVisit: undefined;
  BookingSuccess: undefined;
  ServiceDetails: { serviceId: string };
  ProfileList: undefined;
  EditCareRecipient: { profileId: string };
  WorkScreen: undefined;
  ServiceScreen: { serviceId: string };
  Seach: undefined;

  Chat: {
    chatId: string;
    staffName: string,
    staffPhone: string,
    avatar: string;
  };
  ReviewScreen: undefined;
  PaymentInfoScreen: undefined;
  TopUpScreen: undefined;
  PaymentMethodScreen: undefined;
  TransferGuideScreen: undefined;
  BookAService: undefined;
  ServiceScreenTest: undefined;

  AddProfileScreen: undefined;
};
