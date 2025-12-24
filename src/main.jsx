// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './style.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute } from './router/ProtectedRoute.jsx';
import AuthPage from './pages/Login/Login.jsx';
import SignupPage from './pages/Login/Signup.jsx';
import EmailVerify from './pages/Login/EmailVerify.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Invoice from './pages/Invoice/Invoice.jsx';
import Payment from './pages/Payment/Payment.jsx';
import Subscriptions from './pages/Subscriptions/Subscriptions.jsx';
import Contacts from './pages/Contacts/Contacts.jsx';
import { PublicRoute } from './router/PublicRoute.jsx';
import AccountMainPage from './pages/Account/AccountMain.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
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
                        path="/account"
                        element={
                            <PublicRoute>
                                <AccountMainPage />
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
                        path="/verify-email"
                        element={
                            <PublicRoute>
                                <EmailVerify />
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
                    <Route
                        path="/payment"
                        element={
                            <ProtectedRoute>
                                <Payment />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/subscriptions"
                        element={
                            <ProtectedRoute>
                                <Subscriptions />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/contacts"
                        element={
                            <ProtectedRoute>
                                <Contacts />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>
);
