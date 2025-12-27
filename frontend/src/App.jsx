import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Analytics from './pages/Analytics';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CoursePlayer from './pages/CoursePlayer';
import Layout from './components/layout/Layout';
import { CourseProvider } from './context/CourseContext';

function App() {
  return (
    <CourseProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId/learn" element={<CoursePlayer />} />

            {/* Placeholder routes */}
            <Route path="/calendar" element={<div className="text-white p-8">Calendar Page</div>} />
            <Route path="/messages" element={<div className="text-white p-8">Messages Page</div>} />
            <Route path="/settings" element={<div className="text-white p-8">Settings Page</div>} />
          </Routes>
        </Layout>
      </Router>
    </CourseProvider>
  );
}

export default App;
