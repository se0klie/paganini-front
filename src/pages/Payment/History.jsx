import React, { useState, useEffect } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    TextField,
    Alert,
    CircularProgress,
    Typography,
    Paper,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Pagination
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import Navbar from '../../shared components/Navbar';
import api from '../../axios'

const History = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [refundReason, setRefundReason] = useState('');
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    const filteredTransactions =
        filter === 'all'
            ? transactions
            : transactions.filter(t => t.tipo === filter);

    const groupByDate = (txs) => {
        return txs.reduce((acc, tx) => {
            const dateKey = new Date(tx.fecha).toLocaleDateString('es-ES');
            acc[dateKey] = acc[dateKey] || [];
            acc[dateKey].push(tx);
            return acc;
        }, {});
    };

    const groupedTransactions = groupByDate(filteredTransactions);


    const paginatedDates = Object.keys(groupedTransactions).slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    useEffect(() => {
        fetchTransactions();
    }, []);

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

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get(`/api/transacciones/historial?correo=${localStorage.getItem('correo')}`);
            if (response.status === 200) {
                setTransactions((buildTransactions(response.data)))
            }
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar el historial de transacciones:', err);
            setError('No se pudo cargar el historial. Inténtalo de nuevo más tarde.');
            setLoading(false);
        }
    };

    const calculateIncomeOutcome = (transactions) => {
        let income = 0;
        let outcome = 0;

        transactions.forEach(tx => {
            if (tx.monto >= 0) {
                income += tx.monto;
            } else {
                outcome += Math.abs(tx.monto); // absolute value for the chart
            }
        });

        return [
            { label: 'Ingresos', value: income },
            { label: 'Gastos', value: outcome },
        ];
    };

    const handleOpenModal = (transaction) => {
        setSelectedTransaction(transaction);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedTransaction(null);
        setRefundReason('');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: 'var(--color-bg)',
            }}
        >
            <Navbar />
            <Box sx={{ py: 4 }}>
                <Box
                    sx={{
                        maxWidth: '1400px',
                        margin: '0 auto',
                        px: { xs: 2, sm: 3, md: 4 },
                    }}
                >
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                            onClick={() => navigate('/')}
                            sx={{
                                color: 'var(--color-primary)',
                                '&:hover': {
                                    backgroundColor: 'var(--color-border)',
                                },
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 600,
                                color: 'var(--color-primary)',
                            }}
                        >
                            Historial de Transacciones
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                        <Button onClick={() => setFilter('all')}>Todos</Button>
                        <Button onClick={() => setFilter('envio')}>Envíos</Button>
                        <Button onClick={() => setFilter('recibo')}>Recibos</Button>
                        <Button onClick={() => setFilter('recarga')}>Recargas</Button>
                        <Button onClick={() => setFilter('retiro')}>Retiros</Button>
                    </Box>

                    <TableContainer
                        component={Paper}
                        sx={{
                            boxShadow: 'var(--shadow-md)',
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: 'var(--color-primary)' }}>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Fecha</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Beneficiario</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Descripción</TableCell>
                                    <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Monto</TableCell>
                                    {/* <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Acción</TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedDates.map((date) => (
                                    <React.Fragment key={date}>

                                        {/* Header de fecha */}
                                        <TableRow>
                                            <TableCell colSpan={4} sx={{ fontWeight: 700, background: '#f5f5f5' }}>
                                                {date}
                                            </TableCell>
                                        </TableRow>

                                        {/* Transacciones del día */}
                                        {groupedTransactions[date].map((transaction) => (
                                            <TableRow key={transaction.id}>
                                                <TableCell />
                                                <TableCell>{transaction.beneficiario}</TableCell>
                                                <TableCell>{transaction.descripcion}</TableCell>
                                                <TableCell align="right">
                                                    <Chip
                                                        label={transaction.monto.toLocaleString('es-ES', {
                                                            style: 'currency',
                                                            currency: 'USD',
                                                        })}
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: 'white',
                                                            backgroundColor:
                                                                transaction.monto < 0
                                                                    ? 'var(--color-error)'
                                                                    : 'var(--secondary-accent)',
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </TableBody>

                        </Table>
                    </TableContainer>
                    <Pagination
                        count={Math.ceil(Object.keys(groupedTransactions).length / rowsPerPage)}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
                    />

                    {/* Modal de Solicitud de Reembolso */}
                    <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                        <DialogTitle sx={{ backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <RequestQuoteIcon />
                            Solicitar Reembolso
                        </DialogTitle>
                        <DialogContent sx={{ mt: 3 }}>
                            <Typography sx={{ mb: 3, color: 'var(--color-text-secondary)' }}>
                                Por favor, describe el motivo para solicitar el reembolso de esta transacción.
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Motivo del reembolso"
                                variant="outlined"
                                value={refundReason}
                                onChange={(e) => setRefundReason(e.target.value)}
                            />
                        </DialogContent>
                    </Dialog>
                </Box>
            </Box>

        </Box>
    );
};

export default History;