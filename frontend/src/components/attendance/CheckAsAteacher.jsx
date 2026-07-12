import { Lock as LockIcon, Person, School as SchoolIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, Paper, TextField, Typography, Alert } from '@mui/material';
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import LinearProgress from '@mui/material/LinearProgress';
import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import apiBase from '../../config/api';
import { useAuth } from "../admin/AuthProvider";

const Loader = () => (
    <Box sx={{ width: '100%' }}>
        <LinearProgress color="secondary" />
    </Box>
);

const Login = () => {
    const { loginTeacher, logoutTeacher, isAuthenticatedTeacher } = useAuth();
    const [username, setUsername] = useState('Kamal');
    const [password, setPassword] = useState('Kamal');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const isFirstMount = useRef(true);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };
    useEffect(() => {
        if (isFirstMount.current && isAuthenticatedTeacher === false) {
            if ('vibrate' in navigator) {
                setTimeout(() => {
                    navigator.vibrate(50);
                }, 500);
            }
        }
        isFirstMount.current = false;

    }, [isAuthenticatedTeacher]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${apiBase}/teacherLogin`, {
                username,
                password,
            }, { withCredentials: true });

            if (response.status === 200) {
                loginTeacher();
                localStorage.removeItem('attendanceSavedDate');

            }
        } catch (err) {
            logoutTeacher();
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    if (isAuthenticatedTeacher === null) {
        return <div>{<Loader />}</div>;
    }

    if (isAuthenticatedTeacher) {
        return <Outlet />;
    }


    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '80vh',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--gradient-accent)',
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
                    component="form"
                    onSubmit={handleSubmit}
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

                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person/>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mb: { xs: 2, sm: 3 },
                                '& .MuiOutlinedInput-root': {
                                    height: { xs: 48, sm: 56 },
                                    '&:hover fieldset': {
                                        borderColor: 'var(--color-accent)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'var(--color-accent)',
                                        borderWidth: 2,
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    '&.Mui-focused': {
                                        color: 'var(--color-accent)',
                                    },
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleTogglePassword}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mb: { xs: 2, sm: 3 },
                                '& .MuiOutlinedInput-root': {
                                    height: { xs: 48, sm: 56 },
                                    '&:hover fieldset': {
                                        borderColor: 'var(--color-accent)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'var(--color-accent)',
                                        borderWidth: 2,
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    '&.Mui-focused': {
                                        color: 'var(--color-accent)',
                                    },
                                },
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
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
                                }
                            }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Box>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default Login;
