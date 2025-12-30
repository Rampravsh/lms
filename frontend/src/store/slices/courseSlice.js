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

export const fetchAdminDashboard = createAsyncThunk(
    'courses/fetchAdminDashboard',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/dashboard/admin');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin dashboard');
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

export const fetchMyCourses = createAsyncThunk(
    'courses/fetchMyCourses',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/courses/my-courses');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch my courses');
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

export const createCourse = createAsyncThunk(
    'courses/create',
    async (courseData, { rejectWithValue }) => {
        try {
            const response = await api.post('/courses', courseData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create course');
        }
    }
);

export const updateCourse = createAsyncThunk(
    'courses/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/courses/${id}`, data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update course');
        }
    }
);

export const deleteCourse = createAsyncThunk(
    'courses/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/courses/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete course');
        }
    }
);

export const addVideo = createAsyncThunk(
    'courses/addVideo',
    async ({ courseId, videoData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/courses/${courseId}/videos`, videoData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add video');
        }
    }
);

export const enrollCourse = createAsyncThunk(
    'courses/enroll',
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/courses/${courseId}/enroll`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to enroll');
        }
    }
);

export const markVideoCompleted = createAsyncThunk(
    'courses/markVideoCompleted',
    async ({ courseId, videoId }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/courses/${courseId}/videos/${videoId}/complete`);
            return response.data.data; // Returns updated progress
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark video completed');
        }
    }
);

const initialState = {
    dashboard: null,
    courses: [],
    currentCourse: null,
    isLoading: false,
    error: null,
    successMessage: null,
};

const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        clearCourseMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        }
    },
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
            // Admin Dashboard
            .addCase(fetchAdminDashboard.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
                state.isLoading = false;
                state.dashboard = action.payload; // Reusing the 'dashboard' state for both roles
            })
            .addCase(fetchAdminDashboard.rejected, (state, action) => {
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
            // Fetch My Courses
            .addCase(fetchMyCourses.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchMyCourses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courses = action.payload;
            })
            .addCase(fetchMyCourses.rejected, (state, action) => {
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
            })
            // Create Course
            .addCase(createCourse.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courses.push(action.payload);
                state.successMessage = 'Course created successfully';
            })
            // Update Course
            .addCase(updateCourse.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.courses.findIndex(c => c._id === action.payload._id);
                if (index !== -1) state.courses[index] = action.payload;
                if (state.currentCourse?._id === action.payload._id) {
                    state.currentCourse = action.payload;
                }
                state.successMessage = 'Course updated successfully';
            })
            // Delete Course
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courses = state.courses.filter(c => c._id !== action.payload);
                state.successMessage = 'Course deleted successfully';
            })
            // Add Video
            .addCase(addVideo.fulfilled, (state, action) => {
                state.successMessage = 'Video added successfully';
                // Optimistically update currentCourse if it matches
                if (state.currentCourse && state.currentCourse._id === action.payload.course) {
                    state.currentCourse.videos = [...(state.currentCourse.videos || []), action.payload];
                }
            });
    },
});

export const { clearCourseMessages } = courseSlice.actions;
export default courseSlice.reducer;
