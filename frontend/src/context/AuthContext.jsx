import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const { user, isLoaded } = useUser();
    const [dbToken, setDbToken] = useState(sessionStorage.getItem('db_token'));

    useEffect(() => {
        if (dbToken) {
            sessionStorage.setItem('db_token', dbToken);
        } else {
            sessionStorage.removeItem('db_token');
        }
    }, [dbToken]);

    const saveDbSession = (newDbToken) => {
        setDbToken(newDbToken);
    };

    const clearDbSession = () => {
        setDbToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoaded, dbToken, saveDbSession, clearDbSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
