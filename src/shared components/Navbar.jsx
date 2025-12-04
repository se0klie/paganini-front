import { Box, Typography, Stack, Avatar, IconButton, Tooltip, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../style.css';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    const userInitial = user?.email ? user.email[0].toUpperCase() : 'U';

    const isActive = (path) => location.pathname === path;

    return (
        <Box
            sx={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-surface)',
                px: 3,
                py: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: 'var(--shadow-md)',
                position: 'sticky',
                top: 0,
                zIndex: 1100,
            }}
        >
            {/* Logo */}
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 800,
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    mr: 4 
                }}
                onClick={() => navigate('/')}
            >
                Paganini
            </Typography>

            {/* Menú de Navegación */}
            <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
                <Button
                    startIcon={<HistoryIcon />}
                    onClick={() => navigate('/history')}
                    sx={{
                        color: isActive('/history') ? 'var(--secondary-accent)' : 'var(--color-text-muted)',
                        fontWeight: isActive('/history') ? 700 : 500,
                        '&:hover': { color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                    }}
                >
                    Historial
                </Button>
                <Button
                    startIcon={<SubscriptionsIcon />}
                    onClick={() => navigate('/subscriptions')}
                    sx={{
                        color: isActive('/subscriptions') ? 'var(--secondary-accent)' : 'var(--color-text-muted)',
                        fontWeight: isActive('/subscriptions') ? 700 : 500,
                        '&:hover': { color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                    }}
                >
                    Suscripciones
                </Button>
            </Stack>

            {/* Perfil y Logout*/}
            <Stack direction="row" spacing={2} alignItems="center">
                <Tooltip title="Mi Cuenta">
                    <Avatar
                        sx={{
                            bgcolor: isActive('/account') ? 'white' : 'var(--secondary-accent)',
                            color: isActive('/account') ? 'var(--color-primary)' : 'white',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            width: 40,
                            height: 40,
                            transition: 'all 0.3s ease'
                        }}
                        onClick={() => navigate('/account')}
                    >
                        {userInitial}
                    </Avatar>
                </Tooltip>

                <Tooltip title="Cerrar Sesión">
                    <IconButton
                        onClick={() => {
                            logout();
                            navigate('/login');
                        }}
                        sx={{ color: 'white', '&:hover': { color: 'var(--color-error)' } }}
                    >
                        <LogoutIcon />
                    </IconButton>
                </Tooltip>
            </Stack>
        </Box>
    );
}