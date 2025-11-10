import React, { useState } from 'react';
import { Box, Grid, Typography, Button, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PaymentType from './components/PaymentType';
import InvoicePreview from './components/InvoicePreview';
import ProductSelection from './components/ProductSelection';

export default function Invoice() {
    const [selectedInstallments, setSelectedInstallments] = useState('cash');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const navigate = useNavigate();
    return (
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
                    onClick={() => navigate('/')} // go back in history
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
                Generar Factura
            </Typography>

            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    gap: 3,
                    flexWrap: 'wrap',
                }}
            >
                <Box>
                    <PaymentType onInstallmentChange={setSelectedInstallments} />
                </Box>

                <Box
                    sx={{
                        flex: { xs: '0 0 100%', md: '1 1 50%' },
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 5,
                    }}
                >
                    <Box sx={{ width: '100%' }}>
                        <ProductSelection
                            onProductsChange={setSelectedProducts}
                            onCurrencyChange={setSelectedCurrency}
                        />
                    </Box>

                    <Box sx={{ width: '100%' }}>
                        <InvoicePreview
                            installments={selectedInstallments}
                            products={selectedProducts}
                            currency={selectedCurrency}
                        />
                    </Box>
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
                        selectedProducts.length === 0
                            ? 'Debe seleccionar al menos un producto'
                            : !selectedInstallments
                              ? 'Debe seleccionar un método de pago o cuotas'
                              : ''
                    }
                    disableHoverListener={!(selectedProducts.length === 0 || !selectedInstallments)}
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
                            disabled={selectedProducts.length === 0 || !selectedInstallments}
                        >
                            Proceder al pago
                        </Button>
                    </span>
                </Tooltip>
            </Box>
        </Box>
    );
}
