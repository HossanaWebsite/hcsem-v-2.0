'use client';

import { useEffect } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-xl mx-auto text-center space-y-8">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-500" />
                </div>

                <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
                    Something went wrong!
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    We encountered an unexpected error. Our team has been notified.
                    Please try refreshing the page or contact support if the problem persists.
                </p>

                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl p-4 text-left overflow-auto max-h-40 text-xs font-mono text-red-800 dark:text-red-300">
                    <p className="font-bold mb-1">Error Details:</p>
                    {error.message || 'Unknown Error'}
                </div>

                <div className="flex flex-wrap gap-4 justify-center pt-4">
                    <button
                        onClick={() => reset()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all inline-flex items-center gap-2"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 px-8 py-3 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all inline-flex items-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}
