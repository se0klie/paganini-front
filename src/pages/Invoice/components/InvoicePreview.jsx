import React from 'react';
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
    installments = 'cash',
    products = [],
    currency = 'USD',
    customer = {
        name: 'Cliente Ejemplo',
        id: '0123456789',
        address: 'Dirección Ejemplo 123',
    },
}) {
    const invoiceData = {
        number: 'FACT-001',
        date: new Date().toLocaleDateString(),
        customer,
        items: products.map((product) => ({
            description: product.name,
            quantity: product.quantity,
            price: product.price,
            total: product.total,
        })),
    };

    const calculateTotals = () => {
        if (invoiceData.items.length === 0) {
            return {
                subtotal: '0.00',
                tax: '0.00',
                total: '0.00',
                installmentAmount: '0.00',
            };
        }
        const subtotal = invoiceData.items.reduce((acc, item) => acc + item.total, 0);
        const tax = subtotal * 0.15; // 15% IVA
        const total = subtotal + tax;

        return {
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2),
            installmentAmount: installments ? (total / installments).toFixed(2) : null,
        };
    };

    const totals = calculateTotals();

    return (
        <Box
            sx={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: 2,
                boxShadow: 'var(--shadow-md)',
                height: '100%',
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
                    {/* Encabezado */}
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
                                    {invoiceData.customer.name}
                                </Typography>
                                <Typography sx={{ color: 'var(--color-text-secondary)', mb: 1 }}>
                                    ID: {invoiceData.customer.id}
                                </Typography>
                                <Typography sx={{ color: 'var(--color-text-secondary)' }}>
                                    {invoiceData.customer.address}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* Detalle de items */}
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: 0,
                        }}
                    >
                        <TableContainer
                            sx={{
                                border: '1px solid var(--color-border)',
                                borderRadius: 1,
                                mb: 2,
                                flex: 1,
                                overflowY: 'auto',
                            }}
                        >
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            bgcolor: 'var(--color-primary)',
                                            '& th': {
                                                color: 'black',
                                                fontWeight: 600,
                                                fontSize: '0.95rem',
                                            },
                                        }}
                                    >
                                        <TableCell width="45%">Descripción</TableCell>
                                        <TableCell align="center" width="15%">
                                            Cantidad
                                        </TableCell>
                                        <TableCell align="right" width="20%">
                                            Precio Unit.
                                        </TableCell>
                                        <TableCell align="right" width="20%">
                                            Total
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoiceData.items.map((item, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                '&:nth-of-type(odd)': {
                                                    backgroundColor: 'var(--color-bg)',
                                                },
                                                '& td': {
                                                    fontSize: '0.95rem',
                                                    py: 1.5,
                                                },
                                            }}
                                        >
                                            <TableCell>
                                                <Typography sx={{ fontWeight: 500 }}>
                                                    {item.description}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={item.quantity}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'var(--color-primary)',
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        minWidth: '40px',
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box
                                                    sx={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                    }}
                                                >
                                                    <Typography
                                                        component="span"
                                                        sx={{
                                                            color: 'var(--color-text-muted)',
                                                            fontSize: '0.85rem',
                                                        }}
                                                    >
                                                        {currencySymbols[currency]}
                                                    </Typography>
                                                    <Typography component="span">
                                                        {item.price.toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box
                                                    sx={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    <Typography
                                                        component="span"
                                                        sx={{
                                                            color: 'var(--color-text-muted)',
                                                            fontSize: '0.85rem',
                                                        }}
                                                    >
                                                        {currencySymbols[currency]}
                                                    </Typography>
                                                    <Typography component="span">
                                                        {item.total.toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {invoiceData.items.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                                <Typography
                                                    sx={{ color: 'var(--color-text-muted)' }}
                                                >
                                                    No hay productos seleccionados
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    {/* Totales */}
                    <Box
                        sx={{
                            ml: 'auto',
                            width: '300px',
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
                            {installments && (
                                <>
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                    </Grid>
                                    <Grid item xs={7}>
                                        <Typography
                                            sx={{
                                                color: 'var(--secondary-accent)',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Cuota mensual ({installments}x):
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={5} sx={{ textAlign: 'right' }}>
                                        <Typography
                                            sx={{
                                                color: 'var(--secondary-accent)',
                                                fontWeight: 600,
                                            }}
                                        >
                                            ${totals.installmentAmount}
                                        </Typography>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
