'use client';
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { Menu } from 'lucide-react';

const AppHeader = () => {
    const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
    const inputRef = useRef(null);

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
                inputRef.current?.focus();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <header className="sticky top-0 flex w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-40 h-20">
            <div className="flex items-center justify-between grow px-4 lg:px-6">
                <div className="flex items-center gap-4">
                    <button
                        className="flex items-center justify-center w-10 h-10 text-gray-500 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                        onClick={handleToggle}
                        aria-label="Toggle Sidebar"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <Link href="/" className="lg:hidden">
                        <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                            H
                        </div>
                    </Link>

                    {/* Desktop Search */}
                    <div className="hidden lg:block relative ml-4">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z" fill="currentColor" />
                            </svg>
                        </span>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search everything..."
                            className="w-80 h-11 bg-gray-100 dark:bg-gray-900 border-none rounded-xl pl-11 pr-14 text-sm focus:ring-2 focus:ring-brand-500/20 dark:text-white transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                            <span className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-[10px] text-gray-400 font-medium">⌘</span>
                            <span className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-[10px] text-gray-400 font-medium">K</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 lg:gap-4">
                    <ThemeToggleButton />
                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block" />
                    <NotificationDropdown />
                    <UserDropdown />
                </div>
            </div>
        </header>
    );
};

export default AppHeader;
