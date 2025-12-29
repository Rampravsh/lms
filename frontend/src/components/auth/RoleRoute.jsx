import { Loader } from 'lucide-react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';  

const RoleRoute = ({ allowedRoles }) => {
    const { user, isLoading } = useSelector((state) => state.auth);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader className="animate-spin text-mint-500" size={40} />
            </div>
        );
    }

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
