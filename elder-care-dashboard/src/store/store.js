import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from '../store/bookingSlice.js';
import serviceReducer from '../store/serviceSlice.js';
import staffReducer from '../store/staffSlice.js';

export const store = configureStore({
    reducer: {
        booking: bookingReducer,
        service: serviceReducer,
        staff: staffReducer,
    }
})