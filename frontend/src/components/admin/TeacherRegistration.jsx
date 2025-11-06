import { School as ClassIcon, Lock as LockIcon, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import axios from 'axios';
import { useFormik } from 'formik';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import apiBase from '../../config/api';

const RegisterTeacher = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [sectionsOfClsId, setSectionsOfClsId] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Validation schema using Yup
    const validationSchema = Yup.object({
        username: Yup.string()
            .required('Username is required')
            .min(3, 'Username must be at least 3 characters')
            .max(50, 'Username must be less than 50 characters'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            ),
        classId: Yup.string().required('Class selection is required'),
        sectionId: Yup.string().required('Section selection is required'),
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            classId: '',
            sectionId: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await axios.post(`${apiBase}/register-teacher`, {
                    username: values.username,
                    password: values.password,
                    class_id: values.classId,
                    section_id: values.sectionId,
                    role: 'teacher',
                }, { withCredentials: true });

                formik.resetForm();
                enqueueSnackbar('Teacher registered successfully!', { 
                    variant: 'success',
                    autoHideDuration: 2000
                });

                // Navigate to home after 1.5 seconds
                setTimeout(() => {
                    navigate('/');
                }, 1500);

            } catch (err) {
                enqueueSnackbar('Error registering teacher. Please try again.', { 
                    variant: 'error',
                    autoHideDuration: 2000
                });
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get(`${apiBase}/classes`);
                setClasses(response.data);
            } catch (err) {
                setError('Failed to fetch classes');
            }
        };
        fetchClasses();
    }, []);

    useEffect(() => {
        const fetchSectionsOfClassID = async () => {
            if (formik.values.classId) {
                try {
                    const response = await axios.post(`${apiBase}/get-sections`, 
                        { class_id: formik.values.classId }
                    );
                    setSectionsOfClsId(response.data);
                } catch (err) {
                    setError('Failed to fetch sections');
                }
            }
        };
        fetchSectionsOfClassID();
    }, [formik.values.classId]);

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80vh',
                gap: 3,
                width: '90%',
                maxWidth: '500px',
                margin: '40px auto',
                padding: { xs: 3, sm: 4 },
                backgroundColor: 'white',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                borderRadius: 3,
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #1976d2 0%, #9c27b0 100%)',
                    borderRadius: '3px 3px 0 0',
                }
            }}
        >
            <Typography 
                variant="h4" 
                sx={{ 
                    mb: 3, 
                    background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    fontWeight: 700,
                    textAlign: 'center',
                    fontSize: { xs: '1.75rem', sm: '2.125rem' }
                }}
            >
                Register Teacher
            </Typography>

            <TextField
                fullWidth
                id="username"
                name="username"
                label="Username"
                variant="outlined"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Person color="primary" />
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
                            <LockIcon color="primary" />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
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
                        '&.Mui-focused fieldset': {
                            borderColor: '#1976d2',
                        }
                    }
                }}
            />

            <FormControl 
                fullWidth 
                error={formik.touched.classId && Boolean(formik.errors.classId)}
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
            >
                <InputLabel id="class-label">Select Class</InputLabel>
                <Select
                    labelId="class-label"
                    id="classId"
                    name="classId"
                    value={formik.values.classId}
                    onChange={(e) => {
                        formik.setFieldValue('sectionId', '');
                        formik.handleChange(e);
                    }}
                    onBlur={formik.handleBlur}
                    label="Select Class"
                    startAdornment={
                        <InputAdornment position="start">
                            <ClassIcon sx={{ color: '#1976d2' }} />
                        </InputAdornment>
                    }
                >
                    {classes.map((classItem) => (
                        <MenuItem value={classItem.id} key={classItem.id}>
                            {classItem.name}
                        </MenuItem>
                    ))}
                </Select>
                {formik.touched.classId && formik.errors.classId && (
                    <Typography color="error" variant="caption">
                        {formik.errors.classId}
                    </Typography>
                )}
            </FormControl>

            <FormControl 
                fullWidth 
                error={formik.touched.sectionId && Boolean(formik.errors.sectionId)}
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
            >
                <InputLabel id="section-label">Select Section</InputLabel>
                <Select
                    labelId="section-label"
                    id="sectionId"
                    name="sectionId"
                    value={formik.values.sectionId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Select Section"
                    disabled={!formik.values.classId}
                >
                    {sectionsOfClsId.map((sectionItem) => (
                        <MenuItem value={sectionItem.id} key={sectionItem.id}>
                            {sectionItem.name}
                        </MenuItem>
                    ))}
                </Select>
                {formik.touched.sectionId && formik.errors.sectionId && (
                    <Typography color="error" variant="caption">
                        {formik.errors.sectionId}
                    </Typography>
                )}
            </FormControl>

            <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
                sx={{
                    mt: 2,
                    py: 1.5,
                    background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                    boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                    },
                    transition: 'all 0.3s ease-in-out',
                }}
            >
                {loading ? 'Registering...' : 'Register'}
            </Button>

        </Box>
    );
};

export default function TeacherRegistrationWithSnackbar() {
    return (
        <SnackbarProvider 
            maxSnack={3} 
            autoHideDuration={2000}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            <RegisterTeacher />
        </SnackbarProvider>
    );
}
