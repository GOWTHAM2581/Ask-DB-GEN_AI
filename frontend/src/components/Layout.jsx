import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Database, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-violet-500/30 selection:text-violet-200">

            {/* Navigation */}
            <nav className="fixed top-0 left-0 w-full z-50 px-4 py-4">
                <div className="max-w-7xl mx-auto">
                    <div className="glass-panel rounded-full px-6 py-3 flex items-center justify-between">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all duration-300">
                                <Database className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                                AskDB
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-6">
                            {user ? (
                                <>
                                    <Link to="/query" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                                        Playground
                                    </Link>
                                    <div className="w-[1px] h-4 bg-white/10" />
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-sm font-medium transition-all hover:scale-105"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-zinc-400 hover:text-white"
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow flex flex-col pt-24 px-4 md:px-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={children.type.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col flex-grow h-full"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

        </div>
    );
};

export default Layout;
