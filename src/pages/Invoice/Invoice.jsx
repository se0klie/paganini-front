import React, { useState } from 'react';
import { Box, Grid, Typography, Button, Tooltip, Stack, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Navbar from '../../shared components/Navbar';
import ContactList from './components/ContactsList';
import TransactionSide from './components/TransactionSide';
import PaymentMethodList from './components/PaymentMethodList';
import InvoicePreview from './components/InvoicePreview';

export default function Invoice() {
    const currencySymbols = {
        USD: '$',
        EUR: '€',
        MXN: 'MX$',
    };

    const exchangeRates = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.80,
        JPY: 150,
        MXN: 18.20
    };

    const [selectedContact, setSelectedContact] = useState('')
    const [amount, setAmount] = useState(0)
    const [currency, setCurrency] = useState('USD');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
    const navigate = useNavigate();

    const handleCurrencyChange = (event) => {
        const newCurrency = event.target.value;
        const amountInUSD = amount / exchangeRates[currency];

        const newAmount = amountInUSD * exchangeRates[newCurrency];

        setCurrency(newCurrency);
        setAmount(newAmount);
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
            <Navbar />
            <Box
                sx={{
                    backgroundColor: 'var(--color-bg)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    px: { xs: 2, sm: 3, md: 4 },
                    py: 4,
                }}
            >
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            color: 'var(--color-primary)',
                            textTransform: 'none',
                            fontWeight: 600,
                            ':hover': { backgroundColor: 'rgba(10,37,64,0.1)' },
                        }}
                        onClick={() => navigate('/')}
                    >
                        Volver
                    </Button>
                </Box>

                <Typography
                    variant="h4"
                    sx={{
                        mb: 4,
                        color: 'var(--color-primary)',
                        fontWeight: 700,
                        textAlign: 'center',
                    }}
                >
                    Nueva transacción
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        width: '100%',
                        gap: 3,
                    }}
                >
                    <Box
                        sx={{
                            flex: '1 1 50%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                        }}
                    >
                    <ContactList selectedContact={selectedContact} setSelectedContact={setSelectedContact} />
                    <TransactionSide amount={amount} setAmount={setAmount} />
                    <PaymentMethodList selectedPaymentMethod={selectedPaymentMethod} setSelectedPaymentMethod={setSelectedPaymentMethod} />
                </Box>

                <Box
                    sx={{
                        flex: '1 1 50%',
                    }}
                >
                    <InvoicePreview customer={selectedContact} />
                </Box>
            </Box>

            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: 4,
                }}
            >
                <Tooltip
                    title={
                        amount === 0
                            ? 'Debe ingresar un monto mayor a 0'
                            : !selectedContact
                                ? 'Debe seleccionar un contacto a transferir'
                                : !selectedPaymentMethod ?
                                    'Debe seleccionar un método de pago' :
                                    ''
                    }
                >
                    <span>
                        <Button
                            sx={{
                                px: 3,
                                fontWeight: 600,
                                color: 'white',
                                background: 'var(--color-secondary)',
                                ':hover': {
                                    background: 'var(--color-secondary-dark)',
                                },
                                '&.Mui-disabled': {
                                    background: 'var(--color-text-muted)',
                                    color: 'white',
                                    opacity: 0.7,
                                    cursor: 'not-allowed',
                                },
                            }}
                            onClick={() => navigate('/payment')}
                            disabled={!selectedContact || !selectedPaymentMethod || amount <= 0}
                        >
                            Proceder al pago
                        </Button>
                    </span>
                </Tooltip>
            </Box>
        </Box>
        </Box >
    );
}
