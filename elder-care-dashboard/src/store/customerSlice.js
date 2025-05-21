import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios.js';

export const fetchCustomers = createAsyncThunk(
    'customers/fetchCustomers',
    async () => {
        const response = await axios.get('/auth/get-customer');
        return response.data.data;
    }
);

export const deleteCustomerByAdmin = createAsyncThunk(
    'customers/deleteCustomerByAdmin',
    async (customerId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/auth/delete-customer/${customerId}`);
            return { customerId, message: response.data.message };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchCustomerCounts = createAsyncThunk(
    'customers/fetchCustomerCounts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/auth/count-customers');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchCustomerById = createAsyncThunk(
    'customers/fetchCustomerById',
    async (customerId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/auth/get-customer-info/${customerId}`);
            return response.data.customer;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const searchCustomers = createAsyncThunk(
    'customers/searchCustomers',
    async (filters, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams(filters).toString();
            const response = await axios.get(`/auth/search-customer?${params}`);
            console.log(response.data.data);            
            return response.data.reviews;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const customerSlice = createSlice({
    name: 'customers',
    initialState: {
        data: [],
        loading: false,
        error: null,
        counts: null,
        selectedCustomer: null,
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
            })
            .addCase(deleteCustomerByAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCustomerByAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.data = state.data.filter(cus => cus._id !== action.payload.customerId);
            })
            .addCase(deleteCustomerByAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(fetchCustomerCounts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomerCounts.fulfilled, (state, action) => {
                state.loading = false;
                state.counts = action.payload;
            })
            .addCase(fetchCustomerCounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(fetchCustomerById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selectedCustomer = null;
            })
            .addCase(fetchCustomerById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCustomer = action.payload;
            })
            .addCase(fetchCustomerById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.selectedCustomer = null;
            })
            .addCase(searchCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(searchCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
    },
});

export const { addCustomer, removeCustomer, updateCustomer } = customerSlice.actions;
export default customerSlice.reducer;