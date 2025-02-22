import { Lock as LockIcon, Person, School as SchoolIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import LinearProgress from '@mui/material/LinearProgress';
import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from "../admin/AuthProvider";

const Loader = () => (
    <Box sx={{ width: '100%' }}>
        <LinearProgress color="secondary" />
    </Box>
);

const Login = () => {
    const { loginTeacher, logoutTeacher, isAuthenticatedTeacher } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('https://ghss-management-backend.vercel.app/teacherLogin', {
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
    if('vibrate' in navigator){
        setTimeout(() => {
            navigator.vibrate(100);
        }, 500);
    }

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '80vh',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
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
                    elevation={12}
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        padding: { xs: 4, sm: 5 },
                        borderRadius: 3,
                        width: { xs: '340px', sm: '380px', md: '480px' },
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
                            gap: 2.5
                        }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <SchoolIcon
                                sx={{
                                    fontSize: 80,
                                    color: '#1F3E76',
                                    mb: 2
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
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#1976d2',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#1976d2',
                                    }
                                }
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
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#1976d2',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#1976d2',
                                    }
                                }
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{
                                mt: 2,
                                py: 1.5,
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '1.2rem',
                                textTransform: 'none',
                                borderRadius: '10px',
                                // '#1F3E76' use this in back with linear-gradient
                                background: 'linear-gradient(45deg, #1F3E76 30%, #1F3E76 90%)',
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    // '#1565c0' use this in back with linear-gradient
                                    background: 'linear-gradient(45deg, #1F3E76 30%, #1F3E76 90%)',
                                    boxShadow: '0 6px 15px rgba(25, 118, 210, 0.5)',
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
