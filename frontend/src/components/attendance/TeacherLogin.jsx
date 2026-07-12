import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Box, Button, CircularProgress, Paper, TextField, Typography, Alert } from '@mui/material';
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import axios from 'axios';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useAuth } from '../admin/AuthProvider';
import apiBase from '../../config/api';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { loginTeacher } = useAuth();

    const validationSchema = Yup.object({
        username: Yup.string()
            .required('Username is required')
            .min(3, 'Username must be at least 3 characters')
            .max(20, 'Username must be less than 20 characters'),
        password: Yup.string()
            .required('Password is required')
            .min(5, 'Password must be at least 5 characters')
    });

    const formik = useFormik({
        initialValues: {
            username: 'Kamal',
            password: 'Kamal',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await axios.post(`${apiBase}/teacherLogin`, {
                    username: values.username,
                    password: values.password,
                }, { withCredentials: true });

                if (response.status === 200) {
                    setLoading(false);
                    loginTeacher();
                    localStorage.removeItem('attendanceSavedDate');
                    setTimeout(() => {
                        navigate('/TakeAtten');
                    }, 1500);
                }
            } catch (err) {
                formik.setErrors({ submit: 'Invalid username or password' });
                setLoading(false);
                console.log(err);
            }
        },
    });

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
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
                // backgroundImage: 'url("/images/pattern.png")',
                backgroundColor: 'var(--color-surface)',
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
                    component="form"
                    onSubmit={formik.handleSubmit}
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
                            <SchoolIcon
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
                            Teacher Login
                        </Typography>

                        <Alert severity="info" sx={{ width: '100%', borderRadius: 2, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                            Demo credentials pre-filled for convenience.
                        </Alert>

                        <Box sx={{ width: '100%', mb: 2 }}>
                            <TextField
                                fullWidth
                                id="username"
                                name="username"
                                label="Username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.username && Boolean(formik.errors.username)}
                                helperText={formik.touched.username && formik.errors.username}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon sx={{ color: 'var(--color-primary)' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    width: '100%',
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
                            />

                            <TextField
                                fullWidth
                                id="password"
                                name="password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
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
                                sx={{
                                    width: '100%',
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
                            />
                        </Box>

                        {formik.errors.submit && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Typography
                                    color="error"
                                    variant="body2"
                                    sx={{
                                        fontFamily: '"Poppins", sans-serif',
                                        textAlign: 'center',
                                        fontWeight: 500,
                                        fontSize: '1rem',
                                    }}
                                >
                                    {formik.errors.submit}
                                </Typography>
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading || !formik.isValid}
                            sx={{
                                mt: { xs: 1, sm: 2 },
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
                            {loading ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <CircularProgress size={28} color="inherit"/>
                                </motion.div>
                            ) : (
                                'Login'
                            )}
                        </Button>
                    </Box>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default Login;
