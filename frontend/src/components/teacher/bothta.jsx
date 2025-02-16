import { Visibility, VisibilityOff } from "@mui/icons-material";
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
import { SnackbarProvider, useSnackbar } from "notistack";
import { useState } from "react";

const defaultTheme = createTheme();

const LoginForm = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const [admin, setAdmin] = useState({
        username: "",
        password: "",
        showPassword: false
    });

    const [teacher, setTeacher] = useState({
        username: "",
        password: "",
        showPassword: false
    });

    const togglePasswordVisibility = (type) => {
        if (type === "admin") {
            setAdmin({ ...admin, showPassword: !admin.showPassword });
        } else {
            setTeacher({ ...teacher, showPassword: !teacher.showPassword });
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const [adminRes, teacherRes] = await Promise.all([
                fetch("https://ghss-management-backend.vercel.app/admin-login", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: admin.username, password: admin.password }),
                }),
                fetch("https://ghss-management-backend.vercel.app/teacherLogin", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: teacher.username, password: teacher.password }),
                }),
            ]);

            const [adminData, teacherData] = await Promise.all([
                adminRes.json(),
                teacherRes.json(),
            ]);

            if (adminRes.ok) {
                enqueueSnackbar("✅ Admin Login Successful!", { variant: "success" });
            } else {
                enqueueSnackbar(`❌ Admin Error: ${adminData.message}`, { variant: "error" });
            }

            if (teacherRes.ok) {
                enqueueSnackbar("✅ Teacher Login Successful!", { variant: "success" });
            } else {
                enqueueSnackbar(`❌ Teacher Error: ${teacherData.message}`, { variant: "error" });
            }
        } catch (error) {
            enqueueSnackbar("❌ Network Error. Please try again.", { variant: "error" });
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: "100vh" }}>
                <CssBaseline />
                <Grid
                    item
                    xs={12}
                    container
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        backgroundImage: "url(https://source.unsplash.com/random?school)",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundColor: (t) =>
                            t.palette.mode === "light"
                                ? t.palette.grey[50]
                                : t.palette.grey[900],
                    }}
                >
                    <Grid item xs={10} sm={8} md={5} component={Paper} elevation={6} square>
                        <Box sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Typography component="h1" variant="h5" sx={{ mb: 2, textTransform: "capitalize" }}>
                                Admin & Teacher Login
                            </Typography>

                            <Box component="form" onSubmit={handleLogin} noValidate sx={{ width: "100%" }}>
                                {/* Admin Login Form */}
                                <Paper sx={{ p: 3, mb: 3, width: "100%" }} elevation={3}>
                                    <Typography variant="h6" gutterBottom>
                                        👨‍💼 Admin Login
                                    </Typography>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Admin Username"
                                        autoComplete="username"
                                        value={admin.username}
                                        onChange={(e) =>
                                            setAdmin({ ...admin, username: e.target.value })
                                        }
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Admin Password"
                                        type={admin.showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        value={admin.password}
                                        onChange={(e) =>
                                            setAdmin({ ...admin, password: e.target.value })
                                        }
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => togglePasswordVisibility("admin")}>
                                                        {admin.showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Paper>

                                {/* Teacher Login Form */}
                                <Paper sx={{ p: 3, mb: 3, width: "100%" }} elevation={3}>
                                    <Typography variant="h6" gutterBottom>
                                        👨‍🏫 Teacher Login
                                    </Typography>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Teacher Username"
                                        autoComplete="username"
                                        value={teacher.username}
                                        onChange={(e) =>
                                            setTeacher({ ...teacher, username: e.target.value })
                                        }
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Teacher Password"
                                        type={teacher.showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        value={teacher.password}
                                        onChange={(e) =>
                                            setTeacher({ ...teacher, password: e.target.value })
                                        }
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => togglePasswordVisibility("teacher")}>
                                                        {teacher.showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Paper>

{/* textTranform */}

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    sx={{ textTransform: "capitalize" }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "Login Both Accounts"}
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

const App = () => (
    <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
        <LoginForm />
    </SnackbarProvider>
);

export default App;
