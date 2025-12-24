import { Box, Button, Modal, Typography, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import api from "../../../axios";
import { ErrorModal, SuccessModal } from "../../../shared components/Modals";
import { fetchContacts } from '../../../helpers/contacts'

export default function ContactList({ selectedContact, setSelectedContact }) {
    const [contacts, setContacts] = useState([])
    const [openAddModal, setOpenAddModal] = useState(false)
    const [newContactData, setNewContactData] = useState({
        correoContact: ''
    })
    const [addContactStatus, setAddContactStatus] = useState({
        code: 0,
        message: ''
    });

    useEffect(() => {
        fetchContacts(setContacts);
    }, [])

    async function handleAddContact() {
        try {
            setOpenAddModal(false)
            if (newContactData.correoContact === '') {
                setAddContactStatus({ ...addContactStatus, code: 400, message: 'Necesitas añadir un correo.' })
                return
            }

            const response = await api.post(`users/${localStorage.getItem('correo')}/contacts`,
                newContactData
            )

            if (response.status === 200 || response.status === 201) {
                fetchContacts();
                setAddContactStatus({ ...addContactStatus, code: 200, message: 'Contacto agregado exitosamente.' })
            }
        } catch (err) {
            console.error('ADD CONTACT error', err)
            setAddContactStatus({ ...addContactStatus, code: 400, message: 'Error al agregar contacto. Verifica que el correo sea correcto y que el contacto no esté repetido.' })
            return err
        }
    }

    return (
        <Box sx={{ border: '1px solid var(--color-border)', borderRadius: 2, p: 2, boxShadow: 'var(--shadow-sm)' }}>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>Lista de Contactos</Typography>
                    <Button sx={{ background: 'var(--color-secondary)', color: 'white', px: 2, ':hover': { background: 'var(--color-primary)' } }} onClick={() => setOpenAddModal(true)}>Agregar contacto</Button>
                </Box>
                <Typography sx={{ color: 'gray' }}>Selecciona el contacto al que se realizará la transacción</Typography>
            </Box>
            <Box sx={{ mt: 2, maxHeight: '300px', overflowY: 'auto', p: 1, border: '1px solid #ccc', borderRadius: 2 }}>
                {contacts.length === 0 ? (
                    <Box>
                        <Typography>No tienes contactos agregados</Typography>
                    </Box>
                ) : (
                    contacts.map((contact) => (
                        <Box
                            key={contact.correo}
                            sx={{
                                display: 'flex',
                                gap: 1,
                                p: 1,
                                alignItems: 'center',
                                borderRadius: 1,
                                cursor: 'pointer',
                                background:
                                    selectedContact.correo === contact.correo ? '#edf1f5ff' : 'transparent',
                                ':hover': { background: '#edf1f5ff' }
                            }}
                            onClick={() => setSelectedContact(contact)}
                        >
                            <RxAvatar size={24} style={{ marginRight: '8px' }} />
                            <Typography>{contact.nombre}</Typography>
                        </Box>

                    ))
                )}
            </Box>
            <Modal open={openAddModal} onClose={() => {
                setOpenAddModal(false)
                setNewContactData({ correoContact: '' })
            }}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 350,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    <Typography variant="h6" fontWeight="bold">
                        Agregar contacto
                    </Typography>

                    <TextField
                        label="Correo del contacto"
                        fullWidth
                        value={newContactData.correoContact}
                        onChange={(e) => setNewContactData({ ...newContactData, correoContact: e.target.value })}
                    />


                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                        <Button onClick={() => setOpenAddModal(false)} color="inherit">
                            Cancelar
                        </Button>
                        <Button variant="contained" onClick={handleAddContact}>
                            Guardar
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <SuccessModal open={addContactStatus.code === 200} onClose={() => {
                setAddContactStatus({ ...addContactStatus, code: 0 })
                setNewContactData({ correoContact: '' })
                setOpenAddModal(false)

            }} message={addContactStatus.message} />
            <ErrorModal open={addContactStatus.code === 400} onClose={() => {
                setAddContactStatus({ ...addContactStatus, code: 0 })
                setNewContactData({ correoContact: '' })
                setOpenAddModal(false)

            }} message={addContactStatus.message} />

        </Box>
    )
}