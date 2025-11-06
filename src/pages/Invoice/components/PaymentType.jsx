import React, { useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, 
         DialogActions, Card, CardContent, Stack, Chip } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function PaymentType({ onInstallmentChange }) {
    const [paymentType, setPaymentType] = useState('cash');
    const [openInstallmentsModal, setOpenInstallmentsModal] = useState(false);
    const [selectedInstallment, setSelectedInstallment] = useState(null);

    // Ejemplo de montos mínimos para plazos (esto debería venir de la configuración o API)
    const installmentRules = [
        { months: 3, minAmount: 500 },
        { months: 6, minAmount: 1000 },
        { months: 12, minAmount: 2000 },
    ];

    // Ejemplo de monto total (esto debería venir como prop)
    const totalAmount = 650;

    const handlePaymentTypeChange = (event) => {
        const newType = event.target.value;
        setPaymentType(newType);
        if (newType === 'installments') {
            setOpenInstallmentsModal(true);
        } else {
            setSelectedInstallment(null);
            onInstallmentChange(null);
        }
    };

    const handleInstallmentSelect = (months) => {
        setSelectedInstallment(months);
        onInstallmentChange(months);
        setOpenInstallmentsModal(false);
    };

    return (
        <Card elevation={3} sx={{
            height: '100%',
            position: 'relative',
            overflow: 'visible'
        }}>
            <Box sx={{
                position: 'absolute',
                top: -20,
                left: 20,
                bgcolor: 'var(--color-primary)',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)'
            }}>
                <PaymentIcon sx={{ color: 'white' }} />
            </Box>

            <CardContent sx={{ p: 4, pt: 4 }}>
                <Typography variant="h5" sx={{ color: 'var(--color-primary)', mb: 4, fontWeight: 700 }}>
                    Tipo de Pago
                </Typography>

                <Stack spacing={3}>
                    <Box 
                        onClick={() => handlePaymentTypeChange({ target: { value: 'cash' }})}
                        sx={{
                            p: 2,
                            border: `2px solid ${paymentType === 'cash' ? 'var(--secondary-accent)' : 'var(--color-border)'}`,
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            bgcolor: paymentType === 'cash' ? 'var(--color-bg)' : 'transparent',
                            '&:hover': {
                                borderColor: 'var(--secondary-accent)',
                                bgcolor: 'var(--color-bg)'
                            }
                        }}
                    >
                        <Stack direction="row" spacing={2} alignItems="center">
                            <AccountBalanceIcon sx={{ 
                                color: paymentType === 'cash' ? 'var(--secondary-accent)' : 'var(--color-text-muted)',
                                fontSize: 30
                            }} />
                            <Box>
                                <Typography sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                    Pago al Contado
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                                    Pago único del monto total
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Box 
                        onClick={() => handlePaymentTypeChange({ target: { value: 'installments' }})}
                        sx={{
                            p: 2,
                            border: `2px solid ${paymentType === 'installments' ? 'var(--secondary-accent)' : 'var(--color-border)'}`,
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            bgcolor: paymentType === 'installments' ? 'var(--color-bg)' : 'transparent',
                            '&:hover': {
                                borderColor: 'var(--secondary-accent)',
                                bgcolor: 'var(--color-bg)'
                            }
                        }}
                    >
                        <Stack direction="row" spacing={2} alignItems="center">
                            <CalendarMonthIcon sx={{ 
                                color: paymentType === 'installments' ? 'var(--secondary-accent)' : 'var(--color-text-muted)',
                                fontSize: 30
                            }} />
                            <Box>
                                <Typography sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                    Pago en Cuotas
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                                    Divide el pago en cuotas mensuales
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Stack>

                {selectedInstallment && paymentType === 'installments' && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: 'var(--color-bg)', borderRadius: 2, border: '1px solid var(--color-border)' }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <CalendarMonthIcon sx={{ color: 'var(--secondary-accent)' }} />
                            <Box>
                                <Typography sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                    Plan seleccionado
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                                    <Chip 
                                        label={`${selectedInstallment} cuotas`}
                                        sx={{ 
                                            bgcolor: 'var(--secondary-accent)',
                                            color: 'white',
                                            fontWeight: 600
                                        }}
                                    />
                                    <Typography sx={{ color: 'var(--color-text-muted)' }}>
                                        ${(totalAmount / selectedInstallment).toFixed(2)} /mes
                                    </Typography>
                                </Stack>
                            </Box>
                        </Stack>
                    </Box>
                )}
            </CardContent>

            <Dialog 
                open={openInstallmentsModal} 
                onClose={() => setOpenInstallmentsModal(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        maxWidth: '400px'
                    }
                }}
            >
                <DialogTitle>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <CalendarMonthIcon sx={{ color: 'var(--color-primary)' }} />
                        <Typography sx={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                            Seleccionar Plazo
                        </Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 3, color: 'var(--color-text-muted)' }}>
                        Elige el número de cuotas para tu pago
                    </Typography>
                    <Stack spacing={2}>
                        {installmentRules.map((rule) => (
                            <Button
                                key={rule.months}
                                fullWidth
                                variant={totalAmount >= rule.minAmount ? "contained" : "outlined"}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor: totalAmount >= rule.minAmount ? 'var(--secondary-accent)' : 'transparent',
                                    borderColor: totalAmount >= rule.minAmount ? 'var(--secondary-accent)' : 'var(--button-prev-action)',
                                    color: totalAmount >= rule.minAmount ? 'white' : 'var(--color-text-muted)',
                                    '&:hover': {
                                        backgroundColor: totalAmount >= rule.minAmount ? 'var(--secondary-accent-dark)' : 'transparent',
                                        borderColor: totalAmount >= rule.minAmount ? 'var(--secondary-accent-dark)' : 'var(--button-prev-action-dark)',
                                    },
                                }}
                                disabled={totalAmount < rule.minAmount}
                                onClick={() => handleInstallmentSelect(rule.months)}
                            >
                                <Stack spacing={1}>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {rule.months} cuotas
                                    </Typography>
                                    <Typography variant="body2">
                                        {totalAmount >= rule.minAmount ? 
                                            `$${(totalAmount / rule.months).toFixed(2)} /mes` :
                                            `Monto mínimo requerido: $${rule.minAmount}`
                                        }
                                    </Typography>
                                </Stack>
                            </Button>
                        ))}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button 
                        onClick={() => setOpenInstallmentsModal(false)}
                        sx={{ 
                            color: 'var(--color-text-muted)',
                            borderColor: 'var(--button-prev-action)',
                            '&:hover': {
                                borderColor: 'var(--button-prev-action-dark)',
                            }
                        }}
                        variant="outlined"
                    >
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}