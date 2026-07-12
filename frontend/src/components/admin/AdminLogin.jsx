import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Box, Button, Paper, TextField, Typography, Alert } from '@mui/material';
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import axios from 'axios';
import { Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { SnackbarProvider, useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import apiBase from '../../config/api';
import { useAuth } from './AuthProvider';

// Validation schema using Yup
const validationSchema = Yup.object({
    username: Yup.string()
        .required('Username is required')
        .min(4, 'Username must be at least 4 characters'),
    password: Yup.string()
        .required('Password is required')
        .min(5, 'Password must be at least 5 characters'),
});

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axios.post(
                `${apiBase}/admin-login`,
                values,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            login();
            enqueueSnackbar('Login successful!', {
                variant: 'success',
                style: { backgroundColor: 'var(--color-accent)', color: 'var(--color-text-on-dark)' }
            });
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (err) {
            console.error('Login error:', err);
            enqueueSnackbar('Invalid credentials. Please try again.', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
        }
        setSubmitting(false);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '90vh',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--gradient-primary)',
                padding: '20px',
                backgroundImage: 'url("/images/pattern.png")',
                backgroundBlendMode: 'overlay',
            }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <Paper
                    elevation={16}
                    sx={{
                        padding: { xs: 3.5, sm: 5 },
                        borderRadius: 4,
                        maxWidth: 420,
                        width: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.99)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: { xs: 2.5, sm: 3 },
                        }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <AdminPanelSettingsIcon
                                sx={{
                                    fontSize: { xs: 56, sm: 64 },
                                    color: 'var(--color-primary)',
                                    filter: 'drop-shadow(0 4px 8px rgba(26, 35, 126, 0.15))',
                                }}
                            />
                        </motion.div>

                        <Typography
                            variant="h4"
                            sx={{
                                fontFamily: '"Poppins", sans-serif',
                                fontWeight: 700,
                                color: 'var(--color-primary)',
                                textAlign: 'center',
                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
                                letterSpacing: '-0.3px',
                                fontSize: { xs: '1.5rem', sm: '2rem' },
                            }}
                        >
                            Admin Login
                        </Typography>

                        <Alert severity="info" sx={{ width: '100%', borderRadius: 2, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                            Demo credentials: admin/admin
                        </Alert>

                        <Formik
                            initialValues={{ username: 'admin', password: 'admin' }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                                <Form style={{ width: '100%' }}>
                                    <TextField
                                        label="Username"
                                        name="username"
                                        autoComplete="username"
                                        variant="outlined"
                                        fullWidth
                                        value={values.username}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.username && Boolean(errors.username)}
                                        helperText={touched.username && errors.username}
                                        sx={{
                                            mb: { xs: 2, sm: 3 },
                                            '& .MuiOutlinedInput-root': {
                                                height: { xs: 48, sm: 56 },
                                                '&:hover fieldset': {
                                                    borderColor: 'var(--color-primary)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'var(--color-primary)',
                                                    borderWidth: 2,
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                                '&.Mui-focused': {
                                                    color: 'var(--color-primary)',
                                                },
                                            },
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonIcon sx={{ color: 'var(--color-primary)' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <TextField
                                        label="Password"
                                        name="password"
                                        autoComplete="current-password"
                                        variant="outlined"
                                        type={showPassword ? "text" : "password"}
                                        fullWidth
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.password && Boolean(errors.password)}
                                        helperText={touched.password && errors.password}
                                        sx={{
                                            mb: { xs: 2, sm: 3 },
                                            '& .MuiOutlinedInput-root': {
                                                height: { xs: 48, sm: 56 },
                                                '&:hover fieldset': {
                                                    borderColor: 'var(--color-primary)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'var(--color-primary)',
                                                    borderWidth: 2,
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                                '&.Mui-focused': {
                                                    color: 'var(--color-primary)',
                                                },
                                            },
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon sx={{ color: 'var(--color-primary)' }} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={handleTogglePassword}
                                                        edge="end"
                                                        sx={{
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(26, 35, 126, 0.1)',
                                                            },
                                                        }}
                                                    >
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        disabled={isSubmitting}
                                        sx={{
                                            mt: { xs: 1, sm: 2 },
                                            mb: 2,
                                            py: 1.8,
                                            background: 'var(--gradient-primary)',
                                            color: 'white',
                                            fontWeight: 600,
                                            fontSize: { xs: '1rem', sm: '1.1rem' },
                                            textTransform: 'none',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 16px rgba(26, 35, 126, 0.3)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                background: 'var(--gradient-primary)',
                                                boxShadow: '0 8px 24px rgba(26, 35, 126, 0.4)',
                                                transform: 'translateY(-2px)',
                                            },
                                            '&:active': {
                                                transform: 'translateY(0)',
                                            },
                                            '&.Mui-disabled': {
                                                background: 'rgba(0, 0, 0, 0.12)',
                                            },
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                Logging in...
                                            </motion.div>
                                        ) : (
                                            'Login'
                                        )}
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Box>
                </Paper>
            </motion.div>
        </Box>
    );
};

const AdminLoginWithSnackbar = () => (
    <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
            '&.SnackbarItem-variantSuccess': {
                backgroundColor: 'var(--color-accent) !important',
            }
        }}
    >
        <AdminLogin />
    </SnackbarProvider>
);

export default AdminLoginWithSnackbar;
