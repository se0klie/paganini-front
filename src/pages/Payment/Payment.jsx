import React, { useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    Card,
    Button,
    Modal,
    TextField,
    Divider,
    Chip,
    List,
    ListItem,
    ListItemText,
    IconButton,
    CircularProgress,
    Alert,
    Fade,
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentMethodList from './PaymentMethodList';
import api from '../../axios';
import { ContactsOutlined } from '@mui/icons-material';

export function PaymentPage() {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
    const [status, setStatus] = useState(null);
    const location = useLocation()
    const navigate = useNavigate();

    async function handlePay() {
        const amount = location?.state?.amount;
        const contactEmail = location?.state.receiver
        try {
            const response = await api.post('/transactions/payment-requests',
                {
                    "correoSolicitante": contactEmail,
                    "monto": amount
                }
            )

            if (response.data.payload) {
                const responseSend = await api.post('/api/transacciones/enviar/qr', {
                    senderEmail: localStorage.getItem('correo'),
                    qrPayload: response.data.payload,
                    monto: amount
                })
                if (responseSend?.status === 200) {
                    setStatus('success')
                }
            }

            setTimeout(() => {
                navigate('/')
            }, 1500);

        } catch (err) {
            console.error('ERROR in payment: ', err)
            setStatus('error')
            return err
        }
    };

    return (
        <Box sx={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    flexWrap: { xs: 'column', md: 'row' },
                    height: 'calc(100vh - 32px)',
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 3,
                        bgcolor: 'var(--color-surface)',
                        boxShadow: 'var(--shadow-md)',
                        minHeight: '100%',
                        position: 'relative',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            mb: 3,
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/invoice')}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                color: 'var(--color-primary)',
                                borderColor: 'var(--color-border)',
                                ':hover': {
                                    borderColor: 'var(--color-primary)',
                                    backgroundColor: 'rgba(0,0,0,0.04)',
                                },
                            }}
                        >
                            Volver
                        </Button>
                    </Box>

                    <Typography
                        variant="h6"
                        sx={{
                            color: 'var(--color-primary)',
                            fontWeight: 600,
                            mb: 3,
                            textAlign: 'center',
                            width: '100%',
                        }}
                    >
                        Tarjetas Registradas
                    </Typography>


                    <PaymentMethodList selectedPaymentMethod={selectedPaymentMethod} setSelectedPaymentMethod={setSelectedPaymentMethod} />

                    <Divider sx={{ my: 4 }} />

                    <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        disabled={!selectedPaymentMethod}
                        startIcon={<PaymentIcon />}
                        sx={{
                            background: 'var(--secondary-accent)',
                            borderRadius: 2,
                            px: 3,
                            py: 1.5,
                            fontWeight: 600,
                            '&.Mui-disabled': {
                                background: 'var(--button-prev-action)',
                                color: 'white',
                                cursor: 'not-allowed',
                                opacity: 0.7,
                            },
                        }}
                        onClick={async () => { await handlePay() }}
                    >
                        Pagar
                    </Button>

                </Box>


                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 3,
                        bgcolor: 'var(--color-secondary)',
                        minHeight: '100%',
                    }}
                >
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                        Estado de transacción
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            py: 4,
                            textAlign: 'center',
                        }}
                    >
                        {status === 'loading' && (
                            <>
                                <CircularProgress color="primary" />
                                <Typography sx={{ mt: 2, color: 'white' }}>
                                    Procesando pago...
                                </Typography>
                            </>
                        )}

                        {status === 'success' && (
                            <Box>
                                <Typography sx={{ fontSize: 64, mb: 2 }}>😃</Typography>
                                <Alert severity="success">Pago realizado con éxito</Alert>
                            </Box>
                        )}

                        {status === 'error' && (
                            <Box>
                                <Typography sx={{ fontSize: 64, mb: 2 }}>😞</Typography>
                                <Alert severity="error">Hubo un error al procesar el pago</Alert>
                            </Box>
                        )}

                        {!status && (
                            <Box>
                                <Typography sx={{ fontSize: 64, mb: 2 }}>🕒</Typography>
                                <Typography sx={{ color: 'white' }}>
                                    Esperando acción del usuario
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>

        </Box>
    );
};

export default PaymentPage;
