import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Divider,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';

const currencySymbols = {
    USD: '$',
    EUR: '€',
    MXN: 'MX$',
};

export default function InvoicePreview({
    currency = 'USD',
    customer,
    amount
}) {
    const invoiceData = {
        number: 'FACT-001',
        date: new Date().toLocaleDateString(),
        customer,
        amount
    };

    const calculateTotals = () => {
        const subtotal = Number(amount) || 0;
        const tax = subtotal * 0.15;
        const total = subtotal + tax;

        return {
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2),
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
                                    {( customer && invoiceData?.customer?.nombre + ' ' + invoiceData?.customer?.apellido) || 'Nombre de contacto seleccionado'}
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
                            <Grid item xs={7}>
                                <Typography sx={{ color: 'var(--color-text-secondary)' }}>
                                    Subtotal:
                                </Typography>
                            </Grid>
                            <Grid item xs={5} sx={{ textAlign: 'right' }}>
                                <Typography sx={{ color: 'var(--color-text-secondary)' }}>
                                    {currencySymbols[currency]}
                                    {totals.subtotal}
                                </Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography sx={{ color: 'var(--color-text-secondary)' }}>
                                    IVA (15%):
                                </Typography>
                            </Grid>
                            <Grid item xs={5} sx={{ textAlign: 'right' }}>
                                <Typography sx={{ color: 'var(--color-text-secondary)' }}>
                                    {currencySymbols[currency]}
                                    {totals.tax}
                                </Typography>
                            </Grid>
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
