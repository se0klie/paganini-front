import { Box, Button, Divider, TextField, Typography, Stack, Tooltip, IconButton } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import '../../style.css';
import PasswordField from "../../shared components/Inputs";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function AuthPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        email: '',
        password: ''
    })
    const [currentStep, setCurrentStep] = useState(1)
    // steps: 1 login, 2 change password, 3 register
    return (
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--color-primary)', minHeight: '100vh' }}>
            <Typography sx={{ fontWeight: 600, fontSize: '2.5em', color: 'white' }}>Paganini</Typography>
            {currentStep === 1 && (
                <Login setCurrentStep={setCurrentStep} />
            )}
            {currentStep === 2 && (
                <PasswordReset setCurrentStep={setCurrentStep} />
            )}
            {currentStep === 3 && (
                <ChangePassword setCurrentStep={setCurrentStep} />
            )}

        </Box>
    )
}


function Login({ setCurrentStep }) {
    return (
        <Box
            sx={{
                backgroundColor: "var(--color-surface)",
                p: 4,
                borderRadius: 2,
                mt: 5,
                width: "400px",
                mx: "auto",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                gap: 3,
            }}
        >
            <Typography variant="h5" textAlign="center" fontWeight={600}>
                Iniciar sesión
            </Typography>

            <Stack spacing={2}>
                <Box>
                    <Typography variant="body1" fontWeight={600}>
                        E-mail
                    </Typography>
                    <TextField fullWidth size="small" placeholder="Ingresa tu correo" />
                </Box>

                <Box>
                    <Typography variant="body1" fontWeight={600}>
                        Contraseña
                    </Typography>
                    <TextField fullWidth size="small" type="password" placeholder="Tu contraseña" />
                    <Typography sx={{
                        cursor: 'pointer',
                        color: 'var(--secondary-accent)',
                        ':hover': { textDecoration: 'underline' }
                    }}
                        onClick={() => { setCurrentStep(2) }}>Olvidé mi contraseña</Typography>
                </Box>
            </Stack>

            <Button
                sx={{
                    background: "var(--color-secondary)",
                    width: "50%",
                    mx: "auto",
                    mt: 1,
                    fontWeight: 600,
                    color: "white",
                    ":hover": {
                        background: "var(--color-secondary-dark)",
                    },
                }}
            >
                Ingresar
            </Button>

            <Divider />

            <Button
                sx={{
                    background: "var(--color-secondary)",
                    width: "50%",
                    mx: "auto",
                    fontWeight: 600,
                    color: "white",
                    ":hover": {
                        background: "var(--color-secondary-dark)",
                    },
                }}
            >
                Regístrate
            </Button>
        </Box>

    )
}



function PasswordReset({ setCurrentStep }) {
    return (
        <Box
            sx={{
                backgroundColor: "var(--color-surface)",
                p: 4,
                borderRadius: 2,
                mt: 5,
                width: "400px",
                mx: "auto",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                gap: 3,
            }}
        >
            <Typography variant="h5" textAlign="center" fontWeight={600}>
                Enviar código de recuperación
            </Typography>
            <Typography variant="body">Se enviará un código al correo ingresado en caso de que exista. Una vez recibido, ingrésalo en el siguiente paso junto a tu nueva contraseña. </Typography>

            <Stack spacing={2}>
                <Box>
                    <Typography variant="body1" fontWeight={600}>
                        E-mail
                    </Typography>
                    <TextField fullWidth size="small" placeholder="Ingresa tu correo" />
                </Box>
            </Stack>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                <Button
                    sx={{
                        flex: 1,
                        mt: 1,
                        fontWeight: 600,
                        color: "var(--color-text-muted)",
                        border: '2px solid var(--button-prev-action)',
                        background: "transparent",
                        ":hover": {
                            border: '2px solid var(--button-prev-action-dark)',
                        },
                    }}
                    onClick={() => setCurrentStep(1)}
                >
                    Regresar
                </Button>

                <Button
                    sx={{
                        flex: 1,
                        mt: 1,
                        fontWeight: 600,
                        color: "white",
                        background: "var(--color-secondary)",
                        ":hover": {
                            background: "var(--color-secondary-dark)",
                        },
                    }}
                    onClick={() => setCurrentStep(3)}
                >
                    Recuperar
                </Button>
            </Box>

        </Box>

    )
}

function ChangePassword({ setCurrentStep, length = 4, onComplete }) {
    const [values, setValues] = useState(Array(length).fill(""));
    const inputsRef = useRef([]);

    useEffect(() => {
        if (inputsRef.current[0]) inputsRef.current[0].focus();
    }, []);

    useEffect(() => {
        const code = values.join("");
        if (code.length === length && !values.includes("")) {
            onComplete && onComplete(code);
        }
    }, [values, length, onComplete]);

    const handleChange = (e, index) => {
        const raw = e.target.value;
        const char = raw.replace(/\D/g, "").slice(0, 1);

        const newValues = [...values];
        newValues[index] = char;
        setValues(newValues);

        if (char && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        const key = e.key;

        if (key === "Backspace") {
            if (values[index]) {
                const newValues = [...values];
                newValues[index] = "";
                setValues(newValues);
            } else if (index > 0) {
                inputsRef.current[index - 1]?.focus();
            }
        }

        if (key === "ArrowLeft" && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }

        if (key === "ArrowRight" && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData("text");
        const digits = paste.replace(/\D/g, "").slice(0, length).split("");
        if (digits.length === 0) return;

        const newValues = Array(length).fill("");
        digits.forEach((d, i) => (newValues[i] = d));
        setValues(newValues);

        const lastIndex = Math.min(digits.length, length) - 1;
        inputsRef.current[lastIndex]?.focus();
    };

    return (
        <Box
            sx={{
                backgroundColor: "var(--color-surface)",
                p: 4,
                borderRadius: 2,
                mt: 5,
                width: "400px",
                mx: "auto",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                gap: 3,
            }}
        >
            <Typography variant="h5" textAlign="center" fontWeight={600}>
                Cambiar contraseña
            </Typography>

            <Stack spacing={2}>
                <Typography variant="body1" fontWeight={600}>
                    Ingrese el código enviado al correo
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                    onPaste={handlePaste}
                >
                    {values.map((digit, index) => (
                        <TextField
                            key={index}
                            inputRef={(el) => (inputsRef.current[index] = el)}
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            sx={{
                                flex: 1,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                },
                            }}
                            inputProps={{
                                maxLength: 1,
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                                style: {
                                    textAlign: "center",
                                    fontSize: "1.5rem",
                                    padding: "0.8rem 0",
                                },
                                "aria-label": `Código dígito ${index + 1}`,
                            }}
                        />
                    ))}
                </Box>
            </Stack>

            <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body1" fontWeight={600}>
                        Ingrese la nueva contraseña
                    </Typography>

                    <Tooltip
                        placement="right"
                        arrow
                        title={
                            <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                                <li>Mínimo 8 caracteres</li>
                                <li>Al menos una mayúscula</li>
                                <li>Al menos un número</li>
                                <li>Al menos un carácter especial</li>
                            </ul>
                        }
                    >
                        <IconButton size="small">
                            <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>


                <PasswordField />
            </Stack>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                <Button
                    sx={{
                        flex: 1,
                        mt: 1,
                        fontWeight: 600,
                        color: "var(--color-text-muted)",
                        border: '2px solid var(--button-prev-action)',
                        background: "transparent",
                        ":hover": {
                            border: '2px solid var(--button-prev-action-dark)',
                        },
                    }}
                    onClick={() => setCurrentStep(2)}
                >
                    Regresar
                </Button>

                <Button
                    sx={{
                        flex: 1,
                        mt: 1,
                        fontWeight: 600,
                        color: "white",
                        background: "var(--color-secondary)",
                        ":hover": {
                            background: "var(--color-secondary-dark)",
                        },
                    }}
                    onClick={() => setCurrentStep(3)}
                >
                    Cambiar
                </Button>
            </Box>
        </Box>
    );
}