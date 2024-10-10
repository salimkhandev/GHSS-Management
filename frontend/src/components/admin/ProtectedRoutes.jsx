// ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? children : <Navigate to="/admin" />;
}

export default ProtectedRoute;
