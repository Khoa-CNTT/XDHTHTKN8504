import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios.js';

const token = localStorage.getItem('token');

// Thunk để fetch danh sách staff
export const fetchStaffList = createAsyncThunk(
    'staff/fetchStaffList',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get('/auth/get-staff');
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
            await axios.delete(`/auth/delete-staff/${staffId}`, {
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

export const fetchStaffById = createAsyncThunk(
    'staff/fetchStaffById',
    async (_id, { rejectWithValue }) => {
        try {
            const res = await axios.get(`/auth/get-staff-id/${_id}`);
            console.log("ddd", res.data);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Lỗi không xác định');
        }
    }
)

export const changeStaffPassword = createAsyncThunk(
    'staff/changeStaffPassword',
    async ({ userId, oldPassword, newPassword }, { rejectWithValue }) => {
        try {
            const res = await axios.patch(
                `/auth/change-password-by-admin/${userId}`,
                { oldPassword, newPassword },
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Lỗi đổi mật khẩu' });
        }
    }
);

export const countStaffInLast12Months = createAsyncThunk(
    'staff/countStaffInLast12Months',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get('/auth/count-staff');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
)

const staffSlice = createSlice({
    name: 'staff',
    initialState: {
        staffList: [],
        selectedStaff: null,
        loading: false,
        error: null,
        changePasswordStatus: 'idle',
        changePasswordError: null,
        staffCount: null,
        staffCountLoading: false,
        staffCountError: null,
    },
    reducers: {
        clearStaffs(state) {
            state.staffList = [];
            state.selectedStaff = null;
            state.error = null;
        },
        clearChangePasswordStatus(state) {
            state.changePasswordStatus = 'idle';
            state.changePasswordError = null;
        },
        clearStaffCount(state) {
            state.staffCount = null;
            state.staffCountError = null;
        }
    },
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
            // Fetch chi tiết nhân viên
            .addCase(fetchStaffById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selectedStaff = null;
            })
            .addCase(fetchStaffById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedStaff = action.payload;
            })
            .addCase(fetchStaffById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Lỗi khi lấy thông tin nhân viên';
            })
            // Change staff password
            .addCase(changeStaffPassword.pending, (state) => {
                state.changePasswordStatus = 'loading';
                state.changePasswordError = null;
            })
            .addCase(changeStaffPassword.fulfilled, (state) => {
                state.changePasswordStatus = 'succeeded';
            })
            .addCase(changeStaffPassword.rejected, (state, action) => {
                state.changePasswordStatus = 'failed';
                state.changePasswordError = action.payload?.message || 'Lỗi đổi mật khẩu';
            })
            // Count staff in last 12 months
            .addCase(countStaffInLast12Months.pending, (state) => {
                state.staffCountLoading = true;
                state.staffCountError = null;
            })
            .addCase(countStaffInLast12Months.fulfilled, (state, action) => {
                state.staffCountLoading = false;
                state.staffCount = action.payload;
            })
            .addCase(countStaffInLast12Months.rejected, (state, action) => {
                state.staffCountLoading = false;
                state.staffCountError = action.payload || 'Lỗi khi đếm số lượng nhân viên';
            });
    },
});

export const { clearStaffs } = staffSlice.actions;
export default staffSlice.reducer;