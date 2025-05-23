import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

export const fetchReviewForStaff = createAsyncThunk(
    'review/fetchReviewForStaff',
    async (staffId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/reviews/get-review-staff/${staffId}`);
            return response.data.reviews;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const reviewSlice = createSlice({
    name: 'review',
    initialState: {
        reviews: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviewForStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviewForStaff.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(fetchReviewForStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default reviewSlice.reducer;