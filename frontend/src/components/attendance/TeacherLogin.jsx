import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Box, Button, CircularProgress, Paper, TextField, Typography } from '@mui/material';
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
            username: '',
            password: '',
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
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                padding: '20px',
                // backgroundImage: 'url("/images/pattern.png")',
                backgroundColor: '#f0f0f0',
                backgroundBlendMode: 'overlay',
            }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <Paper
                    elevation={12}
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{
                        padding: { xs: 4, sm: 6 },

                        borderRadius: 3,
                        height: { xs: '80vh' },
                        width: { xs: '340px', sm: '380px', md: '480px' },
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        // backgroundColor: 'red',
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
                            gap: 4,
                        }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <SchoolIcon
                                sx={{
                                    fontSize: { xs: 80, sm: 100 },
                                    color: '#1F3E76',
                                    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                                }}
                            />
                        </motion.div>

                        <Typography
                            variant="h4"
                            sx={{
                                fontFamily: '"Poppins", sans-serif',
                                fontWeight: 700,
                                fontSize: { xs: '2rem', sm: '2.5rem' },
                                color: '#1F3E76',
                                textAlign: 'center',
                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                letterSpacing: '-0.5px',
                                mb: 2,
                            }}
                        >
                            Teacher Login
                        </Typography>

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
                                            <PersonIcon sx={{ color: '#666' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    width: '100%',
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        height: '56px',
                                        '&:hover fieldset': {
                                            borderColor: '#1976d2',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#1976d2',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: '1.1rem',
                                        '&.Mui-focused': {
                                            color: '#1976d2',
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
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleTogglePassword}
                                                edge="end"
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    width: '100%',
                                    '& .MuiOutlinedInput-root': {
                                        height: '56px',
                                        '&:hover fieldset': {
                                            borderColor: '#1976d2',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#1976d2',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: '1.1rem',
                                        '&.Mui-focused': {
                                            color: '#1976d2',
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
                                mt: 3,
                                py: 2,
                                background: '#1F3E76',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '1.2rem',
                                textTransform: 'none',
                                borderRadius: '10px',
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: '#1F3E76',
                                    // background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                                    boxShadow: '0 6px 15px rgba(25, 118, 210, 0.5)',
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
