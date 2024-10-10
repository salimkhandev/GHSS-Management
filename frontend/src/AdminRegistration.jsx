import { useState ,useEffect} from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminRegister = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    
    const [authenticated, setAuthenticated] = useState(true);
    
    // const navigate = useNavigate();
    // // Role is set to 'teacher' by default and doesn't need to be changed
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:3000/verify-token-asAdmin', {
                    method: 'GET',
                    credentials: 'include'
                });

                const data = await response.json();
console.log( data);

                if (data) {
                    //  navigate('/admin/TeacherRegistration/AdminRegistration')
return <h1>helos alim</h1>
                }
                if (data.authenticated) {
                    setAuthenticated(true);
                } else {
                    // navigate('/admin');
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                // navigate('/admin');
            } finally {
                // setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await axios.post('http://localhost:3000/admin-register', {
                username,
                password,
            }, { withCredentials: true });

            setMessage(response.data.message);
        } catch (err) {
            setMessage('Error registering admin');
        }
    };

    return (
        <>
  
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
            <Typography variant="h4">Admin Register</Typography>
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
            {message && (
                <Typography color="primary" variant="body2">
                    {message}
                </Typography>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Register
            </Button>
                </Box>
                </>
    );
};

export default AdminRegister;
