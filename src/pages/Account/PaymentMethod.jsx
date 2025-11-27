import { Box, Typography, Button, Dialog, DialogContent, DialogActions, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import { CiCircleRemove, CiCreditCard1 } from "react-icons/ci";

export default function PaymentMethodTab() {
    const [cardsRegistered, setCardsRegistered] = useState([
        {
            number: '1234 5678 9012 3456',
            holder: 'Juan Pérez',
            expiry: '12/27',
            type: 'Visa'
        },
        {
            number: '4321 8765 2109 6543',
            holder: 'María López',
            expiry: '05/26',
            type: 'Mastercard'
        },
        {
            number: '9876 5432 1098 7654',
            holder: 'Carlos Andrade',
            expiry: '09/28',
            type: 'Visa'
        },
        {
            number: '1111 2222 3333 4444',
            holder: 'Fernanda Torres',
            expiry: '03/29',
            type: 'American Express'
        },
        {
            number: '5555 6666 7777 8888',
            holder: 'Luis Martínez',
            expiry: '08/25',
            type: 'Discover'
        }
    ]);
    const [openRemoveCard, setOpenRemoveCard] = useState(false)
    const [openAddCard, setOpenAddCard] = useState(false)
    const [selectedCardIndex, setSelectedCardIndex] = useState(-1);
    const [newCardData, setNewCardData] = useState({
        number: '',
        holder: '',
        expiry: '',
        type: ''
    });

    const formatExpiry = (value) => {
        const clean = value.replace(/\D/g, '');

        if (clean.length === 1 && clean[0] > 1) return `0${clean[0]}/`;
        if (clean.length === 2) return `${clean.slice(0, 2)}/`;
        if (clean.length > 2) return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;

        return clean; // fallback
    };

    return (
        <Box sx={{ gap: 4, display: 'flex', flexDirection: 'column' }}>
            <Box
                sx={{
                    backgroundColor: 'var(--color-bg)',
                    height: 'max-content',
                    p: 2,
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 'bold' }}>
                        Métodos de pago
                    </Typography>
                    <Button sx={{ border: '1px solid blue', px: 5 }} onClick={() => setOpenAddCard(true)}>Añadir</Button>
                </Box>

                {cardsRegistered.map((card, index) => {
                    const clean = String(card.number).replace(/\s/g, '');
                    const masked = clean.length > 4 ? `**** **** **** ${clean.slice(-4)}` : clean;
                    return (
                        <Box sx={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: '1px solid var(--color-secondary)', borderRadius: 2,
                            '&:hover': {
                                backgroundColor: 'var(--color-border)',
                            },
                        }} key={index}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', }}>
                                <CiCreditCard1 />
                                <Typography key={index}>
                                    {masked}
                                </Typography>
                            </Box>
                            <CiCircleRemove size={25} style={{ color: 'red', cursor: 'pointer' }}
                                onClick={() => {
                                    setSelectedCardIndex(index)
                                    setOpenRemoveCard(true);
                                }}
                            />
                        </Box>
                    );
                })}
            </Box>
            <Dialog open={openRemoveCard} onClose={() => setOpenRemoveCard(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Eliminar método de pago</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Estás seguro de que deseas eliminar esta tarjeta de crédito?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenRemoveCard(false)} variant="outlined">Cancelar</Button>
                    <Button onClick={() => {
                        setCardsRegistered(prev =>
                            prev.filter((_, i) => i !== selectedCardIndex)
                        );
                    }} variant="contained" color="error">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openAddCard} onClose={() => setOpenAddCard(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Añadir método de pago</DialogTitle>
                <DialogContent sx={{ display: 'flex', gap: 1, flexDirection: 'column', mt: 1 }}>
                    <Typography>
                        Ingresa los datos necesarios para añadir una nueva tarjeta de crédito.
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        <TextField
                            label="Número de tarjeta"
                            fullWidth
                            type='number'
                            variant="outlined"
                            InputLabelProps={{ sx: { fontWeight: 600 } }}
                            onChange={(e) => setNewCardData(prev => ({
                                ...prev,
                                number: e.target.value
                            }))}
                        />

                        <TextField
                            label="Titular de tarjeta"
                            fullWidth
                            variant="outlined"
                            InputLabelProps={{ sx: { fontWeight: 600 } }}
                            onChange={(e) => setNewCardData(prev => ({
                                ...prev,
                                holder: e.target.value
                            }))}
                        />

                        <TextField
                            label="Fecha de vencimiento"
                            placeholder="MM/AA"
                            value={expiry}
                            onChange={(e) => setNewCardData(prev => ({
                                ...prev,
                                expiry: formatExpiry(e.target.value)
                            }))}
                            fullWidth
                            variant="outlined"
                            inputProps={{
                                maxLength: 5
                            }}
                            InputLabelProps={{ sx: { fontWeight: 600 } }}
                        />

                        <TextField
                            label="Tipo"
                            placeholder="Ej. Visa, Mastercard"
                            fullWidth
                            variant="outlined"
                            InputLabelProps={{ sx: { fontWeight: 600 } }}
                        />
                    </Box>

                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenAddCard(false)} variant="outlined">Cancelar</Button>
                    <Button onClick={() => {
                        if (newCardData.number && newCardData.holder && newCardData.expiry && newCardData.type) {
                            if (newCardData.number.length < 16) {
                                alert('El número de tarjeta debe tener al menos 16 dígitos.');
                                return;
                            }

                            setCardsRegistered(prev => [...prev, newCardData]);
                            setNewCardData({
                                number: '',
                                holder: '',
                                expiry: '',
                                type: ''
                            });
                            setOpenAddCard(false);
                        } else {
                            alert('Por favor, completa todos los campos.');
                        }
                    }} variant="contained" >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    )
}