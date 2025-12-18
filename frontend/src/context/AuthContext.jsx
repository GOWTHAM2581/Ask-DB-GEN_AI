import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [dbToken, setDbToken] = useState(sessionStorage.getItem('db_token'));

    useEffect(() => {
        if (token) {
            // Decode token to get user text or validate (simplified)
            // In real app, call /me endpoint
            setUser({ name: 'User' });
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
            setUser(null);
        }
    }, [token]);

    useEffect(() => {
        if (dbToken) {
            sessionStorage.setItem('db_token', dbToken);
        } else {
            sessionStorage.removeItem('db_token');
        }
    }, [dbToken]);

    const login = (newToken) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
        setDbToken(null);
        setUser(null);
    };

    const saveDbSession = (newDbToken) => {
        setDbToken(newDbToken);
    };

    return (
        <AuthContext.Provider value={{ user, token, dbToken, login, logout, saveDbSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
