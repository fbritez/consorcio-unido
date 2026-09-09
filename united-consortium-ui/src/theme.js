import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: { main: '#2C4068' },
        secondary: { main: '#5278C5' },
        background: { default: '#FCF8F0', paper: '#FFFFFF' },
    },
    shape: { borderRadius: 8 },
    typography: { fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif' },
    components: {
        MuiButton: { defaultProps: { disableElevation: true } },
        MuiCard: {
            styleOverrides: {
                root: { border: '1px solid rgba(44, 64, 104, 0.12)', boxShadow: '0 4px 14px rgba(44, 64, 104, 0.08)' },
            },
        },
    },
});

export default theme;
