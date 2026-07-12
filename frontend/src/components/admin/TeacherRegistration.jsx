import { School as ClassIcon, Lock as LockIcon, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
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
            sx={{
                display: 'flex',
                minHeight: '90vh',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--gradient-primary)',
                padding: '20px',
                backgroundImage: 'url("/images/pattern.png")',
                backgroundBlendMode: 'overlay',
            }}
        >
            <Paper
                elevation={16}
                sx={{
                    padding: { xs: 3.5, sm: 5 },
                    borderRadius: 4,
                    maxWidth: 480,
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
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            fontFamily: '"Poppins", sans-serif',
                            fontWeight: 700,
                            color: 'var(--color-primary)',
                            textAlign: 'center',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
                            letterSpacing: '-0.3px',
                            fontSize: { xs: '1.5rem', sm: '2rem' }
                        }}
                    >
                        Register Teacher
                    </Typography>

                    <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
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

            <FormControl 
                fullWidth 
                error={formik.touched.classId && Boolean(formik.errors.classId)}
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
                            <ClassIcon sx={{ color: 'var(--color-accent)' }} />
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
                    mt: { xs: 1, sm: 2 },
                    mb: 2,
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
                    },
                }}
            >
                {loading ? 'Registering...' : 'Register'}
            </Button>
                    </Box>
                </Box>
            </Paper>
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
