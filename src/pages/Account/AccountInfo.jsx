import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { GenericInputField, PasswordField } from "../../shared components/Inputs"
import { useEffect, useState } from "react";
import { ErrorModal } from "../../shared components/Modals";
export default function AccountInfoTab() {
    const fields = [
        { label: 'Nombre', type: 'text', placeholder: 'Ej. Juan', var_name: 'nombre' },
        { label: 'Apellido', type: 'text', placeholder: 'Ej. Pérez', var_name: 'apellido' },
        { label: 'Correo electrónico', type: 'email', placeholder: 'Ej. correo@correo.com', var_name: 'email' },
        { label: 'Teléfono', type: 'tel', placeholder: 'Ej. +593 9 1234 5678', var_name: 'telefono' },
        { label: 'País', type: 'text', placeholder: 'Ej. Ecuador', var_name: 'pais' },
        { label: 'Ciudad', type: 'text', placeholder: 'Ej. Guayaquil', var_name: 'ciudad' },
    ]

    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        pais: '',
        ciudad: ''
    });
    const [passwordForm, setPasswordForm] = useState({
        oldpswd: '',
        newpswd: ''
    })
    const [errors, setErrors] = useState({
        oldpswd: "",
        newpswd: ""
    });

    const [editingMode, setEditingMode] = useState(false)
    const [editUserInfo, setEditUserInfo] = useState(false)
    const [editPassword, setEditPassword] = useState(false)
    const [errorModalOpen, setErrorModalOpen] = useState(false)

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

        setForm(prev => ({ ...prev, [label]: val }));
    };

    const handlePasswordUpdate = () => {
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
            return;
        };

        console.log("Updating password:", passwordForm);
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
                            value={form[field.var_name] || ""}
                            onChange={(value) => handleChange(field.var_name, value)}
                            isDisabled={!editingMode}
                        />
                    ))}

                </Box>

                <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
                    <Button>Cambiar método 2FA</Button>
                    <Button sx={{ border: '1px solid blue' }} onClick={() => {
                        if (editingMode) {
                            setEditUserInfo(true)
                        } else {
                            setEditingMode(true)
                        }
                    }}>Editar perfil</Button>
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
                    <Button onClick={() => console.log(form)} variant="contained" color="primary">
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
                    <Button onClick={() => {
                        handlePasswordUpdate()
                    }} variant="contained" color="error">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
            <ErrorModal open={errorModalOpen} onClose={() => setErrorModalOpen(false)}
                message="Hubo un error al actualizar la contraseña. Por favor, intenta de nuevo."
            />
        </Box >

    )
}