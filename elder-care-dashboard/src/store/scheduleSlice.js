import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios.js';

export const fetchScheduleForStaff = createAsyncThunk(
    'schedule/fetchScheduleForStaff',
    async (_id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/schedules/get-schedule-staff/${_id}`);
            return response.data.schedule;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState: {
        schedule: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchScheduleForStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchScheduleForStaff.fulfilled, (state, action) => {
                state.loading = false;
                state.schedule = action.payload;
            })
            .addCase(fetchScheduleForStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default scheduleSlice.reducer;