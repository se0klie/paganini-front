import { Box, Typography, Button, Stack } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <Box sx={{ 
            p: 4, 
            textAlign: "center",
            backgroundColor: 'var(--color-bg)',
            minHeight: '100vh'
        }}>
            <Typography variant="h3" gutterBottom sx={{ color: 'var(--color-primary)' }}>
                Welcome to My App
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ color: 'var(--color-text-secondary)' }}>
                Estás conectado correctamente
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                <Button
                    sx={{
                        background: "var(--secondary-accent)",
                        color: "white",
                        ":hover": {
                            background: "var(--secondary-accent-dark)",
                        },
                    }}
                    onClick={() => navigate('/invoice')}
                >
                    Ir a Invoice
                </Button>
                <Button
                    sx={{
                        background: "var(--color-error)",
                        color: "white",
                        ":hover": {
                            background: "var(--color-error)",
                            opacity: 0.9
                        },
                    }}
                    onClick={() => logout()}
                >
                    Cerrar Sesión
                </Button>
            </Stack>
        </Box>
    );
}
