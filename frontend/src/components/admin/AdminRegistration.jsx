import { useState ,useEffect} from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
const AdminRegister = () => {
    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();
   const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword); // Toggle the state
    };
    
    // Role is set to 'teacher' by default and doesn't need to be changed
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('https://ghss-management-backend.vercel.app/verify-token-asAdmin', {
                    method: 'GET',
                    credentials: 'include'
                });

                const data = await response.json();
                console.log(data); 


                if (data.RegisterAdmin) {

                   setAuthenticated(true);
                }
                else if (data.authenticated) {
                    setAuthenticated(true);
                } else {
                    navigate('/admin');
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                navigate('/admin');
            } finally {
                // setLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await axios.post('https://ghss-management-backend.vercel.app/admin-register', {
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
        {authenticated && (
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
                        type={showPassword ? "text" : "password"} // Switch between text and password

                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            />
            {message && (
                <Typography color="primary" variant="body2">
                    {message}
                </Typography>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Register
            </Button>
                </Box>)}
                </>
    );
};

export default AdminRegister;
