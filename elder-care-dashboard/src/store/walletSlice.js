import axios from "../api/axios.js";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTransactions = createAsyncThunk(
    'wallet/fetchTransactions',
    async (userId, { rejectWithValue }) => {
        try {
            const res = await axios.get(`/wallet/get-transactions/${userId}`);
            // console.log("mmr", res.data.transactions);
            return res.data.transactions;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

const walletSlice = createSlice({
    name: 'wallet',
    initialState: {
        transactions: [],
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
                state.transactions = action.payload;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default walletSlice.reducer;