import axios from "axios";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const fetchServices = createAsyncThunk(
    "services/fetchServices",
    async () => {
        const response = await axios.get('http://localhost:5000/api/v1/services/get-services');
        return response.data.service;
    }
);

const servicesSlice = createSlice({
    name: "services",
    initialState: {
        services: [],
        status: "idle",
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchServices.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.services = action.payload;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    }
});

export { fetchServices };
export default servicesSlice.reducer;