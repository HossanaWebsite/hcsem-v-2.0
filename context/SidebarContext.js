'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) setIsMobileOpen(false);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Desktop: collapse/expand. Mobile: open/close overlay.
    const toggleSidebar = () => {
        if (isMobile) {
            setIsMobileOpen(prev => !prev);
        } else {
            setIsExpanded(prev => !prev);
        }
    };

    // Explicit mobile toggle (used by AppHeader hamburger)
    const toggleMobileSidebar = () => setIsMobileOpen(prev => !prev);

    const closeMobileSidebar = () => setIsMobileOpen(false);

    return (
        <SidebarContext.Provider
            value={{
                isExpanded,
                isHovered,
                isMobileOpen,
                isMobile,
                toggleSidebar,
                toggleMobileSidebar,
                closeMobileSidebar,
                setIsHovered,
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
}

export const useSidebar = () => useContext(SidebarContext);
