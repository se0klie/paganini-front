import { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export function PasswordField({ label = "Contraseña", value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      fullWidth
      type={showPassword ? "text" : "password"}
      placeholder={label}
      variant="outlined"
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment >
            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

