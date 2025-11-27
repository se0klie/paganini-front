import { Modal, Box, Typography, Button } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 3,
    textAlign: 'center',
};

export function ErrorModal({ open, onClose, title = 'Error', message }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="error-modal-title"
            aria-describedby="error-modal-description"
        >
            <Box sx={style}>
                <Typography
                    id="error-modal-title"
                    sx={{ fontWeight: 600 }}
                    variant="h6"
                    component="h2"
                    gutterBottom
                >
                    {title}
                </Typography>
                <Typography id="error-modal-description" sx={{ mb: 2 }}>
                    {message}
                </Typography>
                <Button variant="contained" color="error" onClick={onClose}>
                    Cerrar
                </Button>
            </Box>
        </Modal>
    );
}

export function SuccessModal({ open, onClose, title = 'Éxito', message }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="success-modal-title"
            aria-describedby="success-modal-description"
        >
            <Box sx={style}>
                <Typography
                    id="success-modal-title"
                    sx={{ fontWeight: 600 }}
                    variant="h6"
                    component="h2"
                    gutterBottom
                >
                    {title}
                </Typography>
                <Typography id="success-modal-description" sx={{ mb: 2 }}>
                    {message}
                </Typography>
                <Button variant="contained" color="success" onClick={onClose}>
                    Cerrar
                </Button>
            </Box>
        </Modal>
    );
}
