import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from '../store/bookingSlice.js';
import serviceReducer from '../store/serviceSlice.js';
import staffReducer from '../store/staffSlice.js';
import customerReducer from '../store/customerSlice.js'
import paymentReducer from '../store/paymentSlice.js'
import scheduleReducer from '../store/scheduleSlice.js'
import walletReducer from '../store/walletSlice.js'

export const store = configureStore({
    reducer: {
        booking: bookingReducer,
        service: serviceReducer,
        staff: staffReducer,
        customers: customerReducer,
        payment: paymentReducer,
        schedule: scheduleReducer,
        wallet: walletReducer
    }
})