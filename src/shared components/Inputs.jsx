import { useState } from 'react';
import { TextField, InputAdornment, IconButton, Box, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export function PasswordField({ label = "Contraseña", value, onChange, error }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 0.5, position: "relative" }}>
            {error && (
                <Typography
                    variant="caption"
                    color="error"
                    sx={{
                        position: "absolute",
                        top: -16,
                        left: 0,
                        fontWeight: 500,
                    }}
                >
                    {error}
                </Typography>
            )}
            <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                placeholder={label}
                variant="outlined"
                size="small"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                error={!!error} // shows red border if error exists
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
}

export function GenericInputField({
    label = "Campo",
    type = "text", // "text", "number", "email", etc.
    value,
    onChange,
    placeholder,
    endIcon,
    onEndIconClick,
    isDisabled
}) {
    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={{ fontWeight: 'bold' }}>{label}</Typography>
            <TextField
                fullWidth
                type={type}
                label={label}
                placeholder={placeholder || label}
                variant="outlined"
                size="small"
                value={value}
                disabled={isDisabled || false}
                onChange={(e) => onChange(e.target.value)}
                InputProps={{
                    endAdornment: endIcon ? (
                        <InputAdornment position="end">
                            <IconButton onClick={onEndIconClick} edge="end">
                                {endIcon}
                            </IconButton>
                        </InputAdornment>
                    ) : null,
                }}
            />
        </Box>
    );
}

