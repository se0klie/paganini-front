import { Box, Typography, Button, Dialog, DialogContent, DialogActions, DialogTitle, TextField, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { CiCircleRemove, CiCreditCard1, CiBank } from "react-icons/ci";
import api from '../../axios'
export default function PaymentMethodTab() {
    const [paymentType, setPaymentType] = useState('tarjeta'); // "tarjeta" | "cuentabanco"
    const [newPaymentData, setNewPaymentData] = useState({
        // tarjeta
        numeroTarjeta: "",
        titular: "",
        mes: "",
        year: "",
        cvv: "",
        tipoTarjeta: "", // C, D
        red: "",         // VISA, MC, AMEX, DINERS

        // cuenta banco
        nombreBanco: "",
        numeroCuenta: "",
        tipoCuenta: "", // Ahorro | Corriente
        identificacion: "",
    });

    const [cardsRegistered, setCardsRegistered] = useState([
        {
            id: 1,
            number: '1234 5678 9012 3456',
            holder: 'Juan Pérez',
            expiry: '12/27',
            type: 'Visa'
        },
        {
            id: 2,
            number: '4321 8765 2109 6543',
            holder: 'María López',
            expiry: '05/26',
            type: 'Mastercard'
        },
        {
            id: 3,
            number: '9876 5432 1098 7654',
            holder: 'Carlos Andrade',
            expiry: '09/28',
            type: 'Visa'
        },
        {
            id: 4,
            number: '1111 2222 3333 4444',
            holder: 'Fernanda Torres',
            expiry: '03/29',
            type: 'American Express'
        },
        {
            id: 5,
            number: '5555 6666 7777 8888',
            holder: 'Luis Martínez',
            expiry: '08/25',
            type: 'Discover'
        }
    ]);
    const [paymentMethods, setPaymentMethods] = useState({
        tarjeta: [],
        cuentabanco: [],
        ewallet: []
    });
    const [openRemovePM, setOpenRemovePM] = useState(false)
    const [openAddCard, setOpenAddCard] = useState(false)
    const [selectedCardId, setSelectedCardId] = useState(-1);
    const [newCardData, setNewCardData] = useState({
        number: '',
        holder: '',
        expiry: '',
        type: ''
    });

    async function fetchCards() {
        try {
            const response = await api.get(`/payment-methods/by-user?correo=${localStorage.getItem('correo')}`)
            setPaymentMethods(response.data);
            console.log('Payment methods fetched:', response.data);
        } catch (err) {
            console.error('Error fetching payment methods:', err);
            return err
        }
    }

    async function handleSavePayment() {
        let payload;
        if (paymentType === "tarjeta") {
            if (newPaymentData.numeroTarjeta.length < 13 || newPaymentData.numeroTarjeta.length > 19) {
                alert("Número de tarjeta inválido");
                return;
            }

            payload = {
                correo: localStorage.getItem('correo'),
                tipo: "tarjeta",
                card: {
                    numeroTarjeta: newPaymentData.numeroTarjeta,
                    titular: newPaymentData.titular,
                    mes: Number(newPaymentData.mes),
                    year: Number(newPaymentData.year),
                    cvv: newPaymentData.cvv,
                    tipo: newPaymentData.tipoTarjeta,
                    red: newPaymentData.red
                }
            };
        }

        if (paymentType === "cuentabanco") {
            payload = {
                correo: localStorage.getItem('correo'),
                tipo: "cuentabanco",
                bankAccount: {
                    nombreBanco: newPaymentData.nombreBanco,
                    numeroCuenta: newPaymentData.numeroCuenta,
                    tipoCuenta: newPaymentData.tipoCuenta,
                    titular: newPaymentData.titular,
                    identificacion: newPaymentData.identificacion
                }
            };
        }
        try {
            const response = await api.post('/payment-methods', payload);
        } catch (err) {
            console.error('Error adding payment method:', err);
            return err
        }

        fetchCards();
        setOpenAddCard(false);

    };

    async function handleRemovePM() {
        try {
            const response = await api.delete(`/payment-methods/${selectedCardId}`);
            console.log('Payment method removed:', response.data);
            fetchCards();
            setOpenRemovePM(false);
        } catch (err) {
            console.error('Error removing payment method:', err);
            return err
        }
    }
    useEffect(() => {
        fetchCards()
    }, [])

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

                {paymentMethods.cuentabanco.map((cuenta, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 2.2,
                            border: '1px solid var(--color-secondary)',
                            borderRadius: 2,
                            mb: 2,
                            transition: '0.2s ease',
                            '&:hover': { backgroundColor: 'var(--color-border)' },
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2.5,
                                flex: 1,
                            }}
                        >
                            <CiBank size={24} style={{ opacity: 0.8 }} />
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography sx={{ fontWeight: 600 }}>
                                    {cuenta.nombreBanco}
                                </Typography>
                                <Typography sx={{ color: 'gray', fontSize: '0.9rem' }}>
                                    {cuenta.numeroCuenta}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                                sx={{
                                    backgroundColor: 'var(--color-secondary)',
                                    color: 'white',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 1,
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    textTransform: 'capitalize',
                                }}
                            >
                                {cuenta.tipoCuenta}
                            </Box>

                            <CiCircleRemove
                                size={26}
                                style={{ color: 'red', cursor: 'pointer' }}
                                onClick={() => {
                                    setSelectedCardId(cuenta.id);
                                    setOpenRemovePM(true);
                                }}
                            />
                        </Box>
                    </Box>
                ))}

                {paymentMethods?.tarjeta.map((card, index) => {
                    const clean = String(card.numeroTarjeta).replace(/\s/g, '');
                    const masked = clean.length > 4 ? `**** **** **** ${clean.slice(-4)}` : clean;

                    return (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                p: 2.2,
                                border: '1px solid var(--color-secondary)',
                                borderRadius: 2,
                                mb: 2,
                                transition: '0.2s ease',
                                '&:hover': { backgroundColor: 'var(--color-border)' },
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2.5,
                                    flex: 1,
                                }}
                            >
                                <CiCreditCard1 size={24} style={{ opacity: 0.8 }} />

                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography sx={{ fontWeight: 600 }}>{masked}</Typography>
                                    <Typography sx={{ color: 'gray', fontSize: '0.9rem' }}>
                                        {card.titular}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        backgroundColor: 'var(--color-secondary)',
                                        color: 'white',
                                        px: 1.5,
                                        py: 0.4,
                                        borderRadius: 1,
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                    }}
                                >
                                    Exp: {card.mes}/{card.year}
                                </Box>

                                <CiCircleRemove
                                    size={26}
                                    style={{ color: 'red', cursor: 'pointer' }}
                                    onClick={() => {
                                        setSelectedCardId(card.id);
                                        setOpenRemovePM(true);
                                    }}
                                />
                            </Box>
                        </Box>
                    );
                })}

                {paymentMethods?.ewallet.map((wallet, index) => (
                    <Box key={`wallet-${index}`}>
                        {wallet.provider} - {wallet.email}
                    </Box>
                ))}

            </Box>
            <Dialog open={openRemovePM} onClose={() => setOpenRemovePM(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Eliminar método de pago</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Estás seguro de que deseas eliminar este método de pago?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenRemovePM(false)} variant="outlined">Cancelar</Button>
                    <Button onClick={() => {
                        handleRemovePM();
                    }} variant="contained" color="error">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openAddCard} onClose={() => setOpenAddCard(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Añadir método de pago</DialogTitle>

                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>

                    {/* SELECT TYPE */}
                    <TextField
                        select
                        label="Tipo de método"
                        fullWidth
                        value={paymentType}
                        InputLabelProps={{ sx: { fontWeight: 600 } }}
                        onChange={(e) => setPaymentType(e.target.value)}
                    >
                        <MenuItem value="tarjeta">Tarjeta</MenuItem>
                        <MenuItem value="cuentabanco">Cuenta bancaria</MenuItem>
                    </TextField>

                    <Typography sx={{ mt: 1 }}>
                        {paymentType === "tarjeta"
                            ? "Ingresa los datos de la tarjeta."
                            : "Ingresa los datos de la cuenta bancaria."}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>

                        {paymentType === "tarjeta" ? (
                            <>
                                <TextField
                                    label="Número de tarjeta"
                                    fullWidth
                                    value={newPaymentData.numeroTarjeta}
                                    type="number"
                                    InputLabelProps={{ sx: { fontWeight: 600 } }}
                                    onChange={(e) =>
                                        setNewPaymentData({ ...newPaymentData, numeroTarjeta: e.target.value })
                                    }
                                />

                                <TextField
                                    label="Titular"
                                    fullWidth
                                    type="text"
                                    value={newPaymentData.titular}
                                    InputLabelProps={{ sx: { fontWeight: 600 } }}
                                    onChange={(e) => {
                                        const onlyLetters = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
                                        setNewPaymentData({ ...newPaymentData, titular: onlyLetters });
                                    }}
                                />


                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <TextField
                                        label="Mes"
                                        type="number"
                                        value={newPaymentData.mes}
                                        InputLabelProps={{ sx: { fontWeight: 600 } }}
                                        onChange={(e) =>
                                            setNewPaymentData({ ...newPaymentData, mes: e.target.value })
                                        }
                                    />

                                    <TextField
                                        label="Año"
                                        type="number"
                                        value={newPaymentData.year}
                                        InputLabelProps={{ sx: { fontWeight: 600 } }}
                                        onChange={(e) =>
                                            setNewPaymentData({ ...newPaymentData, year: e.target.value })
                                        }
                                    />
                                </Box>

                                <TextField
                                    label="CVV"
                                    type="number"
                                    value={newPaymentData.cvv}
                                    InputLabelProps={{ sx: { fontWeight: 600 } }}
                                    onChange={(e) =>
                                        setNewPaymentData({ ...newPaymentData, cvv: e.target.value })
                                    }
                                />

                                <TextField
                                    select
                                    label="Tipo"
                                    fullWidth
                                    value={newPaymentData.tipoTarjeta}
                                    InputLabelProps={{ sx: { fontWeight: 600 } }}
                                    onChange={(e) =>
                                        setNewPaymentData({ ...newPaymentData, tipoTarjeta: e.target.value })
                                    }
                                >
                                    <MenuItem value="C">Crédito</MenuItem>
                                    <MenuItem value="D">Débito</MenuItem>
                                </TextField>

                                <TextField
                                    select
                                    label="Red"
                                    fullWidth
                                    value={newPaymentData.red}
                                    InputLabelProps={{ sx: { fontWeight: 600 } }}
                                    onChange={(e) =>
                                        setNewPaymentData({ ...newPaymentData, red: e.target.value })
                                    }
                                >
                                    <MenuItem value="VISA">VISA</MenuItem>
                                    <MenuItem value="MASTERCARD">MASTERCARD</MenuItem>
                                    <MenuItem value="AMEX">AMEX</MenuItem>
                                    <MenuItem value="DINERS">DINERS</MenuItem>
                                </TextField>
                            </>
                        ) : (
                            <>
                                <TextField
                                    label="Nombre del banco"
                                    fullWidth
                                    type="text"
                                    value={newPaymentData.nombreBanco}
                                    InputLabelProps={{ sx: { fontWeight: 600 } }}
                                    onChange={(e) => {
                                        const onlyLetters = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
                                        setNewPaymentData({ ...newPaymentData, nombreBanco: onlyLetters });
                                    }}
                                />


                                <TextField
                                    label="Número de cuenta"
                                    fullWidth
                                    type="number"
                                    value={newPaymentData.numeroCuenta}
                                    InputLabelProps={{ sx: { fontWeight: 600 } }}
                                    onChange={(e) =>
                                        setNewPaymentData({ ...newPaymentData, numeroCuenta: e.target.value })
                                    }
                                />

                                <TextField
                                    select
                                    label="Tipo de cuenta"
                                    fullWidth
                                    value={newPaymentData.tipoCuenta}
                                    InputLabelProps={{ sx: { fontWeight: 600 } }}
                                    onChange={(e) =>
                                        setNewPaymentData({ ...newPaymentData, tipoCuenta: e.target.value })
                                    }
                                >
                                    <MenuItem value="Ahorro">Ahorro</MenuItem>
                                    <MenuItem value="Corriente">Corriente</MenuItem>
                                </TextField>

                                <TextField
                                    label="Titular"
                                    fullWidth
                                    type="text"
                                    value={newPaymentData.titular}
                                    InputLabelProps={{ sx: { fontWeight: 600 } }}
                                    onChange={(e) => {
                                        const onlyLetters = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
                                        setNewPaymentData({ ...newPaymentData, titular: onlyLetters });
                                    }}
                                />


                                <TextField
                                    label="Identificación"
                                    fullWidth
                                    value={newPaymentData.identificacion}
                                    InputLabelProps={{ sx: { fontWeight: 600 } }}
                                    onChange={(e) =>
                                        setNewPaymentData({ ...newPaymentData, identificacion: e.target.value })
                                    }
                                />
                            </>
                        )}

                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenAddCard(false)} variant="outlined">
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => handleSavePayment()}
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

        </Box >
    )
}