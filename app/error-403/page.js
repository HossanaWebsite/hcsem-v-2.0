'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, Lock } from 'lucide-react';

export default function Error403() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-20">
            <div className="max-w-2xl mx-auto text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-center mb-6">
                        <motion.div
                            animate={{ rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Lock className="w-24 h-24 text-primary" />
                        </motion.div>
                    </div>
                    <h1 className="text-9xl font-heading font-bold text-gradient">403</h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-4"
                >
                    <h2 className="text-4xl md:text-5xl font-heading font-bold">
                        Access Forbidden
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-md mx-auto">
                        You don't have permission to access this resource. Please contact an administrator if you believe this is an error.
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
                    <Link href="/contact">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="border-2 border-primary text-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/10 transition-all"
                        >
                            Contact Support
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Decorative elements */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="absolute inset-0 -z-10 overflow-hidden"
                >
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-destructive/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
                </motion.div>
            </div>
        </div>
    );
}
