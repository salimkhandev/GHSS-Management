import React, { createContext, useState, useContext } from 'react';

// Create the context
const AuthContext = createContext();

// Create a provider to wrap around the app
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
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
