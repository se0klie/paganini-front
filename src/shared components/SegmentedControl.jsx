import React from 'react';
import { Box, Button } from '@mui/material';

const SegmentedControl = ({ options, selected, onSelect }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                border: '1px solid var(--color-primary)',
                borderRadius: '20px',
                overflow: 'hidden',
                width: 'fit-content',
            }}
        >
            {options.map((option) => (
                <Button
                    key={option.value}
                    onClick={() => onSelect(option.value)}
                    sx={{
                        flex: 1,
                        py: 0.5,
                        px: 2,
                        borderRadius: 0,
                        textTransform: 'none',
                        fontWeight: 600,
                        color: selected === option.value ? 'white' : 'var(--color-primary)',
                        backgroundColor: selected === option.value ? 'var(--color-primary)' : 'transparent',
                        borderLeft: '1px solid var(--color-primary)',
                        '&:first-of-type': {
                            borderLeft: 'none',
                        },
                        ':hover': {
                            backgroundColor: selected !== option.value ? 'rgba(10, 37, 64, 0.1)' : 'var(--color-primary-dark)',
                        },
                    }}
                >
                    {option.label}
                </Button>
            ))}
        </Box>
    );
};

export default SegmentedControl;
