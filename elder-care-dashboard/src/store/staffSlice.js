import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const token = localStorage.getItem('token');

// Thunk để fetch danh sách staff
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

export const deleteStaff = createAsyncThunk(
    'staff, deleteStaff',
    async (staffId, thunkAPI) => {
        try {
            await axios.delete(`http://localhost:5000/api/v1/auth/delete-staff/${staffId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return staffId
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data || "Error delete staff")
        }
    }
)

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
            })
            //delete Staff
            .addCase(deleteStaff.fulfilled, (state, action) => {
                state.staffList = state.staffList.filter(b => b._id !== action.payload);
            })
            .addCase(deleteStaff.rejected, (state, action) => {
                state.error = action.payload || 'Failed to delete staff';
            })

    },
});

export const { clearStaffs } = staffSlice.actions;
export default staffSlice.reducer;