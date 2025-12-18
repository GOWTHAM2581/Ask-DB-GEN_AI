import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { askDatabase } from '../services/api';
import { Send, Play, Copy, Check, Sparkles, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Query = () => {
    const { dbToken } = useAuth();
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [prompt]);

    const handleRun = async () => {
        if (!prompt.trim()) return;

        const queryText = prompt;
        setPrompt(''); // Clear input immediately

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await askDatabase(dbToken, queryText);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (result?.sql) {
            navigator.clipboard.writeText(result.sql);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] lg:h-[calc(100vh-120px)] relative">

            {/* Scrollable Container */}
            <div className="flex-grow overflow-y-auto px-4 pb-48 scroll-smooth">
                <div className="max-w-4xl mx-auto pt-10">

                    {/* Empty State / Welcome */}
                    {!result && !error && !isLoading && (
                        <div className="text-center opacity-50 mt-20">
                            <div className="w-20 h-20 bg-violet-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="w-10 h-10 text-violet-400" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Ready to query</h2>
                            <p className="text-zinc-400">Ask anything about your database.</p>
                        </div>
                    )}

                    {/* ERROR */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-200 text-sm mb-6"
                            >
                                <span className="font-bold block mb-1">Error Generating Query</span>
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* RESULT */}
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* SQL Card */}
                                <div className="glass-panel rounded-2xl overflow-hidden group">
                                    <div className="bg-white/5 border-b border-white/5 px-4 py-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                                            <Terminal className="w-3 h-3" />
                                            <span>GENERATED_SQL</span>
                                        </div>
                                        <button onClick={handleCopy} className="text-zinc-400 hover:text-white transition-colors">
                                            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <div className="p-6 bg-zinc-950/50">
                                        <code className="font-mono text-sm text-blue-300 block whitespace-pre-wrap leading-relaxed">
                                            {result.sql}
                                        </code>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-4 text-xs font-medium text-zinc-500 uppercase tracking-widest pl-2">
                                    <span>{result.execution_time_ms}ms execution</span>
                                    <span>•</span>
                                    <span>{result.results.length} rows found</span>
                                </div>

                                {/* Table */}
                                <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                                    <div className="overflow-x-auto max-h-[500px]">
                                        <table className="w-full text-left text-sm whitespace-nowrap">
                                            <thead className="bg-white/5 sticky top-0 backdrop-blur-md">
                                                <tr>
                                                    {result.column_names.map(col => (
                                                        <th key={col} className="p-4 font-semibold text-zinc-300 border-b border-white/5">
                                                            {col}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {result.results.map((row, i) => (
                                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                                        {result.column_names.map(col => (
                                                            <td key={col} className="p-4 text-zinc-400">
                                                                {row[col]?.toString() || <span className="opacity-30 italic">null</span>}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Input Bar */}
            <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent">
                <div className="max-w-4xl mx-auto relative group">
                    {/* Glow Effect behind input */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>

                    <div className="relative bg-zinc-900 rounded-3xl border border-white/10 shadow-2xl flex items-end overflow-hidden">
                        <textarea
                            ref={textareaRef}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleRun();
                                }
                            }}
                            placeholder="Describe your query in English..."
                            className="w-full bg-transparent text-white p-5 pr-16 outline-none resize-none max-h-48 placeholder:text-zinc-600 leading-relaxed"
                            rows={1}
                        />
                        <button
                            onClick={handleRun}
                            disabled={isLoading || !prompt.trim()}
                            className="absolute right-3 bottom-3 p-2 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl text-white shadow-lg hover:shadow-violet-500/20 hover:scale-105 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                        >
                            {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Query;
