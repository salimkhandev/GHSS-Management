import {
    AdminPanelSettings as AdminPanelSettingsIcon,
    Lock as LockIcon,
    Person as PersonIcon,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    LinearProgress,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import axios from "axios";
import { Form, Formik } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { useState } from "react";
import { Outlet } from "react-router-dom";
import * as Yup from 'yup';
import { useAuth } from "./AuthProvider";
import React from 'react';

const validationSchema = Yup.object({
    username: Yup.string()
        .required('Username is required')
        .min(4, 'Username must be at least 4 characters'),
    password: Yup.string()
        .required('Password is required')
        .min(5, 'Password must be at least 5 characters'),
});

const ProtectedLoginRoute = () => {
    const { login, logout, isAuthenticated } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const Loader = () => (
        <Box sx={{ width: '100%' }}>
            <LinearProgress color="secondary" />
        </Box>
    );

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await axios.post(
                "https://ghss-management-backend.vercel.app/admin-login",
                { 
                    username: values.username, 
                    password: values.password 
                },
                { withCredentials: true }
            );
            login();
            enqueueSnackbar('Login successful!', { 
                variant: 'success',
                autoHideDuration: 2000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
        } catch (err) {
            logout();
            enqueueSnackbar('Invalid credentials. Please try again.', { 
                variant: 'error',
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (isAuthenticated === null) {
        return <div><Loader/></div>;
    }

    if (isAuthenticated) {
        return <Outlet />;
    }
    
    if('vibrate' in navigator){
        navigator.vibrate(100);
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        minHeight: '90vh',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                        padding: '20px',
                        backgroundImage: 'url("/images/pattern.png")',
                        backgroundBlendMode: 'overlay',
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        <Paper
                            elevation={12}
                            sx={{
                                padding: { xs: 3, sm: 4 },
                                borderRadius: 3,
                                maxWidth: 450,
                                width: '100%',
                                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 3,
                                }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <AdminPanelSettingsIcon
                                        sx={{
                                            fontSize: 80,
                                            color: '#1a237e',
                                            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                                        }}
                                    />
                                </motion.div>

                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontFamily: '"Poppins", sans-serif',
                                        fontWeight: 700,
                                        color: '#1a237e',
                                        textAlign: 'center',
                                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        letterSpacing: '-0.5px',
                                    }}
                                >
                                    Admin Login
                                </Typography>

                                <Formik
                                    initialValues={{ username: '', password: '' }}
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
                                                    mb: 3,
                                                    '& .MuiOutlinedInput-root': {
                                                        '&:hover fieldset': {
                                                            borderColor: '#1a237e',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#1a237e',
                                                        },
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                        color: '#1a237e',
                                                    },
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PersonIcon sx={{ color: '#1a237e' }} />
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
                                                    mb: 3,
                                                    '& .MuiOutlinedInput-root': {
                                                        '&:hover fieldset': {
                                                            borderColor: '#1a237e',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#1a237e',
                                                        },
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                        color: '#1a237e',
                                                    },
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LockIcon sx={{ color: '#1a237e' }} />
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
                                            mt: 2,
                                            mb: 2,
                                            py: 1.5,
                                            background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
                                            color: 'white',
                                            fontWeight: 600,
                                            fontSize: '1.1rem',
                                            textTransform: 'none',
                                            borderRadius: '10px',
                                            boxShadow: '0 4px 12px rgba(26, 35, 126, 0.4)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #0d47a1 30%, #1a237e 90%)',
                                                boxShadow: '0 6px 15px rgba(26, 35, 126, 0.5)',
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
            </motion.div>
        </AnimatePresence>
    );
};

export default ProtectedLoginRoute;