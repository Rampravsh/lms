import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async Thunks
export const fetchStudentDashboard = createAsyncThunk(
    'courses/fetchDashboard',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/dashboard/student');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard');
        }
    }
);

export const fetchCourses = createAsyncThunk(
    'courses/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/courses');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
        }
    }
);

export const fetchCourseById = createAsyncThunk(
    'courses/fetchById',
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/courses/${courseId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch course');
        }
    }
);

const initialState = {
    dashboard: null,
    courses: [],
    currentCourse: null,
    isLoading: false,
    error: null,
};

const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Dashboard
            .addCase(fetchStudentDashboard.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchStudentDashboard.fulfilled, (state, action) => {
                state.isLoading = false;
                state.dashboard = action.payload;
            })
            .addCase(fetchStudentDashboard.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch All Courses
            .addCase(fetchCourses.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courses = action.payload;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch Course By ID
            .addCase(fetchCourseById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCourseById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentCourse = action.payload;
            })
            .addCase(fetchCourseById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default courseSlice.reducer;
