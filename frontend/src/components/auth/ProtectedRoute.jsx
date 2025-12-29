import { Loader } from 'lucide-react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';  

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader className="animate-spin text-mint-500" size={40} />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
