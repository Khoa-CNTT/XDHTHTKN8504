import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios.js';

export const fetchPaymentsByStaff = createAsyncThunk(
    'payments/fetchByStaff',
    async (_id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/payment/get-payments/${_id}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const fetchSalaryByStaff = createAsyncThunk(
    'payments/fetchSalaryByStaff',
    async (_id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/payment/get-salary/${_id}`);
            return response.data; // giả sử { salary: 15000000 }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const paymentSlice = createSlice({
    name: 'payments',
    initialState: {
        data: [],
        salary: 0,
        loading: false,
        error: null,
        salaryLoading: false,
        salaryError: null,
    },
    reducers: {
        clearPayments: (state) => {
            state.data = [];
            state.salary = 0;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPaymentsByStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPaymentsByStaff.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchPaymentsByStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetch salary
            .addCase(fetchSalaryByStaff.pending, (state) => {
                state.salaryLoading = true;
                state.salaryError = null;
            })
            .addCase(fetchSalaryByStaff.fulfilled, (state, action) => {
                state.salaryLoading = false;
                state.salary = action.payload.salary;
            })
            .addCase(fetchSalaryByStaff.rejected, (state, action) => {
                state.salaryLoading = false;
                state.salaryError = action.payload;
            });
    },
});

export const { clearPayments } = paymentSlice.actions;
export default paymentSlice.reducer;
