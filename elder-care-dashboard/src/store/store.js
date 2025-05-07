import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from '../store/bookingSlice.js';
import serviceReducer from '../store/serviceSlice.js';

export const store = configureStore({
    reducer: {
        booking: bookingReducer,
        service: serviceReducer,
    }
})