// src/router/PublicRoute.jsx
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAuth } from '../context/AuthContext.jsx';
export const PublicRoute = ({ children }) => {
    const { user } = useAuth();
    const hasTokens = Boolean(Cookies.get('accessToken') && Cookies.get('refreshToken'));
    if (hasTokens) {
        return <Navigate to="/" replace />;
    }

    return children;
};
