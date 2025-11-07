import React, { useState, useRef } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    Fade,
    Zoom,
    Card,
    CardContent
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

// Código de prueba quemado (para testing)
const VALID_CODE = '123456';

export default function EmailVerificationPage({ onVerificationSuccess, onBack }) {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: email, 2: código, 3: éxito
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [codeValues, setCodeValues] = useState(Array(6).fill(''));
    const [codeError, setCodeError] = useState('');
    const [showCode, setShowCode] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const inputsRef = useRef([]);

    // Validar email (misma validación que Signup)
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Manejar envío de email
    const handleSendCode = () => {
        setEmailError('');
        
        if (!email.trim()) {
            setEmailError('Por favor ingresa tu correo electrónico');
            return;
        }

        if (!validateEmail(email)) {
            setEmailError('Ingrese un correo electrónico válido.');
            return;
        }

        // Simular envío de código (delay de 1 segundo)
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setStep(2);
            // Auto-focus en el primer campo del código
            setTimeout(() => {
                if (inputsRef.current[0]) inputsRef.current[0].focus();
            }, 100);
        }, 1000);
    };

    // Manejar cambio en campos de código
    const handleCodeChange = (e, index) => {
        const raw = e.target.value;
        const char = raw.replace(/\D/g, "").slice(0, 1);

        const newValues = [...codeValues];
        newValues[index] = char;
        setCodeValues(newValues);
        setCodeError('');

        if (char && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    // Manejar teclas en campos de código
    const handleCodeKeyDown = (e, index) => {
        const key = e.key;

        if (key === "Backspace") {
            if (codeValues[index]) {
                const newValues = [...codeValues];
                newValues[index] = "";
                setCodeValues(newValues);
            } else if (index > 0) {
                inputsRef.current[index - 1]?.focus();
            }
        }

        if (key === "ArrowLeft" && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }

        if (key === "ArrowRight" && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    // Manejar pegar código
    const handlePaste = (e) => {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData("text");
        const digits = paste.replace(/\D/g, "").slice(0, 6).split("");
        if (digits.length === 0) return;

        const newValues = Array(6).fill("");
        digits.forEach((d, i) => (newValues[i] = d));
        setCodeValues(newValues);

        const lastIndex = Math.min(digits.length, 6) - 1;
        inputsRef.current[lastIndex]?.focus();
    };

    // Verificar código
    const handleVerifyCode = () => {
        const code = codeValues.join("");
        
        if (code.length !== 6) {
            setCodeError('Por favor ingresa el código completo de 6 dígitos');
            return;
        }

        setIsVerifying(true);
        
        // Simular verificación (delay de 1.5 segundos)
        setTimeout(() => {
            // Validar código (en producción esto sería con el backend)
            if (code === VALID_CODE) {
                setCodeError('');
                setStep(3);
                // Llamar callback si existe
                if (onVerificationSuccess) {
                    onVerificationSuccess({ email, verified: true });
                }
            } else {
                setCodeError('Código incorrecto. Inténtalo de nuevo.');
                setCodeValues(Array(6).fill(''));
                setIsVerifying(false);
                if (inputsRef.current[0]) inputsRef.current[0].focus();
            }
        }, 1500);
    };


    return (
        <Box sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'var(--color-primary)',
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Efecto de fondo animado */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, var(--color-primary) 0%, rgba(0,0,0,0.3) 100%)',
                opacity: 0.5,
                zIndex: 0
            }} />

            <Typography
                sx={{
                    fontWeight: 600,
                    fontSize: '2.5em',
                    color: 'white',
                    mb: 4,
                    position: 'relative',
                    zIndex: 1,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}
            >
                Paganini
            </Typography>

            <Card
                elevation={10}
                sx={{
                    width: '100%',
                    maxWidth: '500px',
                    borderRadius: 3,
                    position: 'relative',
                    zIndex: 1,
                    overflow: 'visible',
                    background: 'var(--color-surface)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    {/* Paso 1: Ingresar Email */}
                    {step === 1 && (
                        <Fade in={step === 1}>
                            <Stack spacing={3} alignItems="center">
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        bgcolor: 'var(--color-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    <EmailIcon sx={{ fontSize: 40, color: 'white' }} />
                                </Box>

                                <Typography variant="h5" fontWeight={700} textAlign="center" sx={{ color: 'var(--color-primary)' }}>
                                    Verificar Email
                                </Typography>

                                <Typography variant="body2" textAlign="center" sx={{ color: 'var(--color-text-muted)', mb: 2 }}>
                                    Ingresa tu correo electrónico para recibir un código de verificación
                                </Typography>

                                <TextField
                                    fullWidth
                                    label="Correo electrónico"
                                    placeholder="ejemplo@correo.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setEmailError('');
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSendCode();
                                        }
                                    }}
                                    error={!!emailError}
                                    helperText={emailError}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <EmailIcon sx={{ mr: 1, color: 'var(--color-text-muted)' }} />
                                        )
                                    }}
                                />

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleSendCode}
                                    disabled={isVerifying || !email.trim()}
                                    sx={{
                                        background: 'var(--color-secondary)',
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                        '&:hover': {
                                            background: 'var(--color-secondary-dark)',
                                            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                                        },
                                        '&:disabled': {
                                            background: 'var(--color-text-muted)',
                                        }
                                    }}
                                >
                                    {isVerifying ? 'Enviando...' : 'Enviar código'}
                                </Button>

                                <Button
                                    variant="text"
                                    onClick={() => navigate('/signup')}
                                    sx={{
                                        color: 'var(--color-text-muted)',
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Regresar
                                </Button>
                            </Stack>
                        </Fade>
                    )}

                    {/* Paso 2: Ingresar Código */}
                    {step === 2 && (
                        <Fade in={step === 2}>
                            <Stack spacing={3} alignItems="center">
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        bgcolor: 'var(--secondary-accent)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                        animation: 'pulse 2s infinite'
                                    }}
                                >
                                    <VerifiedUserIcon sx={{ fontSize: 40, color: 'white' }} />
                                </Box>

                                <Typography variant="h5" fontWeight={700} textAlign="center" sx={{ color: 'var(--color-primary)' }}>
                                    Ingresa el código
                                </Typography>

                                <Typography variant="body2" textAlign="center" sx={{ color: 'var(--color-text-muted)', mb: 1 }}>
                                    Hemos enviado un código de 6 dígitos a:
                                </Typography>

                                <Typography variant="body2" fontWeight={600} textAlign="center" sx={{ color: 'var(--color-primary)', mb: 3 }}>
                                    {email}
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 2,
                                        justifyContent: 'center',
                                        width: '100%',
                                        mb: 2
                                    }}
                                    onPaste={handlePaste}
                                >
                                    {codeValues.map((digit, index) => (
                                        <TextField
                                            key={index}
                                            inputRef={(el) => (inputsRef.current[index] = el)}
                                            value={digit}
                                            onChange={(e) => handleCodeChange(e, index)}
                                            onKeyDown={(e) => handleCodeKeyDown(e, index)}
                                            type={showCode ? "text" : "password"}
                                            sx={{
                                                flex: 1,
                                                maxWidth: '60px',
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    textAlign: 'center',
                                                    fontSize: '1.5rem',
                                                    fontWeight: 600,
                                                    '& input': {
                                                        textAlign: 'center',
                                                        letterSpacing: '0.5em',
                                                        padding: '1rem 0'
                                                    }
                                                }
                                            }}
                                            inputProps={{
                                                maxLength: 1,
                                                inputMode: "numeric",
                                                pattern: "[0-9]*",
                                                "aria-label": `Código dígito ${index + 1}`,
                                            }}
                                        />
                                    ))}
                                </Box>

                                {codeError && (
                                    <Typography variant="body2" sx={{ color: 'error.main', textAlign: 'center' }}>
                                        {codeError}
                                    </Typography>
                                )}

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => setShowCode(!showCode)}
                                    sx={{
                                        borderColor: 'var(--button-prev-action)',
                                        color: 'var(--color-text-primary)',
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderColor: 'var(--button-prev-action-dark)',
                                        }
                                    }}
                                >
                                    {showCode ? 'Ocultar código' : 'Mostrar código'}
                                </Button>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleVerifyCode}
                                    disabled={isVerifying || codeValues.includes("") || codeValues.join("").length !== 6}
                                    sx={{
                                        background: 'var(--color-secondary)',
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                        '&:hover': {
                                            background: 'var(--color-secondary-dark)',
                                            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                                        },
                                        '&:disabled': {
                                            background: 'var(--color-text-muted)',
                                        }
                                    }}
                                >
                                    {isVerifying ? 'Verificando...' : 'Verificar código'}
                                </Button>

                                <Button
                                    variant="text"
                                    onClick={() => {
                                        setStep(1);
                                        setCodeValues(Array(6).fill(''));
                                        setCodeError('');
                                    }}
                                    sx={{
                                        color: 'var(--color-text-muted)',
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Cambiar email
                                </Button>
                            </Stack>
                        </Fade>
                    )}

                    {/* Paso 3: Éxito */}
                    {step === 3 && (
                        <Zoom in={step === 3}>
                            <Stack spacing={3} alignItems="center" sx={{ py: 4 }}>
                                <Box
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        borderRadius: '50%',
                                        bgcolor: '#4caf50',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                        boxShadow: '0 8px 30px rgba(76, 175, 80, 0.4)',
                                        animation: 'scaleIn 0.5s ease-out',
                                        '@keyframes scaleIn': {
                                            '0%': {
                                                transform: 'scale(0)',
                                                opacity: 0
                                            },
                                            '50%': {
                                                transform: 'scale(1.1)',
                                            },
                                            '100%': {
                                                transform: 'scale(1)',
                                                opacity: 1
                                            }
                                        }
                                    }}
                                >
                                    <CheckCircleIcon sx={{ fontSize: 70, color: 'white' }} />
                                </Box>

                                <Typography variant="h4" fontWeight={700} textAlign="center" sx={{ color: '#4caf50', mb: 1 }}>
                                    ¡Email Verificado!
                                </Typography>

                                <Typography variant="body1" textAlign="center" sx={{ color: 'var(--color-text-muted)', mb: 4 }}>
                                    Tu correo electrónico ha sido verificado exitosamente.
                                </Typography>

                                <Box
                                    sx={{
                                        width: '100%',
                                        p: 3,
                                        borderRadius: 2,
                                        bgcolor: 'var(--color-bg)',
                                        border: '2px solid #4caf50',
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography variant="body2" sx={{ color: 'var(--color-text-primary)', mb: 1 }}>
                                        Correo verificado:
                                    </Typography>
                                    <Typography variant="body1" fontWeight={600} sx={{ color: 'var(--color-primary)' }}>
                                        {email}
                                    </Typography>
                                </Box>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        background: 'var(--color-secondary)',
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                        mt: 2,
                                        '&:hover': {
                                            background: 'var(--color-secondary-dark)',
                                            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                                        }
                                    }}
                                >
                                    Continuar
                                </Button>
                            </Stack>
                        </Zoom>
                    )}
                </CardContent>
            </Card>

        </Box>
    );
}

