import {
    AdminPanelSettings,
    School,
    Visibility,
    VisibilityOff
} from "@mui/icons-material";
import {
    Box,
    Button,
    CircularProgress,
    CssBaseline,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
    Alert
} from "@mui/material";
import { useFormik } from "formik";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import apiBase from '../../config/api';


// Updated Validation schema
const validationSchema = Yup.object({
    adminUsername: Yup.string()
        .required('Admin username is required')
        .min(5, 'Username must be at least 5 characters'),
    adminPassword: Yup.string()
        .required('Admin password is required')
        .min(5, 'Password must be at least 5 characters'),
    teacherUsername: Yup.string()
        .required('Teacher username is required')
        .min(5, 'Username must be at least 5 characters'),
    teacherPassword: Yup.string()
        .required('Teacher password is required')
        .min(5, 'Password must be at least 5 characters'),
});

const LoginForm = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        admin: false,
        teacher: false
    });

    const formik = useFormik({
        initialValues: {
            adminUsername: 'admin',
            adminPassword: 'admin',
            teacherUsername: 'Furqan_Warraich',
            teacherPassword: 'Furqan',
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const [adminRes, teacherRes] = await Promise.all([
                    fetch(`${apiBase}/admin-login`, {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            username: values.adminUsername,
                            password: values.adminPassword
                        }),
                    }),
                    fetch(`${apiBase}/teacherLogin`, {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            username: values.teacherUsername,
                            password: values.teacherPassword
                        }),
                    }),
                ]);

                const [adminData, teacherData] = await Promise.all([
                    adminRes.json(),
                    teacherRes.json(),
                ]);

                if (adminRes.ok && teacherRes.ok) {
                    enqueueSnackbar("✅ Login Successful! Welcome to the system", {
                        variant: "success",
                        autoHideDuration: 3000,
                        style: { backgroundColor: 'var(--color-accent)', color: 'var(--color-text-on-dark)' }
                    });
                    navigate('/');
                } else {
                    if (!adminRes.ok) {
                        enqueueSnackbar(`❌ Admin Error: ${adminData.message}`, {
                            variant: "error",
                            autoHideDuration: 3000
                        });
                    }
                    if (!teacherRes.ok) {
                        enqueueSnackbar(`❌ Teacher Error: ${teacherData.message}`, {
                            variant: "error",
                            autoHideDuration: 3000
                        });
                    }
                }
            } catch (error) {
                enqueueSnackbar("❌ Network Error. Please try again.", {
                    variant: "error",
                    autoHideDuration: 3000
                });
                console.error("Login error:", error);
            } finally {
                setLoading(false);
            }
        },
    });

    const togglePasswordVisibility = (type) => {
        setShowPasswords(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

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
                    maxWidth: 500,
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
                        component="h1"
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
                        Admin & Teacher Login
                    </Typography>

                    <Alert severity="info" sx={{ width: '100%', borderRadius: 2, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                        Demo credentials: Admin - admin/admin | Teacher - Furqan_Warraich/Furqan
                    </Alert>

                    <Box
                        component="form"
                        onSubmit={formik.handleSubmit}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: { xs: 2, sm: 2.5 },
                            width: '100%'
                        }}
                    >
                        <Box
                            sx={{
                                p: { xs: 2, sm: 2.5 },
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'rgba(0, 0, 0, 0.12)',
                                '&:hover': {
                                    borderColor: 'var(--color-primary)',
                                    boxShadow: '0 0 0 1px var(--color-primary-light)'
                                }
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    color: 'var(--color-primary)',
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                    fontWeight: 600
                                }}
                            >
                                <AdminPanelSettings sx={{ mr: 1 }} /> Admin Login
                            </Typography>

                            <TextField
                                fullWidth
                                size="small"
                                label="Admin Username"
                                name="adminUsername"
                                value={formik.values.adminUsername}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.adminUsername && Boolean(formik.errors.adminUsername)}
                                helperText={formik.touched.adminUsername && formik.errors.adminUsername}
                                sx={{
                                    mb: { xs: 1.5, sm: 2 },
                                    '& .MuiOutlinedInput-root': {
                                        height: { xs: 44, sm: 48 },
                                        '&:hover fieldset': {
                                            borderColor: 'var(--color-primary)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'var(--color-primary)',
                                            borderWidth: 2,
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                                        '&.Mui-focused': {
                                            color: 'var(--color-primary)',
                                        },
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                size="small"
                                label="Admin Password"
                                name="adminPassword"
                                type={showPasswords.admin ? "text" : "password"}
                                value={formik.values.adminPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.adminPassword && Boolean(formik.errors.adminPassword)}
                                helperText={formik.touched.adminPassword && formik.errors.adminPassword}
                                sx={{
                                    mb: 0,
                                    '& .MuiOutlinedInput-root': {
                                        height: { xs: 44, sm: 48 },
                                        '&:hover fieldset': {
                                            borderColor: 'var(--color-primary)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'var(--color-primary)',
                                            borderWidth: 2,
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                                        '&.Mui-focused': {
                                            color: 'var(--color-primary)',
                                        },
                                    },
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => togglePasswordVisibility('admin')}
                                                edge="end"
                                                size="small"
                                                aria-label="toggle password visibility"
                                            >
                                                {showPasswords.admin ?
                                                    <VisibilityOff fontSize="small" /> :
                                                    <Visibility fontSize="small" />
                                                }
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box
                            sx={{
                                p: { xs: 2, sm: 2.5 },
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'rgba(0, 0, 0, 0.12)',
                                '&:hover': {
                                    borderColor: 'var(--color-primary)',
                                    boxShadow: '0 0 0 1px var(--color-primary-light)'
                                }
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    color: 'var(--color-primary)',
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                    fontWeight: 600
                                }}
                            >
                                <School sx={{ mr: 1 }} /> Teacher Login
                            </Typography>

                            <TextField
                                fullWidth
                                size="small"
                                label="Teacher Username"
                                name="teacherUsername"
                                value={formik.values.teacherUsername}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.teacherUsername && Boolean(formik.errors.teacherUsername)}
                                helperText={formik.touched.teacherUsername && formik.errors.teacherUsername}
                                sx={{
                                    mb: { xs: 1.5, sm: 2 },
                                    '& .MuiOutlinedInput-root': {
                                        height: { xs: 44, sm: 48 },
                                        '&:hover fieldset': {
                                            borderColor: 'var(--color-primary)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'var(--color-primary)',
                                            borderWidth: 2,
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                                        '&.Mui-focused': {
                                            color: 'var(--color-primary)',
                                        },
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                size="small"
                                label="Teacher Password"
                                name="teacherPassword"
                                type={showPasswords.teacher ? "text" : "password"}
                                value={formik.values.teacherPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.teacherPassword && Boolean(formik.errors.teacherPassword)}
                                helperText={formik.touched.teacherPassword && formik.errors.teacherPassword}
                                sx={{
                                    mb: 0,
                                    '& .MuiOutlinedInput-root': {
                                        height: { xs: 44, sm: 48 },
                                        '&:hover fieldset': {
                                            borderColor: 'var(--color-primary)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'var(--color-primary)',
                                            borderWidth: 2,
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                                        '&.Mui-focused': {
                                            color: 'var(--color-primary)',
                                        },
                                    },
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => togglePasswordVisibility('teacher')}
                                                edge="end"
                                                size="small"
                                                aria-label="toggle password visibility"
                                            >
                                                {showPasswords.teacher ?
                                                    <VisibilityOff fontSize="small" /> :
                                                    <Visibility fontSize="small" />
                                                }
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading || !formik.isValid}
                            sx={{
                                mt: { xs: 1, sm: 2 },
                                py: 1.8,
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                fontWeight: 600,
                                textTransform: 'none',
                                borderRadius: '12px',
                                background: 'var(--gradient-primary)',
                                color: 'white',
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
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Login Both Accounts"
                            )}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

const App = () => (
    <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
            '&.SnackbarItem-variantSuccess': {
                backgroundColor: 'var(--color-accent) !important',
            }
        }}
    >
        <LoginForm />
    </SnackbarProvider>
);

export default App;
