import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Analytics from './pages/Analytics';
import Dashboard from './pages/Dashboard';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          {/* Placeholder routes for now */}
          <Route path="/courses" element={<div className="text-white">Courses Page</div>} />
          <Route path="/calendar" element={<div className="text-white">Calendar Page</div>} />
          <Route path="/messages" element={<div className="text-white">Messages Page</div>} />
          <Route path="/settings" element={<div className="text-white">Settings Page</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
