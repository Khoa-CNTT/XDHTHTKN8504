import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAllBookings } from '../api/bookings.js';

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

const bookingSlice = createSlice({
    name: 'booking',
    initialState: {
        bookings: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearBookings(state) {
            state.bookings = [];
        },
    },
    extraReducers: (builder) => {
        builder
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
            });
    },
});

export const { clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
