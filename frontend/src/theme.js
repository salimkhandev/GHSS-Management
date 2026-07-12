import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1B2F6E',
      light: '#2a5298',
      dark: '#12204c',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#6B7DB8',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#EF4444',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B',
      dark: '#D97706',
    },
    success: {
      main: '#10B981',
      dark: '#059669',
    },
    background: {
      default: '#F0F2F8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none', // Modern, clean look
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(27, 47, 110, 0.12)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1B2F6E 0%, #2a5298 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1B2F6E 0%, #2a5298 100%)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1B2F6E 0%, #2a5298 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
