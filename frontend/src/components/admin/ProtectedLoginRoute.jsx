import { useState, useEffect } from "react";
import { TextField, Button, Box, Typography,CircularProgress } from "@mui/material";
import axios from "axios";
import { Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
// import { useAuth } from "./AuthProvider";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const AdminLogin = () => {
    // const { login } = useAuth();
    const { login, logout,isAuthenticated } = useAuth(); 
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading,setLoading]=useState(false)
    // const [isAuthenticated, setIsAuthenticated] = useState(null); // null means loading

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
                logout() 
                
            }
        };
        
        verifyAuth();
    }, [login,logout]);
    
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // Clear any previous messages
  setLoading(true)
        try {
            const response = await axios.post(
                "https://ghss-management-backend.vercel.app/admin-login",
                { username, password },
                { withCredentials: true }
            );
            
            login(); // Update auth state
        } catch (err) {
            logout()  
            setMessage("Error logging in", err);
        };
finally {
        setLoading(false); // Ensure loading is stopped after the request finishes
    }
    };

    if (isAuthenticated === null) {
        return <div className="h-screen justify-center items-center flex"><CircularProgress/></div>; // Show loading while checking authentication
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
            onSubmit={handleSubmit}
        >
            <Typography variant="h4">Admin Login</Typography>
            <TextField
                label="Username"
                autoComplete="username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                label="Password"
                autoComplete="current-password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleTogglePassword} edge="end">
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            {message && (
                <Typography color="error" variant="body2">
                    {message}
                </Typography>
            )}
            <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
                {loading?<CircularProgress size={24} />: 'Login'}
            </Button>
        </Box>
    );
};

export default AdminLogin;