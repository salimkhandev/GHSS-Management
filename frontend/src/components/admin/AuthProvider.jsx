import React, { createContext, useContext, useState } from 'react';

// Create Context
const AuthContext = createContext();

// AuthProvider Component
function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom Hook to Use Auth Context
 function useAuth() {
    return useContext(AuthContext);
}

// Export everything
export { AuthProvider, useAuth };
