import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: { main: '#2C4068', light: '#5278C5', dark: '#1B2945' },
        secondary: { main: '#C9784A', contrastText: '#FFFFFF' },
        background: { default: '#F5F7FB', paper: '#FFFFFF' },
    },
    shape: { borderRadius: 8 },
    typography: {
        fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
        h4: { fontWeight: 700, letterSpacing: 0 },
        h5: { fontWeight: 700, letterSpacing: 0 },
        h6: { fontWeight: 700, letterSpacing: 0 },
        button: { fontWeight: 700, letterSpacing: 0 },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: { backgroundColor: '#F5F7FB' },
                '#root': { minHeight: '100vh' },
            },
        },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: { borderRadius: 8, paddingInline: 16, minHeight: 40 },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: { border: '1px solid rgba(44, 64, 104, 0.12)', borderRadius: 12, boxShadow: '0 8px 24px rgba(44, 64, 104, 0.08)' },
            },
        },
        MuiTextField: { defaultProps: { variant: 'outlined', size: 'small' } },
        MuiChip: { styleOverrides: { root: { fontWeight: 700 } } },
    },
});

export default theme;
