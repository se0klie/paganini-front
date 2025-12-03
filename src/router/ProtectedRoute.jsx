// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAuth } from '../context/AuthContext';
export const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const hasTokens = Boolean(Cookies.get('accessToken') && Cookies.get('refreshToken'));
    if (!hasTokens) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
