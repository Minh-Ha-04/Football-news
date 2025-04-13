import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '~/contexts/AuthContext';

function ProtectedRoute({ children, requiredRole }) {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Nếu chưa đăng nhập, chuyển hướng đến trang home
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Nếu có yêu cầu role cụ thể và user không có role đó
    if (requiredRole && user?.role !== requiredRole) {
        // Chuyển hướng đến trang chủ nếu không có quyền truy cập
        return <Navigate to="/" replace />;
    }

    // Nếu đã đăng nhập và có quyền truy cập, render children
    return children;
}

export default ProtectedRoute; 