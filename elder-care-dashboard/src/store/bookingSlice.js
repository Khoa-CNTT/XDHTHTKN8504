import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAllBookings } from '../api/bookings.js';

const token = localStorage.getItem("token");

// Thunk để fetch danh sách bookings
export const fetchBookings = createAsyncThunk(
    'booking/fetchBookings',
    async (_, thunkAPI) => {
        try {
            const res = await axios.get('http://localhost:5000/api/v1/bookings/get-all-bookings');
            return res.data.bookings;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data || 'Error fetching bookings');
        }
    }
);

export const deleteBooking = createAsyncThunk(
    'booking/deleteBooking',
    async (bookingId, thunkAPI) => {
        try {
            await axios.delete(`http://localhost:5000/api/v1/bookings/delete-booking/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return bookingId
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data || "Error delete booking")
        }
    }
)

export const fetchBookingForCustomer = createAsyncThunk(
    'booking/fetchBookingForCustomer',
    async (userId, { rejectWithValue }) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/v1/bookings/get-booking-customer/${userId}`);
            console.log("fff", res.data.data);
            
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data || "Error fetch booking!")
        }
    }
)

const bookingSlice = createSlice({
    name: 'booking',
    initialState: {
        bookings: [],
        loading: false,
        error: null,
        customerBookings: [],
        customerBookingsLoading: false,
        customerBookingsError: null,
    },
    reducers: {
        clearBookings(state) {
            state.bookings = [];
        },
        clearCustomerBookings(state) {
            state.customerBookings = [];
            state.customerBookingsError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch Bookings  
            .addCase(fetchBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(fetchBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to load bookings';
            })
            // delete Booking
            .addCase(deleteBooking.fulfilled, (state, action) => {
                state.bookings = state.bookings.filter(b => b._id !== action.payload);
            })
            .addCase(deleteBooking.rejected, (state, action) => {
                state.error = action.payload || 'Failed to delete booking';
            })
            // fetch Booking For Customer
            .addCase(fetchBookingForCustomer.pending, (state) => {
                state.customerBookingsLoading = true;
                state.customerBookingsError = null;
            })
            .addCase(fetchBookingForCustomer.fulfilled, (state, action) => {
                state.customerBookingsLoading = false;
                state.customerBookings = action.payload;
            })
            .addCase(fetchBookingForCustomer.rejected, (state, action) => {
                state.customerBookingsLoading = false;
                state.customerBookingsError = action.payload || 'Failed to load customer bookings';
            });
    },
});

export const { clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
