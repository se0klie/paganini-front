// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './style.css';
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProtectedRoute } from "./router/ProtectedRoute.jsx";
import AuthPage from './pages/Login/Login.jsx';
import SignupPage from './pages/Login/Signup.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Invoice from './pages/Invoice/Invoice.jsx';
import Payment from './pages/Payment/Payment.jsx';
import {PublicRoute} from "./router/PublicRoute.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />
          <Route
            path="/invoice"
            element={
              <ProtectedRoute>
                <Invoice />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
