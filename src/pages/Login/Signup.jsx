import { Grid, Box, Button, Divider, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ErrorModal from '../../shared components/Modals.jsx';
import { SuccessModal } from '../../shared components/Modals';
import api from '../../axios';
import '../../style.css';

export default function SignupPage() {
    const navigate = useNavigate();
    const [openError, setOpenError] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [userData, setUserData] = useState({
        email: '',
        name: '',
        lastname: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const fields = [
        { id: 'email', label: 'Correo electrónico', placeholder: 'Ingresa tu correo' },
        { id: 'name', label: 'Nombres', placeholder: 'Tus nombres' },
        { id: 'lastname', label: 'Apellidos', placeholder: 'Tus apellidos' },
        { id: 'phone', label: 'Celular', placeholder: '09XXXXXXXX' },
        { id: 'password', label: 'Contraseña', placeholder: 'Tu contraseña' },
        {
            id: 'confirmPassword',
            label: 'Confirmar contraseña',
            placeholder: 'Repite la contraseña',
        },
    ];

    async function handleSignup() {
        try {
            const { name, lastname, email, phone, password, confirmPassword } = userData;

            const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
            const phoneRegex = /^09\d{8}$/;
            const passwordRegex =
                /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={};':"\\|,.<>/?]).{8,}$/;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!nameRegex.test(name) || !nameRegex.test(lastname)) {
                alert('Nombre y apellido no pueden estar vacíos ni contener números o símbolos.');
                return;
            }

            if (!emailRegex.test(email)) {
                alert('Ingrese un correo electrónico válido.');
                return;
            }

            if (!phoneRegex.test(phone)) {
                alert('El teléfono debe tener 10 dígitos y comenzar con 09.');
                return;
            }

            if (!passwordRegex.test(password)) {
                alert(
                    'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.'
                );
                return;
            }

            if (password !== confirmPassword) {
                alert('Las contraseñas no son iguales.');
                return;
            }

            const response = await api.post('/auth/signup', {
                nombre: name,
                apellido: lastname,
                correo: email,
                telefono: phone,
                password: password,
            });
            if (response.status === 200 || response.status === 201) {
                setOpenSuccess(true);
                setTimeout(() => {
                    setOpenSuccess(false);
                    navigate('/login');
                }, 3000);
            }
        } catch (err) {
            console.error('Signup error: ', err);
            setOpenError(true);
            return err;
        }
    }

    return (
        <Box
            sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'var(--color-primary)',
                minHeight: '100vh',
            }}
        >
            <Typography sx={{ fontWeight: 600, fontSize: '2.5em', color: 'white' }}>
                Paganini
            </Typography>
            <Box
                sx={{
                    backgroundColor: 'var(--color-surface)',
                    p: 4,
                    borderRadius: 2,
                    mt: 5,
                    width: '70vw',
                    mx: 'auto',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                <Typography variant="h5" textAlign="center" fontWeight={600}>
                    Registrarse
                </Typography>

                <Grid container spacing={2} sx={{ width: '100%', mx: 'auto' }}>
                    {fields.map((field) => (
                        <Grid key={field.id} size={{ xs: 12, sm: 6 }}>
                            <Box>
                                <Typography variant="body1" fontWeight={600}>
                                    {field.label}
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder={field.placeholder}
                                    type={
                                        field.label.toLowerCase().includes('contraseña')
                                            ? 'password'
                                            : 'text'
                                    }
                                    onChange={(e) =>
                                        setUserData((prev) => ({
                                            ...prev,
                                            [field.id]: e.target.value,
                                        }))
                                    }
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Button
                        sx={{
                            flex: 1,
                            mt: 1,
                            fontWeight: 600,
                            color: 'var(--color-text-muted)',
                            border: '2px solid var(--button-prev-action)',
                            background: 'transparent',
                            ':hover': {
                                border: '2px solid var(--button-prev-action-dark)',
                            },
                        }}
                        onClick={() => navigate('/login')}
                    >
                        Regresar
                    </Button>
                    <Button
                        sx={{
                            background: 'var(--color-secondary)',
                            width: '50%',
                            mt: 1,
                            mx: 'auto',
                            fontWeight: 600,
                            color: 'white',
                            ':hover': {
                                background: 'var(--color-secondary-dark)',
                            },
                        }}
                        onClick={handleSignup}
                    >
                        Registrarse
                    </Button>
                </Box>
                <ErrorModal
                    open={openError}
                    onClose={() => setOpenError(false)}
                    title="Error"
                    message="Hubo un problema al registrarte. Inténtalo más tarde."
                />
                <SuccessModal
                    open={openSuccess}
                    onClose={() => setOpenSuccess(false)}
                    title="Registrado!"
                    message="Te redirigiremos para que inicies sesión."
                />
            </Box>
        </Box>
    );
}
