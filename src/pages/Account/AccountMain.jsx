import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import AccountInfoTab from "./AccountInfo";
import PaymentMethodTab from "./PaymentMethod";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function AccountMainPage() {
    const [currentTab, setCurrentTab] = useState('profile')
    const navigate = useNavigate()
    const [open2FAModal, setOpen2FAModal] = useState(false)
    return (
        <Box sx={{
            backgroundColor: 'var(--color-primary)',
            height: '100vh',
        }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5, maxWidth: 800, margin: '0 auto' }}>
                <Box sx={{
                    paddingTop: 10,
                    display: 'flex'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', mr: 2, backgroundColor: 'var(--color-secondary)', borderRadius: '50%', width: 40, height: 40 }}
                        onClick={() => { navigate(-1) }}>
                        <FaArrowLeft style={{ color: 'white' }} />
                    </Box>
                    <Button sx={{ backgroundColor: currentTab === 'profile' ? 'var(--color-bg)' : 'var(--color-secondary)', fontSize: 18, fontWeight: currentTab === 'profile' ? 'bold' : 'normal', px: 4 }}
                        onClick={() => setCurrentTab('profile')}
                    >
                        Mi cuenta
                    </Button>
                    <Button sx={{ backgroundColor: currentTab !== 'profile' ? 'var(--color-bg)' : 'var(--color-secondary)', fontSize: 18, fontWeight: currentTab !== 'profile' ? 'bold' : 'normal', px: 4 }}
                        onClick={() => {
                            setOpen2FAModal(true)
                            // setCurrentTab('payment')
                        }}
                    >
                        Mis métodos de pago
                    </Button>
                </Box>
                {currentTab === 'profile' ?
                    <AccountInfoTab />
                    :
                    <PaymentMethodTab />
                }
            </Box>
            <Dialog open={open2FAModal} onClose={() => setOpen2FAModal(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Verificación 2FA</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Typography sx={{ fontSize: 15, mb: 2 }}>
                        Para mayor seguridad, por favor ingresa el código que enviamos a tu correo.
                    </Typography>

                    <TextField
                        label="Código de verificación"
                        placeholder="Ingresa el código"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ sx: { fontWeight: 600 } }}
                        inputProps={{ maxLength: 6, style: { letterSpacing: 4, textAlign: 'center' } }}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpen2FAModal(false)} variant="outlined">Cancelar</Button>
                    <Button onClick={() => {
                        setOpen2FAModal(false)
                        setCurrentTab('payment')
                    }} variant="contained" color="success">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}