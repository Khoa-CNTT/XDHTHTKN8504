import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import useAuthStore from "./src/stores/authStore";
import useInitService from "./src/hooks/useInitService";
import SplashScreen from "./src/screens/SplashScreen";
import { RootStackParamList } from "./src/navigation/navigation";
import { createStackNavigator } from '@react-navigation/stack';
import StackNavigator from "./src/navigation/StackNavigator";


const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  useInitService();

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <SplashScreen />;
  }
  const initialRoute = token && user ? "Home" : "Onboarding";


  return (
    <NavigationContainer>
      <StackNavigator initialRouteName={initialRoute} />
    </NavigationContainer>
  );
}
