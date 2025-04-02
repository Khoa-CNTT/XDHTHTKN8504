import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

interface Booking {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: any;
  clinic: string;
  date: string;
  time: string;
  status: BookingStatus;
  review?: { rating: number; comment: string };
}

interface BookingsContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'status'>) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  completeBooking: (id: string) => Promise<void>;
  addReview: (bookingId: string, review: { rating: number; comment: string }) => Promise<void>;
}

const BookingsContext = createContext<BookingsContextType | undefined>(undefined);

export const useBookings = () => {
  const context = useContext(BookingsContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingsProvider');
  }
  return context;
};

export const BookingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const storedBookings = await AsyncStorage.getItem('bookings');
      if (storedBookings) {
        const parsedBookings = JSON.parse(storedBookings) as Booking[];
        setBookings(parsedBookings);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const saveBookings = async (updatedBookings: Booking[]) => {
    try {
      await AsyncStorage.setItem('bookings', JSON.stringify(updatedBookings));
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error saving bookings:', error);
    }
  };

  const addBooking = async (newBooking: Omit<Booking, 'id' | 'status'>) => {
    const booking: Booking = {
      ...newBooking,
      id: Date.now().toString(),
      status: 'upcoming' as const,
    };
    const updatedBookings = [...bookings, booking];
    await saveBookings(updatedBookings);
  };

  const cancelBooking = async (id: string) => {
    const updatedBookings = bookings.map(booking =>
      booking.id === id ? { ...booking, status: 'cancelled' as const } : booking
    );
    await saveBookings(updatedBookings);
  };

  const completeBooking = async (id: string) => {
    const updatedBookings = bookings.map(booking =>
      booking.id === id ? { ...booking, status: 'completed' as const } : booking
    );
    await saveBookings(updatedBookings);
  };

  const addReview = async (bookingId: string, review: { rating: number; comment: string }) => {
    const updatedBookings = bookings.map(booking =>
      booking.id === bookingId ? { ...booking, review } : booking
    );
    await saveBookings(updatedBookings);
  };

  return (
    <BookingsContext.Provider value={{ bookings, addBooking, cancelBooking, completeBooking, addReview }}>
      {children}
    </BookingsContext.Provider>
  );
};