import { useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const navigate=useNavigate()

    const handleSubmit = async (e) => {

    setLoading(true)
    e.preventDefault();
    setError('');
    
    try {
        const response = await axios.post('http://localhost:3000/teacherLogin', {
            username,
            password,
        }, { withCredentials: true });
        
        if (response.status === 200) {
                setLoading(false)
                // Handle successful login
                // Redirect the user or update the UI as needed
                console.log('Login successful');
            localStorage.removeItem('attendanceSavedDate');
                navigate('/TakeAtten')
            }
        } catch (err) {
            setError('Invalid username or password');
            setLoading(false)
            // for testing only i use the log
            console.log(err);
            
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
                variant="outlined"
                type="password"
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
                {loading?<CircularProgress size={24}  color='inherit'/>:'Login'}
            </Button>
        </Box>
    );
};

export default Login;
