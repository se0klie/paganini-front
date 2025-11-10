// src/router/PublicRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Cookies from 'js-cookie';
export const PublicRoute = ({ children }) => {
    // Temporarily disabled auth check for development
    // const { user } = useAuth();

    // if (user || Cookies.get('accessToken') || Cookies.get('refreshToken')) {
    //   return <Navigate to="/" replace />;
    // }

    return children;
};
