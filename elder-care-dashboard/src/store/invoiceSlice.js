import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios.js';

// Thunk để lấy invoices kèm phân trang
export const fetchInvoice = createAsyncThunk(
    "invoice/fetchInvoice",
    async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
        try {
            const res = await axios.get(`/invoices?page=${page}&limit=${limit}`);
            return res.data; // { invoices, pagination }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchInvoiceForStaff = createAsyncThunk(
    'invoice/fetchInvoiceForStaff',
    async (_id, { rejectWithValue }) => {
        try {
            const res = await axios.get(`/invoices/get-invoice-for-staff/${_id}`);
            return res.data.invoices;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState: {
        data: [],               // danh sách invoice
        pagination: {           // thông tin phân trang
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 1
        },
        loading: false,
        error: null,
        invoices: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInvoice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInvoice.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.invoices;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchInvoice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchInvoiceForStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInvoiceForStaff.fulfilled, (state, action) => {
                state.loading = false;
                state.invoices = action.payload;
            })
            .addCase(fetchInvoiceForStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default invoiceSlice.reducer;
