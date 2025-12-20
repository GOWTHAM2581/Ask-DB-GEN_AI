import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ConnectDB from './pages/ConnectDB';
import Query from './pages/Query';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// DB Connected Guard (Ensure DB session exists)
const DBGuard = ({ children }) => {
    const { dbToken } = useAuth();
    if (!dbToken) {
        return <Navigate to="/connect" replace />;
    }
    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />

                        <Route
                            path="/connect"
                            element={
                                <ProtectedRoute>
                                    <ConnectDB />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/query"
                            element={
                                <ProtectedRoute>
                                    <DBGuard>
                                        <Query />
                                    </DBGuard>
                                </ProtectedRoute>
                            }
                        />

                        {/* 404 Route */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Layout>
            </AuthProvider>
        </Router>
    );
}

export default App;
