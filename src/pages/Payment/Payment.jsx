import React, { useState } from 'react';
import {
    Box, Grid, Typography, Card, Button, Modal, TextField, Divider,
    Chip, List, ListItem, ListItemText, IconButton, CircularProgress, Alert, Fade
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import AddCardIcon from '@mui/icons-material/AddCard';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate()
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
        <Box sx={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    flexWrap: { xs: 'column', md: 'row' },
                    height: 'calc(100vh - 32px)',
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 3,
                        bgcolor: 'var(--color-surface)',
                        boxShadow: 'var(--shadow-md)',
                        minHeight: '100%',
                        position: 'relative',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            mb: 3,
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                             onClick={() => navigate('/invoice')}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                color: 'var(--color-primary)',
                                borderColor: 'var(--color-border)',
                                ':hover': {
                                    borderColor: 'var(--color-primary)',
                                    backgroundColor: 'rgba(0,0,0,0.04)',
                                },
                            }}
                        >
                            Volver
                        </Button>
                    </Box>

                    <Typography
                        variant="h6"
                        sx={{ color: 'var(--color-primary)', fontWeight: 600, mb: 3, textAlign: 'center', width: '100%' }}
                    >
                        Tarjetas Registradas
                    </Typography>

                    {cards.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography sx={{ color: 'var(--color-text-muted)' }}>No hay tarjetas registradas</Typography>
                        </Box>
                    )}

                    <List sx={{ width: '100%' }}>
                        {cards.map((card) => (
                            <Fade in key={card.id}>
                                <ListItem
                                    button
                                    selected={selectedCardId === card.id}
                                    onClick={() => setSelectedCardId(card.id)}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 1,
                                        px: 2,
                                        py: 1.5,
                                        transition: 'all 0.3s ease',
                                        bgcolor: selectedCardId === card.id ? '#D0F0FD' : '#FFFFFF', // light blue if selected, white otherwise
                                        color: selectedCardId === card.id ? '#0A2540' : '#1A1A1A',  // dark text on light blue
                                        boxShadow: selectedCardId === card.id ? '0 4px 12px rgba(0, 162, 255, 0.2)' : 'none',
                                        '&:hover': {
                                            bgcolor: selectedCardId === card.id ? '#A8E0FF' : '#F0F0F0', // slightly darker blue if selected, light gray on hover
                                            cursor: 'pointer',
                                        },
                                    }}
                                >

                                    <ListItemText
                                        primary={card.nickname || card.label}
                                        secondary={`**** **** **** ${card.number.slice(-4)} • Exp: ${card.expiration}`}
                                        primaryTypographyProps={{ fontWeight: 600 }}
                                    />
                                    <Chip label="Tarjeta" size="small" sx={{ bgcolor: 'var(--color-primary)', color: 'white', mr: 1 }} />
                                    <IconButton onClick={() => handleDeleteCard(card.id)} edge="end">
                                        <DeleteIcon sx={{ color: 'var(--color-text-muted)' }} />
                                    </IconButton>
                                </ListItem>
                            </Fade>
                        ))}
                    </List>

                    {cards.length < MAX_CARDS && (
                        <Button
                            fullWidth
                            sx={{
                                mt: 3,
                                borderRadius: 2,
                                border: '2px solid var(--color-primary)',
                                color: 'var(--color-primary)',
                                backgroundColor: 'transparent',
                                fontWeight: 600,
                                px: 3,
                                py: 1.5,
                                '&:hover': {
                                    backgroundColor: 'rgba(10, 37, 64, 0.15)', // soft, semi-transparent fill
                                    color: 'var(--color-primary)',             // keep text same color
                                }

                            }}
                            onClick={handleAddCard}
                        >
                            Agregar tarjeta
                        </Button>
                    )}


                    <Divider sx={{ my: 4 }} />

                    <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        disabled={!selectedCardId}
                        startIcon={<PaymentIcon />}
                        sx={{
                            background: 'var(--secondary-accent)',
                            borderRadius: 2,
                            px: 3,
                            py: 1.5,
                            fontWeight: 600,
                            "&.Mui-disabled": {
                                background: "var(--button-prev-action)",
                                color: "white",
                                cursor: "not-allowed",
                                opacity: 0.7,
                            },
                        }}
                        onClick={handlePay}
                    >
                        Pagar
                    </Button>
                </Box>


                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 3,
                        bgcolor: 'var(--color-secondary)',
                        minHeight: '100%',
                    }}
                >
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                        Estado del Pago
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, textAlign: 'center' }}>
                        {status === 'loading' && (
                            <>
                                <CircularProgress color="primary" />
                                <Typography sx={{ mt: 2, color: 'white' }}>Procesando pago...</Typography>
                            </>
                        )}

                        {status === 'success' && (
                            <Box>
                                <Typography sx={{ fontSize: 64, mb: 2 }}>😃</Typography>
                                <Alert severity="success">Pago realizado con éxito</Alert>
                            </Box>
                        )}

                        {status === 'error' && (
                            <Box>
                                <Typography sx={{ fontSize: 64, mb: 2 }}>😞</Typography>
                                <Alert severity="error">Hubo un error al procesar el pago</Alert>
                            </Box>
                        )}

                        {!status && (
                            <Box>
                                <Typography sx={{ fontSize: 64, mb: 2 }}>🕒</Typography>
                                <Typography sx={{ color: 'white' }}>Esperando acción del usuario</Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>

            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'var(--color-surface)',
                        p: 5,
                        borderRadius: 3,
                        boxShadow: 'var(--shadow-lg)',
                        width: { xs: '90%', sm: 400 },
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'var(--color-primary)' }}>
                        Agregar Tarjeta
                    </Typography>
                    {["label", "number", "expiration", "cvv", "nickname"].map((field, idx) => (
                        <TextField
                            key={field}
                            fullWidth
                            label={field === "label" ? "Nombre del titular" :
                                field === "number" ? "Número (16 dígitos)" :
                                    field === "expiration" ? "Fecha de expiración (MM/AA)" :
                                        field === "cvv" ? "CVV" : "Apodo (opcional)"}
                            variant="outlined"
                            sx={{ mb: idx === 4 ? 3 : 2 }}
                            value={newCard[field]}
                            onChange={(e) => setNewCard({ ...newCard, [field]: e.target.value })}
                            error={!!errors[field]}
                            helperText={errors[field]}
                        />
                    ))}
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