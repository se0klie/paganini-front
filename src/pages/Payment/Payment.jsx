import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Divider,
    CircularProgress,
    Alert,
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentMethodList from './PaymentMethodList';
import api from '../../axios';
import AddCardIcon from '@mui/icons-material/AddCard';

export function PaymentPage() {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open2FAModal, setOpen2FAModal] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    const type = location.state?.type;
    const amount = location?.state?.amount;

    const isRecharge = type === 'recharge';
    const isWithdraw = type === 'withdraw';
    const isTransfer = !isRecharge && !isWithdraw;

    const allowedPM = isRecharge ? 'card' : isWithdraw ? 'bank' : '';


    async function handleWithdraw() {
        try {
            if (!selectedPaymentMethod) return;

            setLoading(true);
            setStatus('loading');

            const payload = {
                email: localStorage.getItem('correo'),
                metodoPagoId: selectedPaymentMethod.id,
                monto: amount,
            };

            const response = await api.post('/api/transacciones/retiro', payload);

            if (response?.status === 200 || response?.status === 201) {
                setStatus('success');
                setTimeout(() => navigate('/invoice'), 1500);
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error('ERROR in withdraw: ', err);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    }

    async function handlePayVerification() {
        if (loading) return;

        try {
            await api.post('/api/verification-code', {
                correo: localStorage.getItem('correo'),
            });
        } catch (err) {
            console.error('ERROR sending verification code: ', err);
            setStatus('error');
            return;
        }

        setVerificationCode('');
        setOpen2FAModal(true);
    }

    async function handlePay(code) {
        const contactEmail = location?.state?.receiver;

        setLoading(true);
        setStatus('loading');

        try {
            const responseSend = await api.post('/api/transacciones/enviar/correo', {
                senderEmail: localStorage.getItem('correo'),
                receiverEmail: contactEmail,
                codigo: code,
                monto: amount,
            });

            if (responseSend?.status === 200) {
                setStatus('success');
            }

            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            console.error('ERROR in payment: ', err);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    }

    async function handleRecharge() {
        try {
            if (!selectedPaymentMethod) return;

            setLoading(true);
            setStatus('loading');

            const payload = {
                email: localStorage.getItem('correo'),
                metodoPagoId: selectedPaymentMethod.id,
                monto: amount,
            };

            const response = await api.post('/api/transacciones/recarga', payload);

            if (response?.status === 200 || response?.status === 201) {
                setStatus('success');
                setTimeout(() => navigate('/invoice'), 1500);
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error('ERROR in recharge: ', err);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    }

    const mainAction = isRecharge
        ? handleRecharge
        : isWithdraw
            ? handleWithdraw
            : handlePayVerification;

    const buttonText = isRecharge
        ? 'Confirmar Recarga'
        : isWithdraw
            ? 'Confirmar retiro'
            : 'Pagar';

    const buttonIcon = isRecharge ? <AddCardIcon /> : <PaymentIcon />;


    return (
        <Box sx={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
            <Dialog
                open={open2FAModal}
                onClose={() => setOpen2FAModal(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    Verificación 2FA
                </DialogTitle>

                <DialogContent sx={{ pt: 2 }}>
                    <Typography sx={{ fontSize: 15, mb: 2 }}>
                        Para mayor seguridad, por favor ingresa el código que enviamos a tu correo.
                    </Typography>

                    <TextField
                        label="Código de verificación"
                        placeholder="Ingresa el código"
                        fullWidth
                        variant="outlined"
                        value={verificationCode}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setVerificationCode(value);
                        }}
                        InputLabelProps={{ sx: { fontWeight: 600 } }}
                        inputProps={{
                            maxLength: 6,
                            style: { letterSpacing: 4, textAlign: 'center' },
                        }}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => {
                            setOpen2FAModal(false);
                            setVerificationCode('');
                        }}
                        variant="outlined"
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        color="success"
                        disabled={verificationCode.length !== 6}
                        onClick={() => {
                            setOpen2FAModal(false);
                            handlePay(verificationCode);
                        }}
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

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

                    {!isTransfer && (
                        <>
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
                                Métodos de Pago Guardados
                            </Typography>

                            <PaymentMethodList
                                selectedPaymentMethod={selectedPaymentMethod}
                                setSelectedPaymentMethod={setSelectedPaymentMethod}
                                allowedPM={allowedPM}
                            />

                            <Divider sx={{ my: 4 }} />
                        </>
                    )}

                    {isTransfer && (
                        <Typography sx={{ mb: 3, color: 'var(--color-text-muted)' }}>
                            Este pago se realizará directamente desde tu saldo disponible
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        color={isRecharge ? 'primary' : 'success'}
                        fullWidth
                        disabled={(!isTransfer && !selectedPaymentMethod) || loading}
                        startIcon={buttonIcon}
                        sx={{
                            background: isRecharge
                                ? 'var(--color-primary)'
                                : 'var(--secondary-accent)',
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
                            ':hover': {
                                background: isRecharge
                                    ? 'var(--color-primary-dark)'
                                    : '',
                            },
                        }}
                        onClick={mainAction}
                    >
                        {buttonText}
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
                    <Typography
                        variant="h6"
                        sx={{ color: 'white', fontWeight: 600, mb: 3 }}
                    >
                        Estado de la transacción
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
                                    Procesando...
                                </Typography>
                            </>
                        )}

                        {status === 'success' && (
                            <Box>
                                <Typography sx={{ fontSize: 64, mb: 2 }}>
                                    😃
                                </Typography>
                                <Alert severity="success">
                                    {isRecharge
                                        ? 'Recarga realizada con éxito'
                                        : 'Pago realizado con éxito'}
                                </Alert>
                            </Box>
                        )}

                        {status === 'error' && (
                            <Box>
                                <Typography sx={{ fontSize: 64, mb: 2 }}>
                                    😞
                                </Typography>
                                <Alert severity="error">
                                    Hubo un error al procesar la transacción
                                </Alert>
                            </Box>
                        )}

                        {!status && (
                            <Box>
                                <Typography sx={{ fontSize: 64, mb: 2 }}>
                                    🕒
                                </Typography>
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
}

export default PaymentPage;
