'use client';
import "./admin.css";

import { SidebarProvider, useSidebar } from '@/context/SidebarContext';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import Backdrop from '@/components/layout/Backdrop';

function AdminLayoutContent({ children }) {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    // Dynamic class for main content margin based on sidebar state
    // If not mobile open, we respect the expanded/hovered state
    const marginClass = (isExpanded || isHovered) ? 'lg:ml-64' : 'lg:ml-[90px]';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <AppSidebar />
            <Backdrop />
            <div className={`transition-all duration-300 ease-in-out ${marginClass}`}>
                <AppHeader />
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function AdminLayout({ children }) {
    return (
        <SidebarProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </SidebarProvider>
    );
}
