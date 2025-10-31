import { Box, Button } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    return (
        <Box>
            tas en el login, logeate
            <Button
                onClick={() => {
                    login({ name: 'user' })
                    navigate('/')
                }}>logear</Button>
        </Box>
    )
}