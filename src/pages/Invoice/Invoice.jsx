import React, { useState } from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import PaymentType from './components/PaymentType';
import InvoicePreview from './components/InvoicePreview';
import ProductSelection from './components/ProductSelection';

export default function Invoice() {
    const [selectedInstallments, setSelectedInstallments] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState('USD');

    return (
        <Box sx={{
            backgroundColor: 'var(--color-bg)',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            px: { xs: 2, sm: 3, md: 4 },
            py: 4,
        }}>

            <Typography
                variant="h4"
                sx={{
                    mb: 4,
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                    textAlign: 'center'
                }}
            >
                Generar Factura
            </Typography>


            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    gap: 4,
                    flexWrap: 'wrap',
                }}
            >
                <Box                >
                    <PaymentType onInstallmentChange={setSelectedInstallments} />
                </Box>

                <Box
                    sx={{
                        flex: { xs: '0 0 100%', md: '1 1 50%' },
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
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

        </Box>
    );
}