// src/App.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

export default function App() {
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h3" gutterBottom>
        Welcome to My App
      </Typography>
      <Typography variant="body1" gutterBottom>
        Please login to access the dashboard.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/login"
        sx={{ mt: 2 }}
      >
        Go to Login
      </Button>
    </Box>
  );
}

