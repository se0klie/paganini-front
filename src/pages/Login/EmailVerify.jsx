import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmailVerificationPage from '../../shared components/EmailVerificationPage.jsx';

export default function EmailVerify() {
    const navigate = useNavigate();

    const handleVerificationSuccess = (data) => {
        // Callback cuando la verificación sea exitosa
        console.log('Email verificado:', data);
    };

    const handleBack = () => {
        navigate('/login');
    };

    return (
        <EmailVerificationPage
            onVerificationSuccess={handleVerificationSuccess}
            onBack={handleBack}
        />
    );
}
