import React, { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
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
            py: 4
        }}>
            <Box sx={{
                width: '100%',
                maxWidth: '1600px',
                height: '100%'
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
                
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box sx={{ flex: 2 }}>
                                <ProductSelection 
                                    onProductsChange={setSelectedProducts}
                                    onCurrencyChange={setSelectedCurrency}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <PaymentType onInstallmentChange={setSelectedInstallments} />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <InvoicePreview 
                            installments={selectedInstallments}
                            products={selectedProducts}
                            currency={selectedCurrency}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}