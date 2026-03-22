'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SitePreloader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (document.readyState === 'complete') {
            const t = setTimeout(() => setLoading(false), 500);
            return () => clearTimeout(t);
        }

        const handleLoad = () => {
            setTimeout(() => setLoading(false), 500);
        };
        
        window.addEventListener('load', handleLoad);
        
        const fallbackTimer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => {
            window.removeEventListener('load', handleLoad);
            clearTimeout(fallbackTimer);
        };
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    key="preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-950"
                >
                    <div className="relative flex flex-col items-center justify-center">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-24 h-24 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 mb-8"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
                                H
                            </div>
                            <span className="text-3xl font-heading font-bold text-white tracking-widest">
                                HCSEM
                            </span>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
