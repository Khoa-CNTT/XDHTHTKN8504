import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios.js';

export const fetchInvoice = createAsyncThunk(
    "invoice/fetchInvoice",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get("/invoices/");
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState: {
        data: [],
        loading: false,
        error: null,
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
                state.data = action.payload;
            })
            .addCase(fetchInvoice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default invoiceSlice.reducer;