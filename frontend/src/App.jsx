import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Analytics from './pages/Analytics';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CoursePlayer from './pages/CoursePlayer';
import Calendar from './pages/Calendar';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OTPVerification from './pages/OTPVerification';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute from './components/auth/RoleRoute';
import { AuthProvider } from './context/AuthContext';
import AdminCourses from './pages/admin/AdminCourses';
import CourseEditor from './pages/admin/CourseEditor';
import { useDispatch } from 'react-redux';
import { loadUser } from './store/slices/authSlice';
import { useEffect } from 'react';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<OTPVerification />} />

          {/* Public Routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId/learn" element={<CoursePlayer />} />

            {/* Protected Routes inside Layout */}
            <Route element={<ProtectedRoute />}>
              {/* Admin Only Route */}
              <Route element={<RoleRoute allowedRoles={['admin', 'instructor']} />}>
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/admin/courses" element={<AdminCourses />} />
                <Route path="/admin/courses/:id" element={<CourseEditor />} />
                <Route path="/admin/courses/:id/edit" element={<CourseEditor />} />
              </Route>

              <Route path="/calendar" element={<Calendar />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
