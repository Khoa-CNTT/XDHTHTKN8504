import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/navigation/StackNavigator";
import { FavoritesProvider } from "./src/context/FavoritesContext";
import { FavoriteHospitalsProvider } from "./src/context/FavoriteHospitalsContext";
import { BookingsProvider } from './src/context/BookingsContext';

const App: React.FC = () => {
  return (
    <FavoriteHospitalsProvider>
      <FavoritesProvider>
        <BookingsProvider>
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </BookingsProvider>
      </FavoritesProvider>
    </FavoriteHospitalsProvider>
  );
};

export default App;
