import React, { useState } from 'react';
import {
    Box, Typography, Card, CardContent, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton,
    Select, MenuItem, TextField, Stack
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// Simulación de datos de productos (esto debería venir de una API)
const availableProducts = [
    { id: 1, name: 'Producto Premium', price: { USD: 299.99, EUR: 275.50, MXN: 5999.99 } },
    { id: 2, name: 'Servicio Básico', price: { USD: 99.99, EUR: 92.50, MXN: 1999.99 } },
    { id: 3, name: 'Producto Estándar', price: { USD: 149.99, EUR: 138.50, MXN: 2999.99 } },
    { id: 4, name: 'Servicio Premium', price: { USD: 399.99, EUR: 368.50, MXN: 7999.99 } },
];

const currencySymbols = {
    USD: '$',
    EUR: '€',
    MXN: 'MX$'
};

export default function ProductSelection({ onProductsChange, onCurrencyChange }) {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [currency, setCurrency] = useState('USD');

    const handleQuantityChange = (productId, change) => {
        const existingProduct = selectedProducts.find(p => p.id === productId);
        const product = availableProducts.find(p => p.id === productId);
        let updatedProducts;

        if (existingProduct) {
            const newQuantity = existingProduct.quantity + change;
            if (newQuantity <= 0) {
                updatedProducts = selectedProducts.filter(p => p.id !== productId);
            } else {
                updatedProducts = selectedProducts.map(p => 
                    p.id === productId 
                        ? { 
                            ...p, 
                            quantity: newQuantity, 
                            total: product.price[currency] * newQuantity 
                        }
                        : p
                );
            }
        } else if (change > 0) {
            updatedProducts = [
                ...selectedProducts,
                { 
                    id: productId, 
                    name: product.name,
                    price: product.price[currency],
                    quantity: 1,
                    total: product.price[currency]
                }
            ];
        } else {
            updatedProducts = [...selectedProducts];
        }

        setSelectedProducts(updatedProducts);
        onProductsChange(updatedProducts);
    };

    const handleCurrencyChange = (event) => {
        const newCurrency = event.target.value;
        setCurrency(newCurrency);
        
        // Actualizar precios de productos seleccionados con la nueva moneda
        const updatedProducts = selectedProducts.map(product => {
            const originalProduct = availableProducts.find(p => p.id === product.id);
            const newPrice = originalProduct.price[newCurrency];
            return {
                ...product,
                price: newPrice,
                total: newPrice * product.quantity
            };
        });
        
        setSelectedProducts(updatedProducts);
        onProductsChange(updatedProducts);
        onCurrencyChange(newCurrency);
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
                bgcolor: 'var(--secondary-accent-alternative)',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)'
            }}>
                <ShoppingCartIcon sx={{ color: 'white' }} />
            </Box>

            <CardContent sx={{ p: 4, pt: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                        Productos
                    </Typography>
                    <Select
                        value={currency}
                        onChange={handleCurrencyChange}
                        size="small"
                        sx={{ minWidth: 100 }}
                    >
                        <MenuItem value="USD">USD ($)</MenuItem>
                        <MenuItem value="EUR">EUR (€)</MenuItem>
                        <MenuItem value="MXN">MXN (MX$)</MenuItem>
                    </Select>
                </Stack>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ 
                                '& th': { 
                                    bgcolor: 'var(--color-primary)',
                                    color: 'white',
                                    fontWeight: 600
                                }
                            }}>
                                <TableCell>Producto</TableCell>
                                <TableCell align="right">Precio</TableCell>
                                <TableCell align="center">Cantidad</TableCell>
                                <TableCell align="right">Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {availableProducts.map((product) => {
                                const selectedProduct = selectedProducts.find(p => p.id === product.id);
                                const quantity = selectedProduct ? selectedProduct.quantity : 0;

                                return (
                                    <TableRow key={product.id} sx={{
                                        '&:nth-of-type(odd)': {
                                            backgroundColor: 'var(--color-bg)',
                                        },
                                        '&:hover': {
                                            backgroundColor: 'var(--color-border)',
                                        }
                                    }}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell align="right">
                                            {currencySymbols[currency]}{product.price[currency].toFixed(2)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                                                <IconButton 
                                                    size="small"
                                                    onClick={() => handleQuantityChange(product.id, -1)}
                                                    sx={{ 
                                                        color: quantity > 0 ? 'var(--color-error)' : 'var(--button-prev-action)'
                                                    }}
                                                >
                                                    <RemoveCircleIcon />
                                                </IconButton>
                                                <Typography sx={{ minWidth: '40px', textAlign: 'center' }}>
                                                    {quantity}
                                                </Typography>
                                                <IconButton 
                                                    size="small"
                                                    onClick={() => handleQuantityChange(product.id, 1)}
                                                    sx={{ color: 'var(--secondary-accent)' }}
                                                >
                                                    <AddCircleIcon />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="right">
                                            {quantity > 0 && (
                                                <Typography sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                                    {currencySymbols[currency]}
                                                    {(product.price[currency] * quantity).toFixed(2)}
                                                </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}