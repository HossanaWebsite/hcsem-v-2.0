'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Github, LayoutTemplate, BriefcaseBusiness, Code2, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function DevelopersPage() {
    return (
        <div className="min-h-screen pt-32 pb-24 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6 mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-4">
                        <Code2 className="w-4 h-4" />
                        Platform Architecture & Design
                    </div>
                    <h1 className="text-4xl md:text-6xl font-heading font-bold text-white leading-tight">
                        Crafted with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">precision</span><br />
                        engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">impact.</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        This digital platform was architected to empower the HCSEM community. We blend cutting-edge technologies with aesthetic modern design.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Abenezer Y. */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-10 rounded-3xl relative overflow-hidden group flex flex-col items-center text-center"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white mb-6 shadow-xl shadow-indigo-500/20">
                            A
                        </div>
                        <h3 className="text-3xl font-heading font-bold text-white mb-2">Abenezer Y.</h3>
                        <p className="text-indigo-400 font-medium mb-1">Full Stack Developer</p>
                        <p className="text-indigo-300 text-sm mb-6">IT Infrastructure Engineer (Sys Admin & Network Eng)</p>
                        <p className="text-slate-400 leading-relaxed mb-8 flex-grow">
                            Architected the core infrastructure, responsive frontend layouts, and dynamic backend integrations for the HCSEM platform.
                        </p>
                        <div className="flex flex-wrap gap-4 w-full relative z-10">
                            <a href="https://t.me/abenu_y" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc] hover:text-white px-4 py-3 rounded-xl transition-all font-medium text-sm">
                                <MessageCircle size={18} /> Telegram
                            </a>
                            <a href="https://wa.me/251972685212" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white px-4 py-3 rounded-xl transition-all font-medium text-sm">
                                <MessageCircle size={18} /> WhatsApp
                            </a>
                        </div>
                    </motion.div>

                    {/* Merry Mekoro */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-10 rounded-3xl relative overflow-hidden group flex flex-col items-center text-center"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-4xl font-bold text-white mb-6 shadow-xl shadow-purple-500/20">
                            M
                        </div>
                        <h3 className="text-3xl font-heading font-bold text-white mb-2">Merry Mekoro</h3>
                        <p className="text-purple-400 font-medium mb-6">Software Engineer</p>
                        <p className="text-slate-400 leading-relaxed mb-8 flex-grow">
                            Engineered the robust backend logic, designed scalable data architectures, and built comprehensive full-stack workflows across the application.
                        </p>
                        <div className="flex flex-wrap gap-4 w-full relative z-10">
                            <a href="https://t.me/PyhaHenkifm" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc] hover:text-white px-4 py-3 rounded-xl transition-all font-medium text-sm">
                                <MessageCircle size={18} /> Telegram
                            </a>
                            <a href="https://wa.me/16512797957" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white px-4 py-3 rounded-xl transition-all font-medium text-sm">
                                <MessageCircle size={18} /> WhatsApp
                            </a>
                        </div>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                >
                    <Link href="/">
                        <button className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-indigo-50 transition-colors">
                            Return Home
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
