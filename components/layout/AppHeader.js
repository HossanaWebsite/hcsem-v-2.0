'use client';
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { Menu } from 'lucide-react';
import SearchOverlay from "@/components/SearchOverlay";

const AppHeader = () => {
    const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
    const inputRef = useRef(null);

    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const handleToggle = () => {
        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
            toggleSidebar();
        } else {
            toggleMobileSidebar();
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "k") {
                event.preventDefault();
                setIsSearchOpen(true);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <>
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <header className="sticky top-0 flex w-full bg-white/80 dark:bg-slate-950/20 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 z-40 h-20 transition-all duration-300">
                <div className="flex items-center justify-between grow px-4 lg:px-6">
                    <div className="flex items-center gap-4">
                        <button
                            className="flex items-center justify-center w-10 h-10 text-slate-500 dark:text-slate-400 admin-glass-card rounded-xl hover:text-indigo-600 dark:hover:text-white transition-all"
                            onClick={handleToggle}
                            aria-label="Toggle Sidebar"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <Link href="/" className="lg:hidden">
                            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
                                H
                            </div>
                        </Link>

                        {/* Desktop Search */}
                        <div className="hidden lg:block relative ml-4">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z" fill="currentColor" />
                                </svg>
                            </span>
                            <div
                                onClick={() => setIsSearchOpen(true)}
                                className="w-80 h-11 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-xl pl-11 pr-14 flex items-center text-sm text-slate-500 cursor-text hover:bg-slate-200 dark:hover:bg-slate-900/70 transition-all"
                            >
                                Find action or data...
                            </div>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                                <span className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/5 bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-500 font-bold tracking-tight">⌘</span>
                                <span className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/5 bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-500 font-bold tracking-tight">K</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4">
                        <ThemeToggleButton />
                        <div className="w-[1px] h-6 bg-white/5 mx-1 hidden sm:block" />
                        <NotificationDropdown />
                        <UserDropdown />
                    </div>
                </div>
            </header>
        </>
    );
};

export default AppHeader;
