import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const { user, isLoaded } = useUser();
    const { getToken } = useClerkAuth();
    const [dbToken, setDbToken] = useState(sessionStorage.getItem('db_token'));

    useEffect(() => {
        const syncToken = async () => {
            if (user) {
                try {
                    const token = await getToken();
                    setAuthToken(token);
                } catch (err) {
                    console.error("Error getting Clerk token:", err);
                    setAuthToken(null);
                }
            } else {
                setAuthToken(null);
            }
        };
        syncToken();
    }, [user, getToken]);

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
