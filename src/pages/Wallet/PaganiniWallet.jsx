import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    InputAdornment
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCardIcon from '@mui/icons-material/AddCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../shared components/Navbar';
import api from '../../axios';

const PaganiniWallet = () => {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0.00);
    const [transactions, setTransactions] = useState([]); // Wallet specific history
    const [loading, setLoading] = useState(true);
    const [openRecharge, setOpenRecharge] = useState(false);
    const [rechargeAmount, setRechargeAmount] = useState('');

    // Mock data for wallet history
    const mockWalletTransactions = [
        { id: 101, fecha: '2023-10-27', descripcion: 'Recarga de Saldo', monto: 50.00, type: 'credit' },
        { id: 102, fecha: '2023-10-26', descripcion: 'Pago de Factura #1234', monto: -25.00, type: 'debit' },
        { id: 103, fecha: '2023-10-25', descripcion: 'Recarga de Saldo', monto: 100.00, type: 'credit' },
    ];

    useEffect(() => {
        fetchBalance();
        fetchHistory();
    }, []);

    const fetchBalance = async () => {
        try {
            const response = await api.get(`/users/saldo?correo=${localStorage.getItem('correo')}`);
            setBalance(response.data.saldo);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchHistory = async () => {
        setLoading(true);
        // Simulated API call
        setTimeout(() => {
            setTransactions(mockWalletTransactions);
            setLoading(false);
        }, 500);
    };

    const handleRecharge = () => {
        // Here we would call the API to recharge
        const amount = parseFloat(rechargeAmount);
        if (isNaN(amount) || amount <= 0) return;

        // Mock update
        setBalance(prev => prev + amount);
        const newTransaction = {
            id: Date.now(),
            fecha: new Date().toISOString().split('T')[0],
            descripcion: 'Recarga de Saldo',
            monto: amount,
            type: 'credit'
        };
        setTransactions([newTransaction, ...transactions]);
        
        setOpenRecharge(false);
        setRechargeAmount('');
        // setSuccessOpen(true); // Removed as requested
        
        // Redirect to payment page
        navigate('/payment', { 
            state: { 
                amount: amount,
                type: 'recharge' // Optional: to let Payment page know context if needed
            } 
        });
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
            <Navbar />
            
            <Box sx={{ p: 4, maxWidth: '1000px', mx: 'auto' }}>
                {/* Header & Back Button */}
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            color: 'var(--color-primary)',
                            textTransform: 'none',
                            fontWeight: 600,
                            ':hover': { backgroundColor: 'rgba(10,37,64,0.1)' },
                        }}
                        onClick={() => navigate('/invoice')}
                    >
                        Volver a Factura
                    </Button>
                    <Typography variant="h5" sx={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                        Paganini Wallet
                    </Typography>
                    <Box sx={{ width: 100 }} />
                </Box>

                {/* Balance Card */}
                <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ 
                            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--secondary-accent) 100%)', 
                            color: 'white',
                            borderRadius: 3,
                            boxShadow: 'var(--shadow-lg)'
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <AccountBalanceWalletIcon sx={{ fontSize: 30, opacity: 0.9 }} />
                                    <Typography variant="subtitle1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                                        Saldo Disponible
                                    </Typography>
                                </Box>
                                <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
                                    ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    startIcon={<AddCardIcon />}
                                    sx={{ 
                                        backgroundColor: 'rgba(255,255,255,0.2)', 
                                        backdropFilter: 'blur(10px)',
                                        color: 'white',
                                        fontWeight: 600,
                                        boxShadow: 'none',
                                        ':hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                                    }}
                                    onClick={() => setOpenRecharge(true)}
                                >
                                    Recargar Saldo
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* History Section */}
                <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-primary)', fontWeight: 600 }}>
                    Historial de Wallet
                </Typography>
                
                <TableContainer component={Paper} sx={{ boxShadow: 'var(--shadow-md)', borderRadius: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'var(--color-surface)' }}>
                                <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Descripción</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Monto</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">Cargando...</TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((row) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell>{new Date(row.fecha).toLocaleDateString()}</TableCell>
                                        <TableCell>{row.descripcion}</TableCell>
                                        <TableCell align="right">
                                            <Typography 
                                                sx={{ 
                                                    fontWeight: 600, 
                                                    color: row.type === 'credit' ? 'success.main' : 'error.main' 
                                                }}
                                            >
                                                {row.type === 'credit' ? '+' : ''}
                                                ${Math.abs(row.monto).toFixed(2)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Recharge Modal */}
            <Dialog open={openRecharge} onClose={() => setOpenRecharge(false)}>
                <DialogTitle sx={{ fontWeight: 600, color: 'var(--color-primary)' }}>Recargar Billetera</DialogTitle>
                <DialogContent>
                    <Box sx={{ border: '1px solid var(--color-border)', borderRadius: 2, p: 2, mt: 1, boxShadow: 'var(--shadow-sm)' }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="600">
                                Monto a recargar (en dólares)
                            </Typography>
                            <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                                Ingresa el monto a recargar
                            </Typography>
                        </Box>
                        <TextField
                            autoFocus
                            fullWidth
                            placeholder="0.00"
                            type="number"
                            variant="outlined"
                            value={rechargeAmount}
                            onChange={(e) => setRechargeAmount(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                inputProps: { min: 0 }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenRecharge(false)} color="inherit">Cancelar</Button>
                    <Button 
                        onClick={handleRecharge} 
                        variant="contained"
                        disabled={!rechargeAmount || parseFloat(rechargeAmount) <= 0}
                        sx={{ 
                            background: 'var(--color-primary)',
                            ':hover': { background: 'var(--color-primary-dark)' }
                        }}
                    >
                        Confirmar Recarga
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PaganiniWallet;
