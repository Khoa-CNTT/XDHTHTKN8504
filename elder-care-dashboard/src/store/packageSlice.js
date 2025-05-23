import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios.js';

export const createPackage = createAsyncThunk(
    'packages/createPackage',
    async (packageData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/packages/create', packageData);
            return response.data.package;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const getAllPackagesByAdmin = createAsyncThunk(
    'packages/getAllPackagesByAdmin',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/packages/get-all');
            return response.data.packages;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const updatePackage = createAsyncThunk(
    'packages/updatePackage',
    async ({ id, updateData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/packages/${id}`, updateData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const deletePackage = createAsyncThunk(
    'packages/deletePackage',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`/packages/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

const packageSlice = createSlice({
    name: 'packages',
    initialState: {
        packages: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get all packages
            .addCase(getAllPackagesByAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPackagesByAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.packages = action.payload;
            })
            .addCase(getAllPackagesByAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
            })

            // Create package
            .addCase(createPackage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPackage.fulfilled, (state, action) => {
                state.loading = false;
                state.packages.push(action.payload);
            })
            .addCase(createPackage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
            })

            // Update package
            .addCase(updatePackage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePackage.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                state.packages = state.packages.map(pkg =>
                    pkg._id === updated._id ? updated : pkg
                );
            })
            .addCase(updatePackage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
            })

            // Delete package
            .addCase(deletePackage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePackage.fulfilled, (state, action) => {
                state.loading = false;
                state.packages = state.packages.filter(pkg => pkg._id !== action.payload);
            })
            .addCase(deletePackage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
            });
    },
});

export default packageSlice.reducer;