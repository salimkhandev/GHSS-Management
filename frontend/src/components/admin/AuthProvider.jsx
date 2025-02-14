import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// Create a provider to wrap around the app
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    
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
        }, []);
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('https://ghss-management-backend.vercel.app/verify-token-asTeacher', {
                    method: 'GET',
                    credentials: 'include'
                });

                const data = await response.json();
                if (data.authenticated) {
                    loginTeacher();
                }
                else {
                    logoutTeacher();
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                logoutTeacher();
            } finally {
                // setLoading(false);
            }
        };

        checkAuth();
    }, []);
    const [isAuthenticatedTeacher, setIsAuthenticatedTeacher] = useState(null);


    // Function to log the user in (set global authentication state)
    const login = () => {
        setIsAuthenticated(true);
    };
    
  
 // Function to log the user out (set global authentication state)
    const logout = () => {
        setIsAuthenticated(false);
    };
        const loginTeacher = () => {
            setIsAuthenticatedTeacher(true);
        };
    const logoutTeacher = () => {
        setIsAuthenticatedTeacher(false);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            login,
            logout,
            isAuthenticatedTeacher,
            loginTeacher,
            logoutTeacher
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the context
export const useAuth = () => useContext(AuthContext);
