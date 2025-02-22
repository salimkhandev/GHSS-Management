import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// Create a provider to wrap around the app
export const AuthProvider = ({ children }) => {
    const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(null);
    const [isAuthenticatedTeacher, setIsAuthenticatedTeacher] = useState(null);
    const [logEvent, setLogEvent] = useState(false);
    
        useEffect(() => {
            const verifyAuth = async () => {
                try {
                    const response = await axios.get(
                        "https://ghss-management-backend.vercel.app/verify-token-asAdmin",
                        { withCredentials: true }
                    );
                    
                    if (response.data.authenticated) {
                        login();
                        // setIsAuthenticated(true);
                        //  // If authenticated, set global auth state
                    }
                } catch (error) {
                    console.error('Error verifying token:', error);
                    logout()
                    // setIsAuthenticated(false);
    
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


    // Function to log the user in (set global authentication state)
    const login = () => {
        setIsAuthenticatedAdmin(true);
        setLogEvent((prev) => !prev); // Toggle the boolean value

    };
    
  
 // Function to log the user out (set global authentication state)
    const logout = () => {
        setIsAuthenticatedAdmin(false);
        setLogEvent((prev) => !prev); // Toggle the boolean value

    };
    const setLogEventHandler = () => {
        setLogEvent((prev) => !prev); 
        setIsAuthenticatedAdmin(false);
        setIsAuthenticatedTeacher(false);
    };
        const loginTeacher = () => {
            setIsAuthenticatedTeacher(true);
            setLogEvent((prev) => !prev); // Toggle the boolean value

        };
    const logoutTeacher = () => {
        setIsAuthenticatedTeacher(false);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticatedAdmin    ,
            login,
            logout,
            isAuthenticatedTeacher,
            loginTeacher,
            logoutTeacher,
            logEvent,
            setLogEventHandler
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the context
export const useAuth = () => useContext(AuthContext);
