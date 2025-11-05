// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Cookies from "js-cookie";
export const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

  if (!user && !Cookies.get('accessToken') && !Cookies.get('refreshToken')) {
        return <Navigate to="/login" replace />;
    }
    
    return children;


};
