'use client';

import React from 'react';
import { useSidebar } from '@/context/SidebarContext';

export default function Backdrop() {
    const { isMobileOpen, closeMobileSidebar } = useSidebar();

    if (!isMobileOpen) return null;

    return (
        <div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
            onClick={closeMobileSidebar}
        />
    );
}
