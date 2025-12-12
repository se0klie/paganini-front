import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem } from "@mui/material"
import { useState, useEffect } from "react";
import { CiCircleRemove, CiCreditCard1, CiBank } from "react-icons/ci";
import api from "../../axios";

export default function PaymentMethodList({ selectedPaymentMethod, setSelectedPaymentMethod }) {
    const [paymentType, setPaymentType] = useState('tarjeta'); // "tarjeta" | "cuentabanco"
    const [paymentMethods, setPaymentMethods] = useState({
        tarjeta: [],
        cuentabanco: [],
        ewallet: []
    });
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
    const [openAddCard, setOpenAddCard] = useState(false)

    async function fetchCards() {
        try {
            const response = await api.get(`/payment-methods/by-user?correo=${localStorage.getItem('correo')}`)
            setPaymentMethods(response.data);
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

    useEffect(() => {
        fetchCards();
    }, [])

    return (
        <Box
            sx={{
                border: '1px solid var(--color-border)',
                borderRadius: 2,
                p: 2,
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                    }}
                >
                    <Typography sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                        Método de pago
                    </Typography>

                    <Button
                        sx={{
                            background: 'var(--color-secondary)',
                            color: 'white',
                            px: 2,
                            ':hover': { background: 'var(--color-primary)' },
                        }}
                        onClick={() => setOpenAddCard(true)}
                    >
                        Añadir
                    </Button>
                </Box>

                <Typography sx={{ color: 'gray' }}>
                    Selecciona el método de pago a usar
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                {paymentMethods?.tarjeta?.length > 0 ? (
                    paymentMethods.tarjeta.map((card, index) => {
                        const clean = String(card.numeroTarjeta).replace(/\s/g, '');
                        const masked =
                            clean.length > 4
                                ? `**** **** **** ${clean.slice(-4)}`
                                : clean;

                        return (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    p: 2,
                                    border: '1px solid var(--color-secondary)',
                                    borderRadius: 2,
                                    transition: '0.2s ease',
                                    backgroundColor: card.id === selectedPaymentMethod.id ? 'var(--color-border)' : 'var(--color-surface)'
                                }}
                                onClick={() => setSelectedPaymentMethod(card)}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                    <CiCreditCard1 size={26} style={{ opacity: 0.8 }} />

                                    <Box>
                                        <Typography sx={{ fontWeight: 600 }}>{masked}</Typography>
                                        <Typography
                                            sx={{ color: 'gray', fontSize: '0.9rem' }}
                                        >
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

                                </Box>
                            </Box>
                        );
                    })
                ) : (
                    <Typography sx={{ color: 'gray', fontSize: '0.9rem', ml: 1 }}>
                        No tienes tarjetas registradas
                    </Typography>
                )}

                {paymentMethods?.ewallet?.length > 0 ? (
                    paymentMethods.ewallet.map((wallet, index) => (
                        <Box
                            key={`wallet-${index}`}
                            sx={{
                                p: 1.5,
                                border: '1px solid var(--color-border)',
                                borderRadius: 2,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                transition: '0.2s ease',
                                '&:hover': { backgroundColor: 'var(--color-border)' },
                            }}
                        >
                            <Box>
                                <Typography sx={{ fontWeight: 600 }}>
                                    {wallet.provider}
                                </Typography>
                                <Typography sx={{ color: 'gray', fontSize: '0.9rem' }}>
                                    {wallet.email}
                                </Typography>
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Typography sx={{ color: 'gray', fontSize: '0.9rem', ml: 1 }}>
                        No tienes billeteras digitales registradas
                    </Typography>
                )}
            </Box>

            <Dialog open={openAddCard} onClose={() => setOpenAddCard(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Añadir método de pago</DialogTitle>

                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>

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
        </Box>

    )
}