import React, { createContext, useState, useContext, ReactNode } from 'react';

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  rating: number;
  reviews: number;
  image: any;
};

interface FavoritesContextType {
  favorites: Doctor[];
  addFavorite: (doctor: Doctor) => void;
  removeFavorite: (doctorId: string) => void;
  isFavorite: (doctorId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Doctor[]>([]);

  const addFavorite = (doctor: Doctor) => {
    setFavorites((prev) => [...prev, doctor]);
  };

  const removeFavorite = (doctorId: string) => {
    setFavorites((prev) => prev.filter((doc) => doc.id !== doctorId));
  };

  const isFavorite = (doctorId: string) => {
    return favorites.some((doc) => doc.id === doctorId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
