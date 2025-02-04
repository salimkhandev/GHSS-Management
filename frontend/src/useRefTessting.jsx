import { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import { Outlet } from "react-router-dom";
// import { useAuth } from "./AuthProvider";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

// Validation Schema using Yup
const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
});

const AdminLogin = () => {
    const { login, logout, isAuthenticated } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Check if admin is already authenticated
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await axios.get(
                    "https://ghss-management-backend.vercel.app/verify-token-asAdmin",
                    { withCredentials: true }
                );
                if (response.data.authenticated) {
                    login(); // If authenticated, set global auth state
                }
            } catch (error) {
                logout();
            }
        };
        verifyAuth();
    }, [login, logout]);

    // Toggle password visibility
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    // Form submit handler
    const handleSubmit = async (values, { setSubmitting }) => {
        setMessage(""); // Clear any previous messages
        setLoading(true);
        try {
            const response = await axios.post(
                "https://ghss-management-backend.vercel.app/admin-login",
                values, // Send the form data (username and password)
                { withCredentials: true }
            );
            login(); // Update auth state
        } catch (err) {
            logout();
            setMessage("Error logging in");
        } finally {
            setSubmitting(false);
            setLoading(false);
        }
    };

    if (isAuthenticated === null) {
        return (
            <div className="h-screen justify-center items-center flex">
                <CircularProgress />
            </div>
        ); // Show loading while checking authentication
    }

    if (isAuthenticated) {
        return <Outlet />; // If authenticated, render protected content
    }

    return (
        <Box
            component="form"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                gap: 2,
                maxWidth: 400,
                margin: "0 auto",
            }}
        >
            <Typography variant="h4">Admin Login</Typography>
            <Formik
                initialValues={{ username: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                    <Form className="w-full">
                        {/* Username Field */}
                        <Field
                            name="username"
                            as={TextField}
                            label="Username"
                            variant="outlined"
                            fullWidth
                            value={values.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={touched.username && errors.username}
                            error={touched.username && Boolean(errors.username)}
                        />
                        {/* Password Field */}
                        <Field
                            name="password"
                            as={TextField}
                            label="Password"
                            variant="outlined"
                            fullWidth
                            type={showPassword ? "text" : "password"}
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleTogglePassword} edge="end">
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            helperText={touched.password && errors.password}
                            error={touched.password && Boolean(errors.password)}
                        />
                        {/* Error message */}
                        {message && (
                            <Typography color="error" variant="body2">
                                {message}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading || isSubmitting}
                        >
                            {loading || isSubmitting ? <CircularProgress size={24} /> : "Login"}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default AdminLogin;
