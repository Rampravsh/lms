import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RoleRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    // If not logged in, ProtectedRoute should have caught this, but double check
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; // Redirect unauthorized users to dashboard
    }

    return <Outlet />;
};

export default RoleRoute;
