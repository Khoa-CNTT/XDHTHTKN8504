import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAllBookings } from '../api/bookings.js';

const token = localStorage.getItem("token");

// Thunk để fetch danh sách bookings
export const fetchBookings = createAsyncThunk(
    'booking/fetchBookings',
    async ({ page = 1, limit = 10 } = {}, thunkAPI) => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/v1/bookings/get-all-bookings?page=${page}&limit=${limit}`
            );
            return res.data
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || 'Error fetching bookings');
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

export const fetchBookingDetail = createAsyncThunk(
    'booking/fetchBookingDetail',
    async (bookingId, { rejectWithValue }) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/v1/bookings/get-booking-detail/${bookingId}`);
            // console.log(res.data.booking);
            return res.data.booking;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error fetching booking detail");
        }
    }
);

const bookingSlice = createSlice({
    name: 'booking',
    initialState: {
        bookings: [],
        loading: false,
        error: null,
        pagination: { totalItems: 0, totalPages: 0, currentPage: 1, pageSize: 10 }, 
        customerBookings: [],
        customerBookingsLoading: false,
        customerBookingsError: null,
        bookingDetail: null,
        bookingDetailLoading: false,
        bookingDetailError: null,
    },
    reducers: {
        clearBookings(state) {
            state.bookings = [];
        },
        clearCustomerBookings(state) {
            state.customerBookings = [];
            state.customerBookingsError = null;
        },
        clearBookingDetail(state) {
            state.bookingDetail = null;
            state.bookingDetailError = null;
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
                state.bookings = action.payload.bookings;
                state.pagination = action.payload.pagination;
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
            })
            // fetch Booking Detail
            .addCase(fetchBookingDetail.pending, (state) => {
                state.bookingDetailLoading = true;
                state.bookingDetailError = null;
            })
            .addCase(fetchBookingDetail.fulfilled, (state, action) => {
                state.bookingDetailLoading = false;
                state.bookingDetail = action.payload;
            })
            .addCase(fetchBookingDetail.rejected, (state, action) => {
                state.bookingDetailLoading = false;
                state.bookingDetailError = action.payload || 'Failed to load booking detail';
            });
    },
});

export const { clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
