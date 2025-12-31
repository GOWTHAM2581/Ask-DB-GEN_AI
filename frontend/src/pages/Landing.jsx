import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Lock, Code2 } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const Landing = () => {
    const { isSignedIn } = useUser();

    return (
        <div className="flex flex-col items-center justify-center flex-grow relative overflow-hidden">

            {/* Hero Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 text-center max-w-4xl px-4">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                        </span>
                        AI SQL Assistant V1.0
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1.1]">
                        Talk to your <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white">
                            Database
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Stop writing boilerplate SQL. Connect your MySQL database and get instant answers using protected, read-only AI generation.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/connect"
                            className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2"
                        >
                            Start Querying
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        {!isSignedIn && (
                            <Link
                                to="/login"
                                className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-full font-bold text-lg transition-all"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </motion.div>

                {/* Floating Cards (Decorative) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
                >
                    <Card
                        title="Strict Guards"
                        desc="Read-only enforcement via SQL parsing."
                        icon={<Shield className="text-emerald-400" />}
                    />
                    <Card
                        title="Zero Setup"
                        desc="Connect and query in seconds."
                        icon={<Zap className="text-yellow-400" />}
                    />
                    <Card
                        title="Code Export"
                        desc="Copy generated SQL with one click."
                        icon={<Code2 className="text-violet-400" />}
                    />
                </motion.div>
            </div>
        </div>
    );
};

const Card = ({ title, desc, icon }) => (
    <div className="p-6 rounded-2xl glass-panel hover:bg-white/5 transition-colors">
        <div className="mb-4">{icon}</div>
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-sm text-zinc-500">{desc}</p>
    </div>
);

export default Landing;
