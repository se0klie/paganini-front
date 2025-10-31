import { Box, Typography, Button, Link} from "@mui/material";
import {useAuth} from "../../context/AuthContext";

export default function Dashboard() {
    const {logout} = useAuth();
    return (
        <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h3" gutterBottom>
                Welcome to My App
            </Typography>
            <Typography variant="body1" gutterBottom>
                Tas loggeado mui bien
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={()=> logout()}
                sx={{ mt: 2 }}
            >
                Deslogear
            </Button>
        </Box>
    );
}
