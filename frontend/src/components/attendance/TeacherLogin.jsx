import { useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import { useAuth } from '../admin/AuthProvider';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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
                const response = await axios.post('https://ghss-management-backend.vercel.app/teacherLogin', {
                    username: values.username,
                    password: values.password,
                }, { withCredentials: true });
                
                if (response.status === 200) {
                    setLoading(false);
                    loginTeacher();
                    localStorage.removeItem('attendanceSavedDate');
                    navigate('/TakeAtten');
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
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
                padding: '20px',
            }}
        >
            <Paper
                elevation={3}
                component="form"
                onSubmit={formik.handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '40px',
                    borderRadius: '15px',
                    maxWidth: 400,
                    width: '100%',
                    gap: 3,
                    backgroundColor: 'white',
                }}
            >
                <SchoolIcon sx={{ fontSize: 50, color: '#1976d2', mb: 2 }} />
                <Typography 
                    variant="h4" 
                    sx={{ 
                        mb: 3, 
                        fontFamily: '"Poppins", sans-serif',
                        fontWeight: 600,
                        color: '#2c3e50'
                    }}
                >
                    Teacher Login
                </Typography>
                
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
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                                borderColor: '#1976d2',
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
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                                borderColor: '#1976d2',
                            },
                        },
                    }}
                />

                {formik.errors.submit && (
                    <Typography 
                        color="error" 
                        variant="body2" 
                        sx={{ 
                            fontFamily: '"Poppins", sans-serif',
                            textAlign: 'center'
                        }}
                    >
                        {formik.errors.submit}
                    </Typography>
                )}

                <Button 
                    type="submit"
                    variant="contained" 
                    fullWidth
                    disabled={loading || !formik.isValid}
                    sx={{
                        mt: 2,
                        py: 1.5,
                        backgroundColor: '#1976d2',
                        '&:hover': {
                            backgroundColor: '#1565c0',
                        },
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        fontFamily: '"Poppins", sans-serif',
                        fontWeight: 500,
                        borderRadius: '8px',
                    }}
                >
                    {loading ? <CircularProgress size={24} color='inherit'/> : 'Login'}
                </Button>
            </Paper>
        </Box>
    );
};

export default Login;
