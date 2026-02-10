'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, RefreshCw } from 'lucide-react';

export default function Error500() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-20">
            <div className="max-w-2xl mx-auto text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-9xl font-heading font-bold text-gradient">500</h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-4"
                >
                    <h2 className="text-4xl md:text-5xl font-heading font-bold">
                        Server Error
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-md mx-auto">
                        Oops! Something went wrong on our end. We&apos;re working to fix it. Please try again later.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-wrap gap-4 justify-center pt-4"
                >
                    <Link href="/">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-primary/25 transition-all inline-flex items-center gap-3"
                        >
                            <Home className="w-5 h-5" />
                            Go Home
                        </motion.button>
                    </Link>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.reload()}
                        className="border-2 border-primary text-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/10 transition-all inline-flex items-center gap-3"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Retry
                    </motion.button>
                </motion.div>

                {/* Decorative elements */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="absolute inset-0 -z-10 overflow-hidden"
                >
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-destructive/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                </motion.div>
            </div>
        </div>
    );
}
