import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk để fetch danh sách bookings
export const fetchStaffList = createAsyncThunk(
    'staff/fetchStaffList',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get('http://localhost:5000/api/v1/auth/get-staff');
            return res.data.data; 
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const staffSlice = createSlice({
    name: 'staff',
    initialState: {
        staffList: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStaffList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStaffList.fulfilled, (state, action) => {
                state.loading = false;
                state.staffList = action.payload;
            })
            .addCase(fetchStaffList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Lỗi không xác định';
            });
    },
});

// export const { clearStaffs } = staffSlice.actions;
export default staffSlice.reducer;