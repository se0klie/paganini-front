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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import Navbar from '../../shared components/Navbar';
// import api from '../../axios'; // TODO: Descomentar cuando se conecte con el backend real

// Datos de ejemplo para las transacciones
const mockTransactions = [
    {
        id: 1,
        fecha: '2023-10-26',
        beneficiario: 'Amazon',
        descripcion: 'Compra de libros',
        monto: -75.5,
        status: 'default', // 'default', 'pending', 'refunded'
    },
    {
        id: 2,
        fecha: '2023-10-25',
        beneficiario: 'Netflix',
        descripcion: 'Suscripción mensual',
        monto: -15.0,
        status: 'refunded',
    },
    {
        id: 3,
        fecha: '2023-10-24',
        beneficiario: 'Starbucks',
        descripcion: 'Café y pastel',
        monto: -8.75,
        status: 'pending',
    },
];

const History = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [refundReason, setRefundReason] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError(null);
            // TODO: Reemplazar con el endpoint real del backend cuando esté disponible
            // const response = await api.get('/api/transactions');
            // setTransactions(response.data);

            // Usando datos de ejemplo mientras no hay backend
            setTransactions(mockTransactions);
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar el historial de transacciones:', err);
            setError('No se pudo cargar el historial. Inténtalo de nuevo más tarde.');
            setLoading(false);
        }
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

    const handleRequestRefund = async () => {
        if (!selectedTransaction || !refundReason.trim()) return;

        try {
            // Lógica para enviar la solicitud de reembolso al backend
            // TODO: Reemplazar con el endpoint real del backend
            // await api.post(`/api/transactions/${selectedTransaction.id}/refund`, {
            //   reason: refundReason,
            // });

            console.log(
                `Reembolso solicitado para la transacción ${selectedTransaction.id} por el motivo: "${refundReason}"`
            );

            // Actualizar el estado de la transacción a 'pending' en la UI
            setTransactions(
                transactions.map((t) =>
                    t.id === selectedTransaction.id ? { ...t, status: 'pending' } : t
                )
            );

            handleCloseModal();
        } catch (err) {
            console.error('Error al solicitar el reembolso:', err);
            // Aquí podrías mostrar un error al usuario en el modal
        }
    };

    const getButtonInfo = (transaction) => {
        switch (transaction.status) {
            case 'pending':
                return { text: 'Pendiente', disabled: true };
            case 'refunded':
                return { text: 'Reembolsado', disabled: true };
            default:
                return {
                    text: 'Solicitar Reembolso',
                    disabled: false,
                    onClick: () => handleOpenModal(transaction),
                };
        }
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
                    {/* Header */}
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                            onClick={() => navigate(-1)}
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

                    {/* Tabla de Transacciones */}
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
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                            <CircularProgress />
                                            <Typography sx={{ mt: 2, color: 'var(--color-text-muted)' }}>Cargando transacciones...</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : transactions.length === 0 && !error ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                            <Typography sx={{ color: 'var(--color-text-muted)' }}>No se encontraron transacciones.</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.map((transaction) => {
                                        const buttonInfo = getButtonInfo(transaction);
                                        return (
                                            <TableRow
                                                key={transaction.id}
                                                sx={{
                                                    '&:nth-of-type(odd)': { backgroundColor: 'var(--color-surface)' },
                                                    '&:hover': { backgroundColor: 'var(--color-border)' },
                                                }}
                                            >
                                                <TableCell>{new Date(transaction.fecha).toLocaleDateString('es-ES')}</TableCell>
                                                <TableCell>{transaction.beneficiario}</TableCell>
                                                <TableCell>{transaction.descripcion}</TableCell>
                                                <TableCell align="right">
                                                    <Chip
                                                        label={transaction.monto.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: 'white',
                                                            backgroundColor: transaction.monto < 0 ? 'var(--color-error)' : 'var(--secondary-accent)',
                                                        }}
                                                    />
                                                </TableCell>
                                                {/* <TableCell align="center">
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        disabled={buttonInfo.disabled}
                                                        onClick={buttonInfo.onClick}
                                                        sx={{
                                                            textTransform: 'none',
                                                            boxShadow: 'none',
                                                            backgroundColor: buttonInfo.disabled ? 'var(--button-prev-action)' : 'var(--color-secondary)',
                                                            '&:hover': {
                                                                backgroundColor: buttonInfo.disabled ? '' : 'var(--color-secondary-dark)',
                                                            },
                                                            '&.Mui-disabled': {
                                                                color: 'white',
                                                                backgroundColor: 'var(--button-prev-action)',
                                                            },
                                                        }}
                                                    >
                                                        {buttonInfo.text}
                                                    </Button>
                                                </TableCell> */}
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

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