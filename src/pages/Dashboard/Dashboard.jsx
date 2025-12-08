import { Box, Typography, Button, Stack, Grid, Card, CardContent, Divider } from '@mui/material';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import HistoryIcon from '@mui/icons-material/History';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../shared components/Navbar';
import '../../style.css';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0.00)
    async function fetchBalance() {
        try {
            const response = await api.get(`/account/users/saldo?correo=${localStorage.getItem('correo')}`);
            setBalance(response.data.saldo)
        } catch (err) {
            console.error(err)
            return err
        }
    }

    useEffect(() => {
        fetchBalance()
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

                    <Grid item xs={12} md={4}>
                        <Card sx={{ boxShadow: 'var(--shadow-md)', borderRadius: 3 }}>
                            <CardContent>
                                <Typography
                                    variant="subtitle2"
                                    sx={{ color: 'var(--color-text-muted)' }}
                                >
                                    Pagos recibidos
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{ color: 'var(--color-success)', fontWeight: 600 }}
                                >
                                    $12,340.75
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{ boxShadow: 'var(--shadow-md)', borderRadius: 3 }}>
                            <CardContent>
                                <Typography
                                    variant="subtitle2"
                                    sx={{ color: 'var(--color-text-muted)' }}
                                >
                                    Pagos pendientes
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{ color: 'var(--color-warning)', fontWeight: 600 }}
                                >
                                    $2,150.00
                                </Typography>
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
                        startIcon={<SubscriptionsIcon />}
                        sx={{
                            background: 'var(--color-primary)',
                            color: 'white',
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            ':hover': {
                                background: 'var(--color-primary-dark)',
                            },
                        }}
                        onClick={() => navigate('/subscriptions')}
                    >
                        Mis Suscripciones
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