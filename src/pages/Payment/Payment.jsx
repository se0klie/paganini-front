import React, { useState } from 'react';
import {
    Box, Grid, Typography, Card, Button, Modal, TextField, Divider,
    Chip, List, ListItem, ListItemText, IconButton, CircularProgress, Alert, Fade
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import AddCardIcon from '@mui/icons-material/AddCard';
import DeleteIcon from '@mui/icons-material/Delete';

// Número máximo de tarjetas permitidas
const MAX_CARDS = 10;

const PaymentPage = () => {
    // Estado de tarjetas registradas
    const [cards, setCards] = useState([]);

    // ID de la tarjeta seleccionada para pagar
    const [selectedCardId, setSelectedCardId] = useState(null);

    // Estado del pago: null | 'loading' | 'success' | 'error'
    const [status, setStatus] = useState(null);

    // Control de apertura del modal para agregar tarjeta
    const [modalOpen, setModalOpen] = useState(false);

    // Datos de la nueva tarjeta a registrar
    const [newCard, setNewCard] = useState({
        label: '',
        number: '',
        expiration: '',
        cvv: '',
        nickname: ''
    });

    // Errores de validación para el formulario de tarjeta
    const [errors, setErrors] = useState({});

    // Validación básica de campos de tarjeta
    const validateCard = () => {
        const errs = {};
        if (!newCard.label.trim()) errs.label = 'Nombre requerido';
        if (!/^\d{16}$/.test(newCard.number)) errs.number = 'Número inválido (16 dígitos)';
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(newCard.expiration)) errs.expiration = 'Formato MM/AA';
        if (!/^\d{3,4}$/.test(newCard.cvv)) errs.cvv = 'CVV inválido (3-4 dígitos)';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // Abre el modal para agregar tarjeta
    const handleAddCard = () => setModalOpen(true);
    // Cierra el modal y limpia el formulario
    const handleCloseModal = () => {
        setModalOpen(false);
        setNewCard({ label: '', number: '', expiration: '', cvv: '', nickname: '' });
        setErrors({});
    };

    // Guarda la tarjeta si pasa validación y no supera el límite
    const handleSaveCard = () => {
        if (!validateCard()) return;
        if (cards.length >= MAX_CARDS) return;
        setCards([...cards, { ...newCard, id: Date.now() }]);
        handleCloseModal();
    };

    // Elimina una tarjeta y deselecciona si era la activa
    const handleDeleteCard = (id) => {
        setCards(cards.filter(card => card.id !== id));
        if (selectedCardId === id) setSelectedCardId(null);
    };

    // Simula el proceso de pago con random
    const handlePay = () => {
        if (!selectedCardId) return;
        setStatus('loading');
        setTimeout(() => {
            const success = Math.random() > 0.3;
            setStatus(success ? 'success' : 'error');
        }, 2000);
    };

    return (
        <Box sx={{ p: 4, backgroundColor: 'var(--color-surface)', minHeight: '100vh' }}>
            <Typography variant="h5" sx={{ color: 'var(--color-primary)', fontWeight: 700, mb: 4 }}>
                Página de Pagos
            </Typography>

            <Grid container spacing={4}>
                {/* Left Side */}
                <Grid item xs={12} md={6}>
                    <Card elevation={3} sx={{ p: 3, bgcolor: 'var(--color-surface)', borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ color: 'var(--color-primary)', fontWeight: 600, mb: 2 }}>
                            Tarjetas Registradas
                        </Typography>

                        {cards.length === 0 && (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography sx={{ color: 'var(--color-text-muted)', mb: 2 }}>
                                    No hay tarjetas registradas
                                </Typography>
                            </Box>
                        )}

                        <List>
                            {cards.map((card) => (
                                <Fade in key={card.id}>
                                    <ListItem
                                        button
                                        selected={selectedCardId === card.id}
                                        onClick={() => setSelectedCardId(card.id)}
                                        sx={{
                                            borderRadius: 1,
                                            mb: 1,
                                            transition: 'background-color 0.3s ease',
                                            bgcolor: selectedCardId === card.id ? 'var(--secondary-accent)' : 'transparent',
                                            color: selectedCardId === card.id ? 'white' : 'inherit',
                                            '&:hover': {
                                                bgcolor: selectedCardId === card.id ? 'var(--secondary-accent)' : 'var(--color-bg)'
                                            }
                                        }}
                                    >
                                        <ListItemText
                                            primary={card.nickname || card.label}
                                            secondary={`**** **** **** ${card.number.slice(-4)} • Exp: ${card.expiration}`}
                                            primaryTypographyProps={{ fontWeight: 600 }}
                                        />
                                        <Chip
                                            label="Tarjeta"
                                            size="small"
                                            sx={{ bgcolor: 'var(--color-primary)', color: 'white', mr: 1 }}
                                        />
                                        <IconButton onClick={() => handleDeleteCard(card.id)} edge="end">
                                            <DeleteIcon sx={{ color: 'var(--color-text-muted)' }} />
                                        </IconButton>
                                    </ListItem>
                                </Fade>
                            ))}
                        </List>

                        {cards.length < MAX_CARDS && (
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={handleAddCard}
                            >
                                Agregar tarjeta
                            </Button>
                        )}

                        <Divider sx={{ my: 3 }} />

                        <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            disabled={!selectedCardId}
                            startIcon={<PaymentIcon />}
                            onClick={handlePay}
                        >
                            Pagar
                        </Button>
                    </Card>
                </Grid>

                {/* Right Side */}
                <Grid item xs={12} md={6}>
                    <Card elevation={3} sx={{ p: 3, bgcolor: 'var(--color-surface)', borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ color: 'var(--color-primary)', fontWeight: 600, mb: 2 }}>
                            Estado del Pago
                        </Typography>

                        {status === 'loading' && (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <CircularProgress color="primary" />
                                <Typography sx={{ mt: 2, color: 'var(--color-text-muted)' }}>Procesando pago...</Typography>
                            </Box>
                        )}
                        {status === 'success' && <Alert severity="success">Pago realizado con éxito</Alert>}
                        {status === 'error' && <Alert severity="error">Hubo un error al procesar el pago</Alert>}
                        {!status && <Typography sx={{ color: 'var(--color-text-muted)' }}>Esperando acción del usuario</Typography>}
                    </Card>
                </Grid>
            </Grid>

            {/* Modal para agregar tarjeta */}
            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'var(--color-surface)',
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 'var(--shadow-lg)',
                    width: 400
                }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'var(--color-primary)' }}>
                        Agregar Tarjeta
                    </Typography>
                    <TextField
                        fullWidth
                        label="Nombre del titular"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={newCard.label}
                        onChange={(e) => setNewCard({ ...newCard, label: e.target.value })}
                        error={!!errors.label}
                        helperText={errors.label}
                    />
                    <TextField
                        fullWidth
                        label="Número (16 dígitos)"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={newCard.number}
                        onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                        error={!!errors.number}
                        helperText={errors.number}
                    />
                    <TextField
                        fullWidth
                        label="Fecha de expiración (MM/AA)"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={newCard.expiration}
                        onChange={(e) => setNewCard({ ...newCard, expiration: e.target.value })}
                        error={!!errors.expiration}
                        helperText={errors.expiration}
                    />
                    <TextField
                        fullWidth
                        label="CVV"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={newCard.cvv}
                        onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                        error={!!errors.cvv}
                        helperText={errors.cvv}
                    />
                    <TextField
                        fullWidth
                        label="Apodo (opcional)"
                        variant="outlined"
                        sx={{ mb: 3 }}
                        value={newCard.nickname}
                        onChange={(e) => setNewCard({ ...newCard, nickname: e.target.value })}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<AddCardIcon />}
                        onClick={handleSaveCard}
                        disabled={cards.length >= MAX_CARDS}
                    >
                        Guardar Tarjeta
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default PaymentPage;