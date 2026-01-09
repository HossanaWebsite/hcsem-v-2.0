'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function SearchOverlay({ isOpen, onClose }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            // Focus search input
            setTimeout(() => {
                document.getElementById('search-input')?.focus();
            }, 100);
        }
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Real search with API
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length >= 2) {
                setIsSearching(true);
                try {
                    const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&scope=all`); // Scope 'all' tries everything, backend filters by auth
                    if (res.ok) {
                        const data = await res.json();
                        setResults(data.data || []);
                    } else {
                        setResults([]);
                    }
                } catch (error) {
                    console.error("Search error", error);
                    setResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setResults([]);
                setIsSearching(false);
            }
        }, 300); // Debounce 300ms

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const quickLinks = [
        { name: 'Events', href: '/events' },
        { name: 'Blog', href: '/blog' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    // Check for admin role (client-side only for quick link)
    // In a real app, use auth context. Here we check cookie or localStorage if available, 
    // but for now let's rely on a simple check or fetch 'me' endpoint if we want to be secure.
    // Given the constraints and current setup, we can use the existence of 'auth_token' cookie 
    // AND fetch user to verify, but that might be slow.
    // Let's assume if they can see the 'Create User' button they are admin.
    // Actually, let's just add it to the list if they are logged in as admin.
    // Since we don't have global auth context easily accessible here without wrapping, 
    // we'll rely on the API check we did or just add it for now and let the page redirect if not allowed.
    // BETTER APPROACH: Use the same logic as Navbar if possible, or just Fetch 'me' once on mount.

    // Let's fetch current user status alongside search to determine if we show Admin link
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        // Simple check: if we can fetch 'me', we are logged in.
        // If role is Admin, we show the link.
        fetch('/api/users?id=me')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Not logged in');
            })
            .then(data => {
                // Check for Admin OR manage_users permission
                if (data.success && data.data && (data.data.role?.name === 'Admin' || data.data.role?.permissions?.includes('manage_users'))) {
                    setIsAdmin(true);
                }
            })
            .catch(() => setIsAdmin(false));
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-2xl"
                    onClick={onClose}
                >
                    <div className="container mx-auto px-4 h-full flex flex-col">
                        {/* Search Bar */}
                        <div className="pt-20 pb-8" onClick={(e) => e.stopPropagation()}>
                            <div className="max-w-3xl mx-auto">
                                <div className="relative">
                                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                                    <input
                                        id="search-input"
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search"
                                        className="w-full bg-muted/30 border-0 rounded-2xl pl-16 pr-16 py-5 text-2xl font-light focus:outline-none focus:bg-muted/50 transition-all placeholder:text-muted-foreground/50"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-6 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30 flex items-center justify-center transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto pb-20">
                            <div className="max-w-3xl mx-auto" onClick={(e) => e.stopPropagation()}>
                                {searchQuery.trim() === '' ? (
                                    /* Quick Links */
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-4 px-2">Quick Links</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {quickLinks.map((link) => (
                                                    <Link
                                                        key={link.name}
                                                        href={link.href}
                                                        onClick={onClose}
                                                        className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all text-center group"
                                                    >
                                                        <div className="text-lg font-medium group-hover:text-primary transition-colors">
                                                            {link.name}
                                                        </div>
                                                    </Link>
                                                ))}
                                                {isAdmin && (
                                                    <Link
                                                        href="/admin/dashboard"
                                                        onClick={onClose}
                                                        className="p-4 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 transition-all text-center group border border-indigo-500/20"
                                                    >
                                                        <div className="text-lg font-medium text-indigo-500 group-hover:text-indigo-600 dark:text-indigo-400 dark:group-hover:text-indigo-300 transition-colors">
                                                            Admin
                                                        </div>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : isSearching ? (
                                    /* Loading */
                                    <div className="text-center py-20">
                                        <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : results.length === 0 ? (
                                    /* No Results */
                                    <div className="text-center py-20">
                                        <p className="text-lg text-muted-foreground">No results for "{searchQuery}"</p>
                                    </div>
                                ) : (
                                    /* Results */
                                    <div className="space-y-2">
                                        {results.map((result, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <Link
                                                    href={result.url || '#'}
                                                    onClick={onClose}
                                                    className="block p-5 rounded-xl hover:bg-muted/30 transition-all group"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        {result.avatar && (
                                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800">
                                                                <img src={result.avatar} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-xs font-medium text-primary uppercase tracking-wider">
                                                                    {result.type}
                                                                </span>
                                                                {result.date && <span className="text-xs text-muted-foreground">• {new Date(result.date).toLocaleDateString()}</span>}
                                                            </div>
                                                            <h3 className="text-lg font-medium mb-1 group-hover:text-primary transition-colors">
                                                                {result.title || result.fullName || result.action}
                                                            </h3>
                                                            {/* Show description, summary, or email depending on type */}
                                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                                {result.description || result.summary || result.email || result.details && JSON.stringify(result.details)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Close hint */}
                        <div className="py-6 text-center">
                            <button
                                onClick={onClose}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Press <kbd className="px-2 py-1 bg-muted/30 rounded text-xs mx-1">ESC</kbd> to close
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
