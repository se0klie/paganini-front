import { Box, Typography, Button, Stack, Grid, Card, CardContent, Divider } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../style.css";
import { useEffect } from "react";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!user?.token) {
    //         navigate('/login');
    //     }
    // }, [user]);

    return (
        <>
            {/* {user && */}
            <Box sx={{ minHeight: "100vh", backgroundColor: "var(--color-bg)" }}>
                <Box
                    sx={{
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-surface)",
                        p: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        boxShadow: "var(--shadow-md)",
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Paganini Dashboard
                    </Typography>
                    <Button
                        onClick={() => {
                            logout();
                            navigate("/login");
                        }}
                        sx={{
                            backgroundColor: "var(--color-error)",
                            color: "white",
                            ":hover": { backgroundColor: "var(--color-error)", opacity: 0.9 },
                        }}
                    >
                        Cerrar Sesión
                    </Button>
                </Box>

                {/* Main Content */}
                <Box sx={{ p: 4, maxWidth: "1200px", mx: "auto" }}>
                    {/* Welcome Section */}
                    <Typography variant="h4" gutterBottom sx={{ color: "var(--color-primary)", fontWeight: 700 }}>
                        Bienvenido de nuevo 👋
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ color: "var(--color-text-secondary)", mb: 4 }}>
                        Aquí puedes administrar tus pagos, facturas y balances de cuenta.
                    </Typography>

                    {/* Stats Section */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ boxShadow: "var(--shadow-md)", borderRadius: 3 }}>
                                <CardContent>
                                    <Typography variant="subtitle2" sx={{ color: "var(--color-text-muted)" }}>
                                        Balance actual
                                    </Typography>
                                    <Typography variant="h5" sx={{ color: "var(--secondary-accent)", fontWeight: 600 }}>
                                        $5,840.32
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card sx={{ boxShadow: "var(--shadow-md)", borderRadius: 3 }}>
                                <CardContent>
                                    <Typography variant="subtitle2" sx={{ color: "var(--color-text-muted)" }}>
                                        Pagos recibidos
                                    </Typography>
                                    <Typography variant="h5" sx={{ color: "var(--color-success)", fontWeight: 600 }}>
                                        $12,340.75
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card sx={{ boxShadow: "var(--shadow-md)", borderRadius: 3 }}>
                                <CardContent>
                                    <Typography variant="subtitle2" sx={{ color: "var(--color-text-muted)" }}>
                                        Pagos pendientes
                                    </Typography>
                                    <Typography variant="h5" sx={{ color: "var(--color-warning)", fontWeight: 600 }}>
                                        $2,150.00
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 5 }} />

                    {/* Action Buttons */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                        <Button
                            sx={{
                                background: "var(--secondary-accent)",
                                color: "white",
                                px: 4,
                                py: 1.5,
                                fontWeight: 600,
                                ":hover": {
                                    background: "var(--secondary-accent-dark)",
                                },
                            }}
                            onClick={() => navigate("/invoice")}
                        >
                            Nueva Factura
                        </Button>

                        <Button
                            sx={{
                                color: "white",
                                px: 4,
                                py: 1.5,
                                fontWeight: 600,
                                ":hover": { background: "#0369A1" },
                            }}
                            disabled={true}
                            onClick={() => navigate("/transactions")}
                        >
                            Transacciones
                        </Button>

                        <Button
                            sx={{
                                color: "white",
                                px: 4,
                                py: 1.5,
                                fontWeight: 600,
                                ":hover": { background: "var(--color-primary-dark)" },
                            }}
                            disabled={true}
                            onClick={() => navigate("/settings")}
                        >
                            Configuración
                        </Button>
                    </Stack>
                </Box>
            </Box>
            {/* )} */}
        </>
    );
}
