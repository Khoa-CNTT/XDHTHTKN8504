import React, { createContext, useState, useContext, ReactNode } from 'react';

type Hospital = {
  id: string;
  name: string;
  address: string;
  image: any;
  rating: number;
  reviews: number;
  type: string;
  distance: string;
};

interface FavoriteHospitalsContextType {
  favoriteHospitals: Hospital[];
  addFavoriteHospital: (hospital: Hospital) => void;
  removeFavoriteHospital: (hospitalId: string) => void;
  isFavoriteHospital: (hospitalId: string) => boolean;
}

const FavoriteHospitalsContext = createContext<FavoriteHospitalsContextType | undefined>(undefined);

export const FavoriteHospitalsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favoriteHospitals, setFavoriteHospitals] = useState<Hospital[]>([]);

  const addFavoriteHospital = (hospital: Hospital) => {
    setFavoriteHospitals((prev) => [...prev, hospital]);
  };

  const removeFavoriteHospital = (hospitalId: string) => {
    setFavoriteHospitals((prev) => prev.filter((hospital) => hospital.id !== hospitalId));
  };

  const isFavoriteHospital = (hospitalId: string) => {
    return favoriteHospitals.some((hospital) => hospital.id === hospitalId);
  };

  return (
    <FavoriteHospitalsContext.Provider 
      value={{ 
        favoriteHospitals, 
        addFavoriteHospital, 
        removeFavoriteHospital, 
        isFavoriteHospital 
      }}
    >
      {children}
    </FavoriteHospitalsContext.Provider>
  );
};

export const useFavoriteHospitals = () => {
  const context = useContext(FavoriteHospitalsContext);
  if (context === undefined) {
    throw new Error('useFavoriteHospitals must be used within a FavoriteHospitalsProvider');
  }
  return context;
};
