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
    Typography
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useFormik } from "formik";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import apiBase from '../../config/api';

const defaultTheme = createTheme({
    palette: {
        primary: {
            main: '#2196f3',  // Professional blue
            dark: '#1976d2',
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: '#f8f9fa'
        }
    }
});

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
            teacherUsername: 'Kamal',
            teacherPassword: 'Kamal',
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
                        style: { backgroundColor: '#2196f3', color: '#ffffff' }
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
        <ThemeProvider theme={defaultTheme}>
            <Grid
                container
                component="main"
                sx={{
                    minHeight: "90vh",
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    justifyContent: "center",
                    alignItems: "center",
                    p: { xs: 2, sm: 4 }
                }}
            >
                <CssBaseline />
                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 3, sm: 4 },
                        width: "100%",
                        maxWidth: 450,
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.98)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
                    }}
                >
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{
                            mb: 4,
                            textAlign: "center",
                            fontWeight: 600,
                            color: 'primary.main'
                        }}
                    >
                        Admin & Teacher Login
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={formik.handleSubmit}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 3
                        }}
                    >
                        <Box
                            sx={{
                                p: 2.5,
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'rgba(0, 0, 0, 0.12)',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    boxShadow: '0 0 0 1px rgba(33, 150, 243, 0.2)'
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
                                    color: 'primary.dark',
                                    fontSize: '1.1rem',
                                    fontWeight: 500
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
                                sx={{ mb: 2 }}
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
                                p: 2.5,
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'rgba(0, 0, 0, 0.12)',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    boxShadow: '0 0 0 1px rgba(33, 150, 243, 0.2)'
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
                                    color: 'primary.dark',
                                    fontSize: '1.1rem',
                                    fontWeight: 500
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
                                sx={{ mb: 2 }}
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
                                mt: 1,
                                py: 1.2,
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 500,
                                borderRadius: 1.5,
                                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
                                '&:hover': {
                                    boxShadow: '0 6px 16px rgba(33, 150, 243, 0.3)'
                                }
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Login Both Accounts"
                            )}
                        </Button>
                    </Box>
                </Paper>
            </Grid>
        </ThemeProvider>
    );
};

const App = () => (
    <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
            '&.SnackbarItem-variantSuccess': {
                backgroundColor: '#2196f3 !important',
            }
        }}
    >
        <LoginForm />
    </SnackbarProvider>
);

export default App;
