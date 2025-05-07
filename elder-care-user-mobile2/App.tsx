import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/navigation/StackNavigator";
import GlobalModal from "./src/components/GlobalModal";

import "./src/utils/api";
import useInitService from "./src/hooks/useInitService";

const App=() => {
  return (
    <NavigationContainer>
      <InitWrapper />
      <StackNavigator />
      <GlobalModal />
    </NavigationContainer>
  );
};

const InitWrapper = () => {
  useInitService(); // Sẽ dùng được navigation ở đây
  return null;
};

export default App;
