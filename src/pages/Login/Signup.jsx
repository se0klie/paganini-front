import { Grid, Box, Button, Divider, TextField, Typography, Stack, Tooltip, IconButton } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import '../../style.css';
import PasswordField from "../../shared components/Inputs";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function SignupPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        email: '',
        name: '',
        lastname: '',
        phone: '',
        password: '',
        confirmPassword: ''
    })

    const fields = [
        { id: "email", label: "Correo electrónico", placeholder: "Ingresa tu correo" },
        { id: "name", label: "Nombres", placeholder: "Tus nombres" },
        { id: "lastname", label: "Apellidos", placeholder: "Tus apellidos" },
        { id: "phone", label: "Celular", placeholder: "09XXXXXXXX" },
        { id: "password", label: "Contraseña", placeholder: "Tu contraseña" },
        { id: "confirmPassword", label: "Confirmar contraseña", placeholder: "Repite la contraseña" }
    ];

    return (
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--color-primary)', minHeight: '100vh' }}>
            <Typography sx={{ fontWeight: 600, fontSize: '2.5em', color: 'white' }}>Paganini</Typography>
            <Box
                sx={{
                    backgroundColor: "var(--color-surface)",
                    p: 4,
                    borderRadius: 2,
                    mt: 5,
                    width: "70vw",
                    mx: "auto",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}
            >
                <Typography variant="h5" textAlign="center" fontWeight={600}>
                    Registrarse
                </Typography>

                <Grid container spacing={2} sx={{ width: '100%', mx: 'auto' }}>
                    {fields.map((field, index) => (
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Box>
                                <Typography variant="body1" fontWeight={600}>
                                    {field.label}
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder={field.placeholder}
                                    type={field.label.toLowerCase().substring("contraseña") ? "password" : "text"}
                                    onChange={(e) => setUserData(prev => ({
                                        ...prev,
                                        [id]: e.target.value
                                    }))}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>

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
                    Registrarse
                </Button>
            </Box>
        </Box>
    )
}
