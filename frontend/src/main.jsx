import React from 'react'
import { createRoot } from 'react-dom/client'
import { SnackbarProvider, useSnackbar } from 'notistack'
import Alert from '@mui/material/Alert'
import { AuthProvider } from './components/admin/AuthProvider'
import App from './App'
import './index.css'

// Custom success snackbar with blue gradient to match app theme
const SuccessSnackbar = React.forwardRef(function SuccessSnackbar({ id, message }, ref) {
  const { closeSnackbar } = useSnackbar();
  return (
    <Alert
      ref={ref}
      onClose={() => closeSnackbar(id)}
      variant="filled"
      icon={false}
      sx={{
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: '#fff',
        boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
        borderRadius: '12px',
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 600,
        fontSize: '1rem',
        padding: '12px 20px',
        minWidth: '280px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      {message}
    </Alert>
  );
});

createRoot(document.getElementById('root')).render(
  <SnackbarProvider
    maxSnack={3}
    autoHideDuration={2500}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    Components={{ success: SuccessSnackbar }}
  >
    <AuthProvider>
      <App />
    </AuthProvider>
  </SnackbarProvider>
)
