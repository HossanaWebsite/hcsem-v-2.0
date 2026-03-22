'use client';

import React, { createContext, useContext, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminProgressContext = createContext({
    startProgress: (message) => {},
    stopProgress: () => {},
});

export function AdminProgressProvider({ children }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progressMessage, setProgressMessage] = useState('Saving Changes...');

    const startProgress = (message = 'Processing update...') => {
        setProgressMessage(message);
        setIsProcessing(true);
    };

    const stopProgress = () => {
        setIsProcessing(false);
    };

    return (
        <AdminProgressContext.Provider value={{ startProgress, stopProgress }}>
            {children}
            <AnimatePresence>
                {isProcessing && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center"
                    >
                        <div className="bg-slate-900 px-10 py-8 rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center gap-6 max-w-sm text-center">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Save className="w-6 h-6 text-indigo-400" />
                                </div>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-white mb-2">{progressMessage}</p>
                                <p className="text-sm text-slate-400">Please wait while the process securely completes.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AdminProgressContext.Provider>
    );
}

export const useAdminProgress = () => useContext(AdminProgressContext);
