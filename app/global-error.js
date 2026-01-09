'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
    useEffect(() => {
        console.error('Global Error:', error);
    }, [error]);

    return (
        <html>
            <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen flex items-center justify-center p-6">
                <div className="max-w-lg text-center space-y-6">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-500" />
                    </div>
                    <h2 className="text-3xl font-bold">Critical Error</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        A critical system error occurred. Please refresh or contact admin.
                    </p>
                    <button
                        onClick={() => reset()}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all"
                    >
                        Reload System
                    </button>
                </div>
            </body>
        </html>
    );
}
