import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCustomers = createAsyncThunk(
    'customers/fetchCustomers',
    async () => {
        const response = await axios.get('http://localhost:5000/api/v1/auth/get-customer'); 
        return response.data.data;
    }
);

const customerSlice = createSlice({
    name: 'customers',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {
        addCustomer: (state, action) => {
            state.data.push(action.payload);
        },
        removeCustomer: (state, action) => {
            state.data = state.data.filter(cus => cus._id !== action.payload);
        },
        updateCustomer: (state, action) => {
            const index = state.data.findIndex(cus => cus._id === action.payload._id);
            if (index !== -1) {
                state.data[index] = action.payload;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { addCustomer, removeCustomer, updateCustomer } = customerSlice.actions;
export default customerSlice.reducer;