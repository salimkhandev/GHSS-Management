import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const AdminLogin = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setMessage('');

    //     try {
    //         const response = await axios.post('https://ghss-management-backend.vercel.app/admin-login', {
    //             username,
    //             password,
    //         }, { withCredentials: true });
    //         login()
    //         navigate('/admin/TeacherRegistration');
    //         setMessage(response.data.message);
    //     } catch (err) {
    //         setMessage('Error logging in');
    //     }
    // };
const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear any previous messages

    try {
        const response = await axios.post(
            'https://ghss-management-backend.vercel.app/admin-login',
            {
                username,
                password,
            },
            {
                withCredentials: true, // This allows cookies to be sent with the request
                headers: {
                    'Content-Type': 'application/json', // Optional, but can be specified
                },
            }
        );

        // Assuming `login` is a function that handles successful login actions
        login();
        
        // Navigate to the Teacher Registration page after a successful login
        navigate('/admin/TeacherRegistration');
        
        // Set the success message
        setMessage(response.data.message);
    } catch (err) {
        console.error('Login error:', err); // Log the error for debugging
        setMessage('Error logging in'); // Set the error message for user feedback
    }
};


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
            <Typography variant="h4">Admin Login</Typography>
            <TextField
                label="Username"
                autoComplete='username'
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                label="Password"
                autoComplete='current-password'
                variant="outlined"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {message && (
                <Typography color="primary" variant="body2">
                    {message}
                </Typography>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Login
            </Button>
            
        </Box>
    );
};

export default AdminLogin;
