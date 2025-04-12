import { Navigate } from 'react-router-dom';
import { useAuth } from '~/contexts/AuthContext';
import config from '~/config';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Hoặc có thể thay bằng component Loading
    }

    if (!isAuthenticated) {
        return <Navigate to={config.routes.login} replace />;
    }

    return children;
};

export default ProtectedRoute; 