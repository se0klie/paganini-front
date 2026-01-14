import { Box, Typography, Button, Stack, Grid, Card, CardContent, Divider } from '@mui/material';
import ContactsIcon from '@mui/icons-material/Contacts';
import HistoryIcon from '@mui/icons-material/History';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../shared components/Navbar';
import '../../style.css';
import { useEffect, useState } from 'react';
import api from '../../axios';
import { fetchContacts } from '../../helpers/contacts';
import { RxAvatar } from "react-icons/rx";
import { BalanceChart, IncomeOutcomeChart } from './Stats';
export default function Dashboard() {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0.00)
    const [contacts, setContacts] = useState([])
    const [selectedContact, setSelectedContact] = useState('')
    const [transactions, setTransactions] = useState([])
    async function fetchBalance() {
        try {
            const response = await api.get(`/users/saldo?correo=${localStorage.getItem('correo')}`);
            setBalance(response.data.saldo)
        } catch (err) {
            console.error(err)
            return err
        }
    }

    const buildTransactions = (data) => {
        const envios = data.envios.map((e, index) => ({
            id: `envio-${index}`,
            tipo: 'envio',
            fecha: e.fecha ?? new Date(),
            beneficiario: `${e.receptorNombre} ${e.receptorApellido}`,
            descripcion: `📤 Envío a ${e.receptorCorreo}`,
            monto: -e.monto,
        }));

        const recibos = data.recibos.map((r, index) => ({
            id: `recibo-${index}`,
            tipo: 'recibo',
            fecha: r.fecha ?? new Date(),
            beneficiario: `${r.emisorNombre} ${r.emisorApellido}`,
            descripcion: `📥 Recibo de ${r.emisorCorreo}`,
            monto: r.monto,
        }));

        const recargas = data.recargas.map((r, index) => ({
            id: `recarga-${index}`,
            tipo: 'recarga',
            fecha: r.fecha ?? new Date(),
            beneficiario: r.titular,
            descripcion: `💳 Recarga ${r.red}`,
            monto: r.monto,
        }));

        const retiros = data.retiros.map((r, index) => ({
            id: `retiro-${index}`,
            tipo: 'retiro',
            fecha: r.fecha ?? new Date(),
            beneficiario: r.titular,
            descripcion: `🏦 Retiro a ${r.nombreBanco}`,
            monto: -r.monto,
        }));

        return [...envios, ...recibos, ...recargas, ...retiros]
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    };

    async function fetchTransactions() {
        try {
            const response = await api.get(`/api/transacciones/historial?correo=${localStorage.getItem('correo')}`);
            if (response.status === 200) {
                setTransactions(buildTransactions(response.data))
            }
        } catch (err) {
            console.error("Error fetching transactions:", err);
            return [];
        }
    }

    useEffect(() => {
        fetchBalance()
        fetchContacts(setContacts)
        fetchTransactions()
    }, [])


    const balanceByDate = transactions?.reduce((acc, tx) => {
        const date = new Date(tx.fecha).toLocaleDateString('es-ES');

        acc[date] = (acc[date] || 0) + tx.monto;

        return acc;
    }, {});


    const buildBalanceSeries = (transactions) => {
        let runningBalance = 0;

        return transactions
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
            .map((tx, index) => {
                runningBalance += tx.monto;

                // ⏱️ add artificial spacing (5 min apart)
                const date = new Date(tx.fecha);
                date.setMinutes(date.getMinutes() + index * 5);

                return {
                    date,
                    balance: runningBalance,
                };
            });
    };


    const balanceChartData = buildBalanceSeries(transactions);
    const calculateIncomeOutcome = (transactions) => {
        let income = 0;
        let outcome = 0;

        transactions.forEach(tx => {
            if (tx.monto >= 0) {
                income += tx.monto;
            } else {
                outcome += Math.abs(tx.monto);
            }
        });

        return [
            { label: 'Ingresos', value: income },
            { label: 'Gastos', value: outcome },
        ];
    };

    const incomeOutcomeData = calculateIncomeOutcome(transactions);


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
                    <Grid item xs={12} md={8}>
                        {balanceChartData.length > 0 ? (
                            <BalanceChart data={balanceChartData} />
                          
                        ) : (
                            <Card sx={{ borderRadius: 3, boxShadow: 'var(--shadow-md)' }}>
                                <CardContent>
                                    <Typography sx={{ fontWeight: 600, mb: 2 }}>
                                        Balance en el tiempo
                                    </Typography>
                                    <Typography sx={{ color: 'var(--color-text-secondary)' }}>
                                        No hay datos suficientes para mostrar el gráfico.
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}
                    </Grid>
                    <Grid item xs={12} md={8}>
                        {incomeOutcomeData.length > 0 ? (
                            <IncomeOutcomeChart data={incomeOutcomeData} />
                           
                        ) : (
                            <Card sx={{ borderRadius: 3, boxShadow: 'var(--shadow-md)' }}>
                                <CardContent>
                                    <Typography sx={{ fontWeight: 600, mb: 2 }}>
                                        Balance en el tiempo
                                    </Typography>
                                    <Typography sx={{ color: 'var(--color-text-secondary)' }}>
                                        No hay datos suficientes para mostrar el gráfico.
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}
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
                        Nueva transacción
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

                </Stack>
            </Box>
        </Box>
    );
}