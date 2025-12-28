import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (role = 'student') => {
        const mockUser = {
            id: role === 'admin' ? 999 : 123,
            name: role === 'admin' ? 'Admin User' : 'Alex Johnson',
            email: role === 'admin' ? 'admin@lms.com' : 'alex@student.com',
            role: role,
            avatar: role === 'admin'
                ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
                : 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        // Optional: clear other user data if needed
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
