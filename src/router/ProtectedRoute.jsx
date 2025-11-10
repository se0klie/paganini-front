// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
// import { useAuth } from '../context/AuthContext';
export const ProtectedRoute = ({ children }) => {
    // Temporarily disabled auth check for development
    // const { user } = useAuth();

    // if (!user && !Cookies.get('accessToken') && !Cookies.get('refreshToken')) {
    //     return <Navigate to="/login" replace />;
    // }

    return children;
};
