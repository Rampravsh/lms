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

export const addModule = createAsyncThunk(
    'courses/addModule',
    async ({ courseId, title }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/courses/${courseId}/modules`, { title });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add module');
        }
    }
);

export const addLesson = createAsyncThunk(
    'courses/addLesson',
    async ({ moduleId, lessonData }, { rejectWithValue }) => {
        try {
            // Updated to match backend route structure if needed, or keep if backend route is actually /api/modules/:id/lessons
            // Looking at courseRoutes.js line 25: router.post('/modules/:moduleId/lessons', ...)
            // It seems correct in my previous reading? Let me double check courseRoutes.js content from history.
            // Ah, line 25 says: router.post('/modules/:moduleId/lessons', ...);
            // This is mounted on /api/courses in app.js? No, wait.
            // app.js: app.use('/api/courses', courseRoutes);
            // So the full path is /api/courses/modules/:moduleId/lessons
            const response = await api.post(`/courses/modules/${moduleId}/lessons`, lessonData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add lesson');
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
            // Add Module
            .addCase(addModule.fulfilled, (state, action) => {
                state.successMessage = 'Module added successfully';
            })
            // Add Lesson
            .addCase(addLesson.fulfilled, (state, action) => {
                state.successMessage = 'Lesson added successfully';
            });
    },
});

export const { clearCourseMessages } = courseSlice.actions;
export default courseSlice.reducer;
