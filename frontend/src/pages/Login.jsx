import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin } from '../services/api';
import { Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const data = await apiLogin(username, password);
            login(data.access_token);
            navigate('/connect');
        } catch (err) {
            setError('Invalid credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold">Welcome back</h2>
                        <p className="text-zinc-500 text-sm mt-1">Please sign in to continue</p>
                    </div>

                    {error && <div className="text-red-400 text-center text-sm mb-4 bg-red-500/10 py-2 rounded-lg">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full glass-input rounded-xl px-4 py-3 text-sm outline-none"
                                placeholder="Username"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full glass-input rounded-xl px-4 py-3 text-sm outline-none"
                                placeholder="Password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-zinc-950 font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 mt-2"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
