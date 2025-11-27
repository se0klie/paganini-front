import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import AccountInfoTab from "./AccountInfo";
import PaymentMethodTab from "./PaymentMethod";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function AccountMainPage() {
    const [currentTab, setCurrentTab] = useState('profile')
    const navigate = useNavigate()
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
                    onClick={()=> {navigate(-1)}}>
                        <FaArrowLeft style={{ color: 'white' }} />
                    </Box>
                    <Button sx={{ backgroundColor: currentTab === 'profile' ? 'var(--color-bg)' : 'var(--color-secondary)', fontSize: 18, fontWeight: currentTab === 'profile' ? 'bold' : 'normal', px: 4 }}
                        onClick={() => setCurrentTab('profile')}
                    >
                        Mi cuenta
                    </Button>
                    <Button sx={{ backgroundColor: currentTab !== 'profile' ? 'var(--color-bg)' : 'var(--color-secondary)', fontSize: 18, fontWeight: currentTab !== 'profile' ? 'bold' : 'normal', px: 4 }}
                        onClick={() => setCurrentTab('payment')}
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
        </Box>
    )
}