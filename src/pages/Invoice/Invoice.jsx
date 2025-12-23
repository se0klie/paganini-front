import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button, Tooltip, Stack, Select, MenuItem, Modal } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Navbar from '../../shared components/Navbar';
import ContactList from './components/ContactsList';
import TransactionSide from './components/TransactionSide';
import InvoicePreview from './components/InvoicePreview';
import { ErrorModal } from '../../shared components/Modals';
import api from '../../axios';
export default function Invoice() {
    const location = useLocation()
    const [selectedContact, setSelectedContact] = useState(location?.state?.selectedContact || '')
    const [amount, setAmount] = useState(0) //dollar
    const [currency, setCurrency] = useState('USD');
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false)
    async function fetchBalance() {
        try {
            const response = await api.get(`/users/saldo?correo=${localStorage.getItem('correo')}`);
            return (response.data.saldo)
        } catch (err) {
            console.error(err)
            return err
        }
    }

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
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 2 }}>
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

                    <Button
                        startIcon={<AccountBalanceWalletIcon />}
                        sx={{
                            color: 'var(--color-primary)',
                            textTransform: 'none',
                            fontWeight: 600,
                            border: '1px solid var(--color-primary)',
                            ':hover': { backgroundColor: 'rgba(10,37,64,0.1)' },
                        }}
                        onClick={() => navigate('/wallet')}
                    >
                        Paganini Wallet
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
                    </Box>

                    <Box
                        sx={{
                            flex: '1 1 50%',
                        }}
                    >
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ mb: 4 }}
                        >
                            <Typography
                                variant="h5"
                                sx={{ color: 'var(--color-primary)', fontWeight: 700 }}
                            >
                                Productos
                            </Typography>
                            <Select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                size="small"
                                sx={{ minWidth: 100 }}
                            >
                                <MenuItem value="USD">USD ($)</MenuItem>
                                <MenuItem value="EUR">EUR (€)</MenuItem>
                                <MenuItem value="MXN">MXN (MX$)</MenuItem>
                            </Select>
                        </Stack>
                        <InvoicePreview customer={selectedContact}
                            currency={currency}
                            amount={amount}
                        />
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
                                    ? 'Debe seleccionar un contacto a transferir' :
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
                                onClick={async () => {
                                    const balance = await fetchBalance()
                                    if (balance < amount) {
                                        setOpenModal(true)
                                    } else {
                                        navigate('/payment', {
                                            state: {
                                                amount,
                                                receiver: selectedContact?.correo
                                            }
                                        });
                                    }
                                }}
                                disabled={!selectedContact || amount <= 0}
                            >
                                Proceder al pago
                            </Button>
                        </span>
                    </Tooltip>
                </Box>
            </Box>
            <ErrorModal open={openModal} onClose={()=> setOpenModal(false)} message="Saldo insuficiente para la transacción" />
        </Box >
    );
}
