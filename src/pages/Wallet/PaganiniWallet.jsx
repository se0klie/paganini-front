import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    InputAdornment
} from '@mui/material';
import AddCardIcon from '@mui/icons-material/AddCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useNavigate } from 'react-router-dom';
import api from '../../axios';

const PaganiniWallet = ({ isWithdraw = false }) => {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0.00);
    const [openRecharge, setOpenRecharge] = useState(false);
    const [rechargeAmount, setRechargeAmount] = useState('');

    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            const response = await api.get(`/users/saldo?correo=${localStorage.getItem('correo')}`);
            setBalance(response.data.saldo);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRecharge = () => {
        const amount = parseFloat(rechargeAmount);
        if (isNaN(amount) || amount <= 0) return;
        
        setOpenRecharge(false);
        setRechargeAmount('');
        
        navigate('/payment', { 
            state: { 
                amount: amount,
                type: 'recharge'
            } 
        });
    };
    
    // const handleWithdraw = () => {
    //     // To be implemented...
    //     const amount = parseFloat(rechargeAmount);
    //     if (isNaN(amount) || amount <= 0) return;
    //     console.log("Withdraw amount:", amount)
    //     setOpenRecharge(false);
    //     setRechargeAmount('');
    // };

    return (
        <Box sx={{ p: 4, maxWidth: '1000px', mx: 'auto' }}>
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
                                {isWithdraw ? 'Retirar Saldo' : 'Recargar Saldo'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recharge/Withdraw Modal */}
            <Dialog open={openRecharge} onClose={() => setOpenRecharge(false)}>
                <DialogTitle sx={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                    {isWithdraw ? 'Retirar de la Billetera' : 'Recargar Billetera'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ border: '1px solid var(--color-border)', borderRadius: 2, p: 2, mt: 1, boxShadow: 'var(--shadow-sm)' }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="600">
                                {isWithdraw ? 'Monto a retirar (en dólares)' : 'Monto a recargar (en dólares)'}
                            </Typography>
                            <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                                {isWithdraw ? 'Ingresa el monto a retirar' : 'Ingresa el monto a recargar'}
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
                        onClick={isWithdraw ? () => {} /* handleWithdraw */ : handleRecharge} 
                        variant="contained"
                        disabled={!rechargeAmount || parseFloat(rechargeAmount) <= 0}
                        sx={{ 
                            background: 'var(--color-primary)',
                            ':hover': { background: 'var(--color-primary-dark)' }
                        }}
                    >
                        {isWithdraw ? 'Confirmar Retiro' : 'Confirmar Recarga'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PaganiniWallet;
