import axios from 'axios';

const api = axios.create({
    // Use environment variable for API URL in production (e.g. Render backend)
    // Fallback to dynamic hostname for local development (supports mobile/network IP)
    baseURL: import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000/api`,
    withCredentials: true, // Send cookies with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token from localStorage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optional: Clear token and redirect to login
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
