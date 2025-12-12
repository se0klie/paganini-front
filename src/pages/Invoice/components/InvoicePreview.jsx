import {
    Box,
    Typography,
    Grid,
    Divider,
    Card,
    CardContent,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useState, useEffect } from 'react';
const currencySymbols = {
    USD: '$',
    EUR: '€',
    MXN: 'MX$',
};

const exchangeRates = {
    USD: 1,
    EUR: 0.92,
    MXN: 18.20
};

export default function InvoicePreview({
    currency = 'USD',
    customer,
    amount
}) {
    const [amountMask, setAmountMask] = useState(0)
    
    const handleCurrencyChange = () => {
        const amountInUSD = amount / exchangeRates[currency];
        setAmountMask(amountInUSD);
    };

    useEffect(() => {
        handleCurrencyChange()
    }, [currency, amount])

    const invoiceData = {
        number: 'FACT-001',
        date: new Date().toLocaleDateString(),
        customer,
        amount
    };

    const calculateTotals = () => {
        return {
            total: Number(amountMask).toFixed(2) || 0
        };
    };

    const totals = calculateTotals();

    return (
        <Box
            sx={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: 2,
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Card
                elevation={3}
                sx={{
                    bgcolor: 'var(--color-surface)',
                    position: 'relative',
                    overflow: 'visible',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: -20,
                        left: 20,
                        bgcolor: 'var(--secondary-accent)',
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-md)',
                    }}
                >
                    <ReceiptIcon sx={{ color: 'white' }} />
                </Box>

                <CardContent
                    sx={{
                        p: 4,
                        pt: 4,
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={6}>
                            <Typography
                                variant="h5"
                                sx={{
                                    color: 'var(--color-primary)',
                                    fontWeight: 700,
                                    mb: 2,
                                }}
                            >
                                FACTURA
                            </Typography>
                            <Box
                                sx={{
                                    bgcolor: 'var(--color-bg)',
                                    p: 2,
                                    borderRadius: 1,
                                    border: '1px solid var(--color-border)',
                                }}
                            >
                                <Typography sx={{ color: 'var(--color-text-secondary)', mb: 1 }}>
                                    No. {invoiceData.number}
                                </Typography>
                                <Typography sx={{ color: 'var(--color-text-secondary)' }}>
                                    Fecha: {invoiceData.date}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    bgcolor: 'var(--color-bg)',
                                    p: 2,
                                    borderRadius: 1,
                                    border: '1px solid var(--color-border)',
                                    height: '100%',
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: 'var(--color-text-primary)',
                                        fontWeight: 600,
                                        mb: 1,
                                    }}
                                >
                                    {(customer && invoiceData?.customer?.nombre + ' ' + invoiceData?.customer?.apellido) || 'Nombre de contacto seleccionado'}
                                </Typography>
                                <Typography sx={{ color: 'var(--color-text-secondary)', mb: 1 }}>
                                    Correo: {invoiceData.customer.correo || 'No identificado'}
                                </Typography>
                                <Typography sx={{ color: 'var(--color-text-secondary)' }}>
                                    Telf: {invoiceData.customer.telefono || 'No encontrado'}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />


                    <Box
                        sx={{
                            ml: 'auto',
                            bgcolor: 'var(--color-bg)',
                            p: 2,
                            borderRadius: 1,
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Divider sx={{ my: 1 }} />
                            </Grid>
                            <Grid item xs={7}>
                                <Typography sx={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                                    Total:
                                </Typography>
                            </Grid>
                            <Grid item xs={5} sx={{ textAlign: 'right' }}>
                                <Typography sx={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                                    {currencySymbols[currency]}
                                    {totals.total}
                                </Typography>
                            </Grid>

                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
