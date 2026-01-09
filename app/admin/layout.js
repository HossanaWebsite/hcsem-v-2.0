'use client';
import "./admin.css";

import { SidebarProvider, useSidebar } from '@/context/SidebarContext';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import Backdrop from '@/components/layout/Backdrop';
import ForcePasswordChangeModal from '@/components/ForcePasswordChangeModal';

function AdminLayoutContent({ children }) {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    // Dynamic class for main content margin based on sidebar state
    // If not mobile open, we respect the expanded/hovered state
    const marginClass = (isExpanded || isHovered) ? 'lg:ml-[290px]' : 'lg:ml-[90px]';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] relative overflow-x-hidden selection:bg-indigo-500/30">
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

            <AppSidebar />
            <Backdrop />
            <ForcePasswordChangeModal />
            <div className={`transition-all duration-300 ease-in-out ${marginClass} relative z-10`}>
                <AppHeader />
                <main className="p-6 md:p-10">
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
