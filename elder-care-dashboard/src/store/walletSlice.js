import axios from "../api/axios.js";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTransactions = createAsyncThunk(
    'wallet/fetchTransactions',
    async (userId, { rejectWithValue }) => {
        try {
            const res = await axios.get(`/wallet/get-transactions/${userId}`);
            return res.data; // chứa balance, transactionCount, transactions
        } catch (error) {
            return rejectWithValue(error.response?.data?.msg || error.message);
        }
    }
);

const walletSlice = createSlice({
    name: 'wallet',
    initialState: {
        transactions: [],
        balance: 0,
        transactionCount: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload.transactions;
                state.balance = action.payload.balance;
                state.transactionCount = action.payload.transactionCount;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default walletSlice.reducer;
