import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { connectDB } from '../services/api';
import { Database, Server, Key, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const ConnectDB = () => {
    const [formData, setFormData] = useState({
        host: 'mysql-36e55b8c-gowtham2581h-2c75.k.aivencloud.com',
        port: 17162,
        user: 'avnadmin',
        password: 'AVNS_Yoo9PV8qlwTBqHBdpjh',
        database: 'defaultdb'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { saveDbSession } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const sanitizedData = {
                ...formData,
                host: formData.host.trim(),
                user: formData.user.trim(),
                password: formData.password.trim(),
                database: formData.database.trim()
            };
            const data = await connectDB(sanitizedData);
            saveDbSession(data.db_token);
            navigate('/query');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to connect. Check credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center p-4 relative">
            {/* Decorative Orbs */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-[80px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-lg"
            >
                <div className="glass-panel rounded-3xl p-1 shadow-2xl overflow-hidden relative">
                    {/* Top Gradient Border Helper */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <div className="bg-zinc-900/80 rounded-[22px] p-8 md:p-10 backdrop-blur-md">

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-violet-500/20 mb-4">
                                <Database className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                                Connect Source
                            </h2>
                            <p className="text-zinc-500 mt-2 text-sm">
                                Securely link your MySQL database. <br /> Read-only access recommended.
                            </p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-3"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-zinc-400 ml-1">HOST</label>
                                    <div className="relative group">
                                        <Server className="absolute left-3 top-3 w-4 h-4 text-zinc-600 group-focus-within:text-violet-400 transition-colors" />
                                        <input
                                            name="host"
                                            value={formData.host}
                                            onChange={handleChange}
                                            className="w-full glass-input rounded-xl px-4 py-2.5 pl-10 text-sm outline-none"
                                            placeholder="localhost"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-zinc-400 ml-1">PORT</label>
                                    <input
                                        name="port"
                                        type="number"
                                        value={formData.port}
                                        onChange={handleChange}
                                        className="w-full glass-input rounded-xl px-4 py-2.5 text-sm outline-none text-center"
                                        placeholder="3306"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 ml-1">DATABASE NAME</label>
                                <input
                                    name="database"
                                    value={formData.database}
                                    onChange={handleChange}
                                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm outline-none"
                                    placeholder="e.g. ecommerce_db"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-zinc-400 ml-1">USERNAME</label>
                                    <input
                                        name="user"
                                        value={formData.user}
                                        onChange={handleChange}
                                        className="w-full glass-input rounded-xl px-4 py-2.5 text-sm outline-none"
                                        placeholder="readonly"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-zinc-400 ml-1">PASSWORD</label>
                                    <div className="relative group">
                                        <Key className="absolute left-3 top-3 w-4 h-4 text-zinc-600 group-focus-within:text-violet-400 transition-colors" />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full glass-input rounded-xl px-4 py-2.5 pl-10 text-sm outline-none"
                                            placeholder="••••••"
                                        />
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium py-3.5 rounded-xl shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span className="relative z-10">Connect Database</span>
                                        <Sparkles className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform" />
                                    </>
                                )}
                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            </motion.button>

                            <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-600 uppercase tracking-widest mt-4">
                                <ShieldCheck className="w-3 h-3" />
                                <span>End-to-End Encrypted</span>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ConnectDB;
