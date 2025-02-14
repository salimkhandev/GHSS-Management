import { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, CircularProgress, LinearProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Outlet } from "react-router-dom";
import { useAuth } from "../admin/AuthProvider";

const Login = () => {
    const Loader = () => (
        <Box sx={{ width: '100%' }}>
            <LinearProgress color="secondary" />
        </Box>
    );

    const { loginTeacher, logoutTeacher, isAuthenticatedTeacher } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword); // Toggle the state
    };

    // useEffect(() => {
    //     const checkAuth = async () => {
    //         try {
    //             const response = await fetch('https://ghss-management-backend.vercel.app/verify-token-asTeacher', {
    //                 method: 'GET',
    //                 credentials: 'include'
    //             });

    //             const data = await response.json();
    //             if (data.authenticated) {
    //                 loginTeacher();
    //             }
    //             else{
    //                 logoutTeacher();
    //             }
    //         } catch (error) {
    //             console.error('Error verifying token:', error);
    //             logoutTeacher();
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     checkAuth();
    // }, [loginTeacher, logoutTeacher]);

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('https://ghss-management-backend.vercel.app/teacherLogin', {
                username,
                password,
            }, { withCredentials: true });

            if (response.status === 200) {
                setLoading(false);
                loginTeacher();
                localStorage.removeItem('attendanceSavedDate');
            }
        } catch (err) {
            setError('Invalid username or password');
            logoutTeacher();
            setLoading(false);
        }
    };

    if (isAuthenticatedTeacher === null) {
        return <div>{<Loader />}</div>; // Show loading while checking authentication
    }

    if (isAuthenticatedTeacher) {
        return <Outlet />; // If authenticated, render protected content
    }

    return (
        <Box
            component="form"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                gap: 2,
                maxWidth: 400,
                margin: '0 auto',
            }}
            onSubmit={handleSubmit}
        >
            <Typography variant="h4">Teacher Login</Typography>
            <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={handleTogglePassword}
                                edge="end"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
                <Typography color="error" variant="body2">
                    {error}
                </Typography>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth>
                {loading ? <CircularProgress size={24} color='inherit' /> : 'Login'}
            </Button>
        </Box>
    );
};

export default Login;
