import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null means loading

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await axios.get("https://ghss-management-backend.vercel.app/verify-token-asAdmin", {
                    withCredentials: true, // Ensure cookies are sent
                });
                if (response.data.authenticated) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
                console.log(error);
                
            }
        };

        verifyAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...from protected routes</div>; // Show a loading state while checking auth
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/admin" replace />;
};

export default ProtectedRoute;
