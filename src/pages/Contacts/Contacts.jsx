import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { contactsService } from '../../services/contactsService';

export default function Contacts() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newAlias, setNewAlias] = useState('');
  const [contacts, setContacts] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('correo') || localStorage.getItem('email');
    if (saved) setCorreo(saved);
  }, []);

  const normalizedContacts = useMemo(() => {
    return (contacts || []).map((c) => {
      if (typeof c === 'string') return { correo: c, alias: '' };
      return {
        correo: c?.correo || c?.email || c?.contactEmail || '',
        alias: c?.alias || c?.nombre || '',
      };
    }).filter(c => c.correo);
  }, [contacts]);

  const canFetch = correo && /\S+@\S+\.\S+/.test(correo);

  const fetchContacts = async () => {
    if (!canFetch) return;
    try {
      setError('');
      setSuccess('');
      setFetching(true);
      const data = await contactsService.list(correo); // TODO: confirma endpoint en service
      setContacts(data);
    } catch (e) {
      setError(e?.response?.data?.message || 'Error al cargar contactos');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correo]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(newContactEmail)) {
      setError('Ingresa un correo válido para el contacto');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await contactsService.create(correo, newContactEmail, newAlias); // TODO: confirma body en service
      setNewContactEmail('');
      setNewAlias('');
      setSuccess('Contacto agregado correctamente');
      fetchContacts();
    } catch (e) {
      setError(e?.response?.data?.message || 'Error al crear el contacto');
    } finally {
      setLoading(false);
    }
  };

  const openDelete = (contact) => {
    setToDelete(contact);
    setConfirmOpen(true);
  };

  const closeDelete = () => {
    setConfirmOpen(false);
    setToDelete(null);
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await contactsService.remove(correo, toDelete.correo); // TODO: confirma endpoint en service
      setSuccess('Contacto eliminado');
      setContacts(prev => prev.filter(c => c.correo !== toDelete.correo));
      closeDelete();
    } catch (e) {
      setError(e?.response?.data?.message || 'Error al eliminar el contacto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ color: 'var(--color-primary)', '&:hover': { backgroundColor: 'var(--color-border)' } }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'var(--color-primary)' }}>
            Lista de Contactos
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 'var(--shadow-md)' }}>
          <Box
            component="form"
            onSubmit={handleAdd}
            sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 2fr 1fr auto' }, gap: 2 }}
          >
            <TextField label="Tu correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
            <TextField label="Correo del contacto" type="email" value={newContactEmail} onChange={(e) => setNewContactEmail(e.target.value)} required />
            <TextField label="Alias (opcional)" value={newAlias} onChange={(e) => setNewAlias(e.target.value)} />
            <Button
              type="submit"
              variant="contained"
              startIcon={<PersonAddAlt1Icon />}
              disabled={loading || !canFetch}
              sx={{ textTransform: 'none', backgroundColor: 'var(--secondary-accent)', '&:hover': { backgroundColor: 'var(--secondary-accent-dark)' } }}
            >
              Agregar
            </Button>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={fetchContacts}
              disabled={!canFetch || fetching}
              sx={{ textTransform: 'none', borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
            >
              {fetching ? 'Actualizando...' : 'Actualizar lista'}
            </Button>
          </Box>
        </Paper>

        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'var(--shadow-md)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'var(--color-primary)' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Correo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Alias</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {normalizedContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'var(--color-text-muted)' }}>
                    {fetching ? 'Cargando...' : 'No hay contactos'}
                  </TableCell>
                </TableRow>
              ) : (
                normalizedContacts.map((c) => (
                  <TableRow
                    key={c.correo}
                    sx={{ '&:nth-of-type(odd)': { backgroundColor: 'var(--color-bg)' }, '&:hover': { backgroundColor: 'var(--color-border)' } }}
                  >
                    <TableCell sx={{ color: 'var(--color-primary)' }}>{c.correo}</TableCell>
                    <TableCell sx={{ color: 'var(--color-text-secondary)' }}>{c.alias || '-'}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => openDelete(c)}
                        disabled={loading}
                        sx={{ backgroundColor: 'rgba(244,67,54,0.1)', '&:hover': { backgroundColor: 'rgba(244,67,54,0.2)' } }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={confirmOpen} onClose={closeDelete} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
            Confirmar eliminación
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Typography>¿Eliminar el contacto {toDelete?.correo}?</Typography>
            <Alert severity="warning" sx={{ mt: 2 }}>Esta acción no se puede deshacer.</Alert>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={closeDelete} sx={{ textTransform: 'none' }}>Cancelar</Button>
            <Button onClick={handleDelete} variant="contained" color="error" disabled={loading} sx={{ textTransform: 'none' }}>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
