import { Box, TextField, Typography, InputAdornment, Button } from "@mui/material";
export default function TransactionSide({ amount, setAmount }) {
    return (
        <Box sx={{ border: '1px solid var(--color-border)', borderRadius: 2, p: 2, boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box >
                <Typography variant="subtitle1" fontWeight="600">
                    Monto a transferir
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                    Ingresa el monto a transferir
                </Typography>
            </Box>

            <TextField
                fullWidth
                placeholder="0.00"
                type="number"
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    inputProps: { min: 0 }
                }}
                onChange={(e)=> setAmount(e.target.value)}
            />
        </Box>

    )
}