import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import axios from '../api/axios.js';

export const countBookingsLast12Months = createAsyncThunk(
    'dashboard/countBookingsLast12Months',
    async(_, { rejectWithValue }) => {
        try {
            const res = await axios.get('/bookings/count-bookings');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
)

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        bookingsLast12Months: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(countBookingsLast12Months.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(countBookingsLast12Months.fulfilled, (state, action) => {
                state.loading = false;
                state.bookingsLast12Months = action.payload;
            })
            .addCase(countBookingsLast12Months.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default dashboardSlice.reducer;