'use client';

import React, { useEffect, useState } from 'react';
import { Users, FileText, Calendar, MessageSquare, ArrowUpRight, TrendingUp, Clock, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
    const [stats, setStats] = useState({ users: 542, blogs: 24, events: 12, messages: 89 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/dashboard');
                const data = await res.json();
                if (data.success) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error("Failed to load stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Members', value: stats.users, icon: Users, color: 'text-blue-400', glow: 'stat-glow-blue', trend: '+12%' },
        { label: 'Published Blogs', value: stats.blogs, icon: FileText, color: 'text-emerald-400', glow: 'stat-glow-emerald', trend: '+4' },
        { label: 'Upcoming Events', value: stats.events, icon: Calendar, color: 'text-purple-400', glow: 'stat-glow-purple', trend: 'Next: Sat' },
        { label: 'Unread Messages', value: stats.messages, icon: MessageSquare, color: 'text-amber-400', glow: 'stat-glow-amber', trend: '9 new' },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-500 animate-pulse" />
                </div>
                <p className="text-slate-400 font-medium tracking-widest uppercase text-xs">Syncing Command Center</p>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-10 pb-12"
        >
            {/* Top Bar / Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <header className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">System Status: Online</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Monitoring Hossana Community Hub in real-time.</p>
                </header>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 admin-glass-card rounded-xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-1">Security</p>
                            <p className="text-xs text-slate-900 dark:text-white font-bold leading-none">Active Protection</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Asymmetric Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        className={`admin-glass-card p-6 overflow-hidden relative group`}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <stat.icon size={64} className="text-slate-900 dark:text-white" />
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 ${stat.color} ${stat.glow}`}>
                                    <stat.icon size={20} strokeWidth={2.5} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-full">{stat.trend}</span>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-4xl font-black text-slate-900 dark:text-white">{stat.value.toLocaleString()}</h3>
                                    <ArrowUpRight className="w-4 h-4 text-emerald-500 opacity-50" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Performance Focused Section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Main Visual Panel */}
                <motion.div variants={itemVariants} className="lg:col-span-3 admin-glass-card p-10 flex flex-col justify-between min-h-[400px]">
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Engagement Flow</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Visualizing community interactions across platforms.</p>
                            </div>
                            <button className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all">
                                <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </button>
                        </div>

                        {/* Lightweight CSS Chart placeholder for instant load */}
                        <div className="flex items-end gap-2 h-48 w-full px-2 pt-8">
                            {[40, 60, 45, 90, 65, 80, 50, 85, 100, 75, 55, 70].map((h, i) => (
                                <div key={i} className="flex-1 group relative">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ delay: 0.5 + i * 0.05, duration: 1, ease: "circOut" }}
                                        className={`w-full rounded-t-lg transition-all duration-300 ${i === 8 ? 'bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'bg-slate-200 dark:bg-slate-800 group-hover:bg-slate-300 dark:group-hover:bg-slate-700'}`}
                                    />
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded pointer-events-none">
                                        {h}%
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest px-2">
                            <span>Jan</span>
                            <span>Jun</span>
                            <span>Dec</span>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 dark:border-white/5 grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Response Rate</p>
                            <p className="text-lg font-black text-slate-900 dark:text-white">98.2%</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Server Latency</p>
                            <p className="text-lg font-black text-emerald-500 dark:text-emerald-400">24ms</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Storage</p>
                            <p className="text-lg font-black text-slate-900 dark:text-white">12.4GB</p>
                        </div>
                    </div>
                </motion.div>

                {/* Vertical Panels */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Activity */}
                    <motion.div variants={itemVariants} className="admin-glass-card p-8 h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Live Stream</h3>
                            <Clock className="w-5 h-5 text-slate-500 dark:text-slate-600" />
                        </div>

                        <div className="space-y-8">
                            {stats.recentActivity && stats.recentActivity.length > 0 ? (
                                stats.recentActivity.map((item, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="relative">
                                            <div className={`w-2 h-2 rounded-full ${i % 3 === 0 ? 'bg-emerald-500' : i % 3 === 1 ? 'bg-indigo-500' : 'bg-purple-500'} mt-1.5 shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10 relative`} />
                                            {i !== stats.recentActivity.length - 1 && <div className="absolute top-3.5 left-0.5 w-[1px] h-12 bg-slate-200 dark:bg-slate-800" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {item.userId?.fullName || 'System'}
                                                </p>
                                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-600">
                                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{item.action.replace(/_/g, ' ').toLowerCase()}</p>
                                            {item.details && (
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-1">
                                                    {JSON.stringify(item.details)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-sm text-center py-4">No recent activity detected.</p>
                            )}
                        </div>

                        <button className="mt-10 w-full py-4 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500/50 transition-all">
                            Enter Logs Console
                        </button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
