import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from '../store/bookingSlice.js';

export const store = configureStore({
    reducer: {
        booking: bookingReducer,
        
    }
})