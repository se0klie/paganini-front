import { Box, Typography, Button, Stack, Grid, Card, CardContent, Divider } from '@mui/material';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import HistoryIcon from '@mui/icons-material/History';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../shared components/Navbar';
import '../../style.css';
import { useEffect, useState } from 'react';
import api from '../../axios';
import { fetchContacts } from '../../helpers/contacts';
import { RxAvatar } from "react-icons/rx";

export default function Dashboard() {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0.00)
    const [contacts, setContacts] = useState([])
    const [selectedContact, setSelectedContact] = useState('')

    async function fetchBalance() {
        try {
            const response = await api.get(`/users/saldo?correo=${localStorage.getItem('correo')}`);
            setBalance(response.data.saldo)
        } catch (err) {
            console.error(err)
            return err
        }
    }

    useEffect(() => {
        fetchBalance()
        fetchContacts(setContacts)
    }, [])

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
            <Navbar />

            <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ color: 'var(--color-primary)', fontWeight: 700 }}
                >
                    Bienvenido de nuevo 👋
                </Typography>
                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ color: 'var(--color-text-secondary)', mb: 4 }}
                >
                    Aquí puedes administrar tus pagos, facturas y balances de cuenta.
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ boxShadow: 'var(--shadow-md)', borderRadius: 3 }}>
                            <CardContent>
                                <Typography
                                    variant="subtitle2"
                                    sx={{ color: 'var(--color-text-muted)' }}
                                >
                                    Balance actual
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: 'var(--secondary-accent)',
                                        fontWeight: 600,
                                    }}
                                >
                                    ${balance.toFixed(2)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid>
                        <Card sx={{ boxShadow: 'var(--shadow-md)', borderRadius: 3 }}>
                            <CardContent sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1
                            }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 2,
                                    }}
                                >
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            color: 'var(--color-text-muted)',
                                            fontWeight: 500,
                                        }}
                                    >
                                        Contactos frecuentes
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            minWidth: 32,
                                            height: 32,
                                            borderRadius: 1,
                                            backgroundColor: 'var(--color-primary)',
                                            boxShadow: 'none',
                                            '&:hover': {
                                                backgroundColor: 'var(--color-primary-dark)',
                                                boxShadow: 'none',
                                            },
                                        }}
                                        // onClick={()=> navigate('/')}
                                    >
                                        +
                                    </Button>
                                </Box>

                                {contacts.slice(0, 2).map((contact) => (
                                    <Box
                                        key={contact.correo}
                                        sx={{
                                            display: 'flex',
                                            gap: 1,
                                            p: 1,
                                            alignItems: 'center',
                                            borderRadius: 1,
                                            cursor: 'pointer',
                                            justifyContent: 'flex-start',
                                            border: '2px solid #e0e6ed',
                                            background:
                                                selectedContact.correo === contact.correo ? '#edf1f5ff' : 'transparent',
                                            ':hover': { background: '#edf1f5ff' }
                                        }}
                                        onClick={() => {
                                            setSelectedContact(contact)
                                            navigate('/invoice', {
                                                state: {
                                                    selectedContact
                                                }
                                            })
                                        }}
                                    >
                                        <RxAvatar size={20} />
                                        <Typography>{contact.nombre}</Typography>
                                    </Box>

                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 5 }} />

                <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-primary)', fontWeight: 600 }}>
                    Acciones Rápidas
                </Typography>

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    justifyContent="center"
                    flexWrap="wrap"
                    useFlexGap
                >
                    <Button
                        startIcon={<ReceiptIcon />}
                        sx={{
                            background: 'var(--secondary-accent)',
                            color: 'white',
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            ':hover': {
                                background: 'var(--secondary-accent-dark)',
                            },
                        }}
                        onClick={() => navigate('/invoice')}
                    >
                        Nueva Factura
                    </Button>

                    <Button
                        startIcon={<HistoryIcon />}
                        sx={{
                            background: '#0369A1',
                            color: 'white',
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            ':hover': { background: '#025686' },
                        }}
                        onClick={() => navigate('/history')}
                    >
                        Historial de Transacciones
                    </Button>

                    <Button
                        startIcon={<SettingsIcon />}
                        sx={{
                            color: 'var(--color-text-secondary)',
                            border: '1px solid var(--color-border)',
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            ':hover': { background: 'var(--color-border)' },
                        }}
                        onClick={() => navigate('/account')}
                    >
                        Configuración
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}