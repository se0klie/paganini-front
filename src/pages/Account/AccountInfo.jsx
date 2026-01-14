import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab } from "@mui/material"
import { GenericInputField, PasswordField } from "../../shared components/Inputs"
import { useEffect, useState } from "react";
import { ErrorModal, SuccessModal } from "../../shared components/Modals";
import api from "../../axios";
import Cookies from "js-cookie";
export default function AccountInfoTab() {
    const fields = [
        { label: 'Nombres', type: 'text', placeholder: 'Ej. Juan', var_name: 'nombre' },
        { label: 'Apellidos', type: 'text', placeholder: 'Ej. Pérez', var_name: 'apellido' },
        { label: 'Correo electrónico', type: 'email', placeholder: 'Ej. correo@correo.com', var_name: 'correo' },
        { label: 'Teléfono', type: 'tel', placeholder: 'Ej. 09 1234 5678', var_name: 'telefono' },
        { label: 'País', type: 'text', placeholder: 'Ej. Ecuador', var_name: 'pais' },
        { label: 'Ciudad', type: 'text', placeholder: 'Ej. Guayaquil', var_name: 'ciudad' },
    ]

    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        pais: '',
        ciudad: ''
    });
    const [newData, setNewData] = useState(form)
    const [passwordForm, setPasswordForm] = useState({
        oldpswd: '',
        newpswd: ''
    })
    const [errors, setErrors] = useState({
        oldpswd: "",
        newpswd: ""
    });

    const [successModal, setSuccessModal] = useState(false)
    const [editingMode, setEditingMode] = useState(false)
    const [editUserInfo, setEditUserInfo] = useState(false)
    const [editPassword, setEditPassword] = useState(false)
    const [errorModalOpen, setErrorModalOpen] = useState(false)
    const [open2FAModal, setOpen2FAModal] = useState(false)
    const [tab, setTab] = useState(0);

    async function fetchUserData() {
        try {
            const response = await api.get(`/users?correo=${localStorage.getItem('correo')}`);
            delete response.data.codigoQr
            delete response.data.saldo
            setForm(response.data);
            setNewData(response.data);
        } catch (err) {
            console.error("Error fetching user data:", err);
            return err
        }
    }

    useEffect(() => {
        fetchUserData();
    }, [])

    const handlePasswordChange = (field, value) => {
        setPasswordForm(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleChange = (label, value) => {
        let val = value;

        if (label === "telefono") {
            val = val.replace(/[^0-9]/g, "");

            if (val.length > 0) {
                val = "+" + val;
            }
        }

        setNewData(prev => ({ ...prev, [label]: val }));
    };

    async function handlePasswordUpdate() {
        let valid = true;
        const newErrors = { oldpswd: "", newpswd: "" };

        if (!passwordForm.oldpswd) {
            newErrors.oldpswd = "Debes ingresar tu contraseña actual";
            valid = false;
        }
        if (!passwordForm.newpswd) {
            newErrors.newpswd = "Debes ingresar la nueva contraseña";
            valid = false;
        } else if (passwordForm.newpswd.length < 6) {
            newErrors.newpswd = "La nueva contraseña debe tener al menos 6 caracteres";
            valid = false;
        }

        setErrors(newErrors);
        if (!valid) {
            setEditPassword(false)
            setErrorModalOpen(true)
            return false;
        };

        try {
            const formdata = {
                accessToken: Cookies.get('accessToken'),
                currentPassword: passwordForm.oldpswd,
                newPassword: passwordForm.newpswd
            }
            const response = await api.post('/auth/change-password', {
                accessToken: Cookies.get('accessToken'),
                currentPassword: passwordForm.oldpswd,
                newPassword: passwordForm.newpswd
            });
        } catch (err) {
            console.error("Error updating password:", err);
            setEditPassword(false)
            setErrorModalOpen(true)
            return false;
        }
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
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                    {fields.map((field) => (
                        <GenericInputField
                            key={field.var_name}
                            label={field.label}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={newData[field.var_name] || ""}
                            onChange={(value) => handleChange(field.var_name, value)}
                            isDisabled={!editingMode}
                        />
                    ))}

                </Box>

                <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
                    <Button sx={{ border: '1px solid blue' }} onClick={() => {
                        if (editingMode) {
                            setEditUserInfo(true)
                        } else {
                            setEditingMode(true)
                        }
                    }}>{editingMode ? 'Guardar cambios' : 'Editar perfil'}</Button>
                </Box>
            </Box>
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
                <Box>
                    <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Contraseña actual</Typography>
                    <PasswordField
                        label="Contraseña actual"
                        value={passwordForm.oldpswd}
                        error={errors.oldpswd}
                        onChange={(value) => handlePasswordChange("oldpswd", value)}
                    />
                </Box>
                <Box>
                    <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Nueva contraseña</Typography>
                    <PasswordField
                        label="Nueva contraseña"
                        value={passwordForm.newpswd}
                        error={errors.newpswd}
                        onChange={(value) => handlePasswordChange("newpswd", value)}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
                    <Button sx={{ color: 'red', border: '1px solid red' }}
                        onClick={() => setEditPassword(true)}>Cambiar contraseña</Button>
                </Box>
            </Box>

            <Dialog open={editUserInfo} onClose={() => setEditUserInfo(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Cambiar datos</DialogTitle>
                <DialogContent>
                    <Typography>
                        Estás a punto de modificar tu información personal. ¿Deseas continuar?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setEditUserInfo(false)} variant="outlined">Cancelar</Button>
                    <Button onClick={() => {
                        setForm(newData)
                        setEditUserInfo(false)
                        setEditingMode(false)
                        setSuccessModal(true)
                    }} variant="contained" color="primary">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editPassword} onClose={() => setEditPassword(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Cambiar contraseña</DialogTitle>
                <DialogContent>
                    <Typography>
                        Estás a punto de modificar tu contraseña. ¿Deseas continuar?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setEditPassword(false)} variant="outlined">Cancelar</Button>
                    <Button onClick={async () => {
                        await handlePasswordUpdate()
                    }} variant="contained" color="error">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={open2FAModal}
                onClose={() => setOpen2FAModal(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    Cambiar datos
                </DialogTitle>

                <DialogContent sx={{ pt: 1 }}>

                    <Tabs
                        value={tab}
                        onChange={(e, v) => setTab(v)}
                        variant="fullWidth"
                        sx={{ mb: 2 }}
                    >
                        <Tab label="Email" />
                        <Tab label="Teléfono" />
                    </Tabs>

                    {tab === 0 && (
                        <Box>
                            <Typography sx={{ fontSize: 14, mb: 1 }}>
                                Tu correo registrado:
                            </Typography>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor: '#f5f5f5',
                                    fontWeight: 600,
                                    textAlign: 'center'
                                }}
                            >
                                {form.email}
                            </Box>
                        </Box>
                    )}

                    {tab === 1 && (
                        <Box>
                            <Typography sx={{ fontSize: 14, mb: 1 }}>
                                Tu número registrado:
                            </Typography>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor: '#f5f5f5',
                                    fontWeight: 600,
                                    textAlign: 'center'
                                }}
                            >
                                {form.telefono}
                            </Box>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpen2FAModal(false)} variant="outlined">
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setSuccessModal(true)
                            setOpen2FAModal(false)
                        }}
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

            <ErrorModal open={errorModalOpen} onClose={() => setErrorModalOpen(false)}
                message="Contraseña anterior inválida."
            />
            <SuccessModal open={successModal} onClose={() => setSuccessModal(false)}
                message="Datos actualizados correctamente."
            />
        </Box >

    )
}