'use client';
import { useState, useEffect, startTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield } from 'lucide-react';
import Link from 'next/link';

export default function CookieBanner() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) startTransition(() => setShow(true));
    }, []);

    const accept = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        setShow(false);
    };

    const decline = () => {
        localStorage.setItem('cookie_consent', 'declined');
        setShow(false);
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 80 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 80 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[95vw] max-w-2xl"
                >
                    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex-shrink-0">
                            <Cookie className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white mb-0.5">We use cookies</p>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                We use cookies to enhance your experience. By continuing, you agree to our{' '}
                                <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 underline">Privacy Policy</Link>.
                            </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
                            <button
                                onClick={decline}
                                className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
                            >
                                Decline
                            </button>
                            <button
                                onClick={accept}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-lg shadow-indigo-500/20 transition-all"
                            >
                                <Shield size={13} /> Accept
                            </button>
                        </div>
                        <button onClick={decline} className="absolute top-3 right-3 text-slate-500 hover:text-white sm:hidden" aria-label="Close">
                            <X size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
