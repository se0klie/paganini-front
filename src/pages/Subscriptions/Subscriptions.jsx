import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Chip,
    Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
// import api from '../../axios'; // TODO: Descomentar cuando se conecte con el backend real

export default function Subscriptions() {
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            
            // TODO: Reemplazar con el endpoint real del backend cuando esté disponible
            // Ejemplo: const response = await api.get('/api/suscripciones');
            // setSubscriptions(response.data);
            
            // Datos de ejemplo (mock data)
            const mockData = [
                {
                    id: 1,
                    fecha: '2024-01-15',
                    monto: 29.99,
                    descripcion: 'Suscripción Premium - Mensual',
                    activa: true
                },
                {
                    id: 2,
                    fecha: '2024-02-01',
                    monto: 9.99,
                    descripcion: 'Servicio de Streaming',
                    activa: true
                },
                {
                    id: 3,
                    fecha: '2024-03-10',
                    monto: 49.99,
                    descripcion: 'Plan Empresarial - Trimestral',
                    activa: true
                }
            ];
            
            setSubscriptions(mockData);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar suscripciones:', error);
            setError('Error al cargar las suscripciones');
            setLoading(false);
        }
    };

    const handleOpenModal = (subscription) => {
        setSelectedSubscription(subscription);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedSubscription(null);
    };

    const handleCancelSubscription = async () => {
        try {
            // TODO: Reemplazar con el endpoint real del backend cuando esté disponible
            // Ejemplo: await api.delete(`/api/suscripciones/${selectedSubscription.id}`);
            
            // Simular eliminación exitosa
            setSubscriptions(subscriptions.filter(sub => sub.id !== selectedSubscription.id));
            handleCloseModal();
        } catch (error) {
            console.error('Error al cancelar suscripción:', error);
            setError('Error al cancelar la suscripción');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: 'var(--color-bg)',
                py: 4,
            }}
        >
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
                        Mis Suscripciones
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Tabla de Suscripciones */}
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
                            <TableRow
                                sx={{
                                    backgroundColor: 'var(--color-primary)',
                                }}
                            >
                                <TableCell
                                    sx={{
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                    }}
                                >
                                    Fecha
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                    }}
                                >
                                    Monto
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                    }}
                                >
                                    Descripción
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                    }}
                                >
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                        <Typography color="var(--color-text-muted)">
                                            Cargando suscripciones...
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : subscriptions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                        <Typography color="var(--color-text-muted)">
                                            No tienes suscripciones activas
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                subscriptions.map((subscription) => (
                                    <TableRow
                                        key={subscription.id}
                                        sx={{
                                            '&:nth-of-type(odd)': {
                                                backgroundColor: 'var(--color-bg)',
                                            },
                                            '&:hover': {
                                                backgroundColor: 'var(--color-border)',
                                            },
                                        }}
                                    >
                                        <TableCell>
                                            <Typography
                                                sx={{
                                                    color: 'var(--color-text-primary)',
                                                    fontSize: '0.95rem',
                                                }}
                                            >
                                                {formatDate(subscription.fecha)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={formatCurrency(subscription.monto)}
                                                sx={{
                                                    backgroundColor: 'var(--secondary-accent)',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                sx={{
                                                    color: 'var(--color-text-secondary)',
                                                    fontSize: '0.95rem',
                                                }}
                                            >
                                                {subscription.descripcion}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="contained"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleOpenModal(subscription)}
                                                sx={{
                                                    textTransform: 'none',
                                                    fontWeight: 500,
                                                    backgroundColor: 'var(--color-error)',
                                                    '&:hover': {
                                                        backgroundColor: '#b33838',
                                                    },
                                                }}
                                            >
                                                Cancelar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Modal de Confirmación */}
                <Dialog
                    open={openModal}
                    onClose={handleCloseModal}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            boxShadow: 'var(--shadow-lg)',
                        },
                    }}
                >
                    <DialogTitle
                        sx={{
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <WarningAmberIcon />
                        Confirmar Cancelación
                    </DialogTitle>
                    <DialogContent sx={{ mt: 3 }}>
                        <Typography variant="body1" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
                            ¿Estás seguro de que deseas cancelar esta suscripción?
                        </Typography>
                        {selectedSubscription && (
                            <Box
                                sx={{
                                    p: 2,
                                    backgroundColor: 'var(--color-bg)',
                                    borderRadius: 1,
                                    border: '1px solid var(--color-border)',
                                }}
                            >
                                <Typography variant="body2" sx={{ mb: 1, color: 'var(--color-text-secondary)' }}>
                                    <strong>Descripción:</strong> {selectedSubscription.descripcion}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1, color: 'var(--color-text-secondary)' }}>
                                    <strong>Monto:</strong> {formatCurrency(selectedSubscription.monto)}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                    <strong>Fecha de inicio:</strong> {formatDate(selectedSubscription.fecha)}
                                </Typography>
                            </Box>
                        )}
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            Esta acción no se puede deshacer. La suscripción se cancelará inmediatamente.
                        </Alert>
                    </DialogContent>
                    <DialogActions sx={{ p: 2, gap: 1 }}>
                        <Button
                            onClick={handleCloseModal}
                            sx={{
                                textTransform: 'none',
                                color: 'var(--color-text-secondary)',
                                '&:hover': {
                                    backgroundColor: 'var(--color-border)',
                                },
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCancelSubscription}
                            variant="contained"
                            color="error"
                            sx={{
                                textTransform: 'none',
                                backgroundColor: 'var(--color-error)',
                                '&:hover': {
                                    backgroundColor: '#b33838',
                                },
                            }}
                        >
                            Confirmar Cancelación
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}
