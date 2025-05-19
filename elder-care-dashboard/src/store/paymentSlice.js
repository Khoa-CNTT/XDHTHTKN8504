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
            const response = await axios.get(`/payment/get-salary/${_id}`,);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const fetchAllPayment = createAsyncThunk(
    'payments/fetchAllPayment',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/payment/get-all');
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
)

export const fetchPaymentCounts = createAsyncThunk(
    'payments/fetchPaymentCounts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/payment/count-payments');
            console.log("count", response.data);            
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const countTotalAmountMonth = createAsyncThunk(
    'payments/countTotalAmountMonth',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get('/payment/count-revenue');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
)

export const countTotalMonthRevenue = createAsyncThunk(
    'payments/countTotalMonthRevenue',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get('/payment/get-total-month-revenue');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
)

const paymentSlice = createSlice({
    name: 'payments',
    initialState: {
        data: [],
        salary: null,
        loading: false,
        error: null,
        salaryLoading: false,
        salaryError: null,
        allPayments: [],
        allPaymentsLoading: false,
        allPaymentsError: null,
        paymentCounts: null,
        paymentCountsLoading: false,
        paymentCountsError: null,
        totalAmountMonth: null,
        totalAmountMonthLoading: false,
        totalAmountMonthError: null,
        totalMonthRevenue: null,
        totalMonthRevenueLoading: false,
        totalMonthRevenueError: null,
    },
    reducers: {
        clearPayments: (state) => {
            state.data = [];
            state.salary = 0;
            state.allPayments = [];
            state.loading = false;
            state.error = null;
            state.paymentCounts = null;
            state.paymentCountsLoading = false;
            state.paymentCountsError = null;
            state.totalAmountMonth = null;
            state.totalAmountMonthLoading = false;
            state.totalAmountMonthError = null;
            state.totalMonthRevenue = null;
            state.totalMonthRevenueLoading = false;
            state.totalMonthRevenueError = null;
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
                state.salary = action.payload;
            })
            .addCase(fetchSalaryByStaff.rejected, (state, action) => {
                state.salaryLoading = false;
                state.salaryError = action.payload;
            })

            .addCase(fetchAllPayment.pending, (state) => {
                state.allPaymentsLoading = true;
                state.allPaymentsError = null;
            })
            .addCase(fetchAllPayment.fulfilled, (state, action) => {
                state.allPaymentsLoading = false;
                state.allPayments = action.payload;
            })
            .addCase(fetchAllPayment.rejected, (state, action) => {
                state.allPaymentsLoading = false;
                state.allPaymentsError = action.payload;
            })

            // fetch payment counts
            .addCase(fetchPaymentCounts.pending, (state) => {
                state.paymentCountsLoading = true;
                state.paymentCountsError = null;
            })
            .addCase(fetchPaymentCounts.fulfilled, (state, action) => {
                state.paymentCountsLoading = false;
                state.paymentCounts = action.payload;
            })
            .addCase(fetchPaymentCounts.rejected, (state, action) => {
                state.paymentCountsLoading = false;
                state.paymentCountsError = action.payload;
            })

            // countTotalAmountMonth
            .addCase(countTotalAmountMonth.pending, (state) => {
                state.totalAmountMonthLoading = true;
                state.totalAmountMonthError = null;
            })
            .addCase(countTotalAmountMonth.fulfilled, (state, action) => {
                state.totalAmountMonthLoading = false;
                state.totalAmountMonth = action.payload;
            })
            .addCase(countTotalAmountMonth.rejected, (state, action) => {
                state.totalAmountMonthLoading = false;
                state.totalAmountMonthError = action.payload;
            })

            // countTotalMonthRevenue
            .addCase(countTotalMonthRevenue.pending, (state) => {
                state.totalMonthRevenueLoading = true;
                state.totalMonthRevenueError = null;
            })
            .addCase(countTotalMonthRevenue.fulfilled, (state, action) => {
                state.totalMonthRevenueLoading = false;
                state.totalMonthRevenue = action.payload;
            })
            .addCase(countTotalMonthRevenue.rejected, (state, action) => {
                state.totalMonthRevenueLoading = false;
                state.totalMonthRevenueError = action.payload;
            });
    },
});

export const { clearPayments } = paymentSlice.actions;
export default paymentSlice.reducer;
