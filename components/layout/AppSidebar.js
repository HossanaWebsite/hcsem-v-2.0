'use client';
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import {
    BoxCubeIcon,
    CalenderIcon,
    ChevronDownIcon,
    GridIcon,
    HorizontaLDots,
    ListIcon,
    // TableIcon, // This will be replaced by lucide-react's TableIcon
    UserCircleIcon,
    // Add other icons as needed from your index.js
} from "@/components/icons/index";
import {
    LayoutDashboard,
    Users,
    Settings,
    FileText,
    Calendar,
    MessageSquare,
    LogOut,
    Menu,
    X,
    Table as TableIcon
} from 'lucide-react';

// Define menu items locally for now
const navItems = [
    {
        icon: <GridIcon className="" />,
        name: "Dashboard",
        subItems: [
            { name: "Dash", path: "/admin", pro: false },
            { name: "Requests", path: "/admin/requests", pro: false },
        ],
    },
    //   {
    //     icon: <CalenderIcon />,
    //     name: "Calendar",
    //     path: "/admin/calendar",
    //   },
    {
        name: "Content",
        icon: <ListIcon />,
        subItems: [
            { name: "Blogs", path: "/admin/blogs", pro: false },
            { name: "Events", path: "/admin/events", pro: false },
        ],
    },
    {
        name: "Website Content",
        icon: <LayoutDashboard />,
        subItems: [
            { name: "Home Page", path: "/admin/homepage", pro: false },
            { name: "Events Page", path: "/admin/eventpage", pro: false },
            { name: "About Page", path: "/admin/aboutpage", pro: false },
            { name: "Blog Page", path: "/admin/blogpage", pro: false },
            { name: "Contact Page", path: "/admin/contactpage", pro: false },
        ],
    },
    {
        name: "Management",
        icon: <TableIcon />,
        subItems: [
            { name: "Users", path: "/admin/users", pro: false },
            { name: "Roles", path: "/admin/roles", pro: false },
            { name: "Audit Logs", path: "/admin/logs", pro: false },
        ],
    },
];

const AppSidebar = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const pathname = usePathname();
    const [logoUrl, setLogoUrl] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data.logoUrl) setLogoUrl(data.logoUrl);
                }
            } catch (error) {
                console.error("Failed to fetch settings for sidebar logo", error);
            }
        };
        fetchSettings();
    }, []);

    const [openSubmenu, setOpenSubmenu] = useState(null);
    const [subMenuHeight, setSubMenuHeight] = useState({});
    const subMenuRefs = useRef({});

    const isActive = useCallback((path) => path === pathname, [pathname]);

    useEffect(() => {
        if (openSubmenu !== null) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            if (subMenuRefs.current[key]) {
                setSubMenuHeight((prevHeights) => ({
                    ...prevHeights,
                    [key]: subMenuRefs.current[key]?.scrollHeight || 0,
                }));
            }
        }
    }, [openSubmenu]);

    const handleSubmenuToggle = (index, menuType) => {
        setOpenSubmenu((prevOpenSubmenu) => {
            if (
                prevOpenSubmenu &&
                prevOpenSubmenu.type === menuType &&
                prevOpenSubmenu.index === index
            ) {
                return null; // Close if already open
            }
            return { type: menuType, index }; // Open new
        });
    };

    const renderMenuItems = (items, menuType) => (
        <ul className="flex flex-col gap-4">
            {items.map((nav, index) => (
                <li key={nav.name}>
                    {nav.subItems ? (
                        <button
                            onClick={() => handleSubmenuToggle(index, menuType)}
                            className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                                ? "menu-item-active"
                                : "menu-item-inactive"
                                } cursor-pointer ${!isExpanded && !isHovered
                                    ? "lg:justify-center"
                                    : "lg:justify-start"
                                }`}
                        >
                            <span
                                className={` ${openSubmenu?.type === menuType && openSubmenu?.index === index
                                    ? "menu-item-icon-active"
                                    : "menu-item-icon-inactive"
                                    }`}
                            >
                                {nav.icon}
                            </span>
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <span className={`menu-item-text ml-3 font-medium`}>{nav.name}</span>
                            )}
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <ChevronDownIcon
                                    className={`ml-auto w-5 h-5 transition-transform duration-200  ${openSubmenu?.type === menuType &&
                                        openSubmenu?.index === index
                                        ? "rotate-180 text-indigo-400"
                                        : ""
                                        }`}
                                />
                            )}
                        </button>
                    ) : (
                        nav.path && (
                            <Link
                                href={nav.path}
                                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                                    } ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
                            >
                                <span
                                    className={`${isActive(nav.path)
                                        ? "menu-item-icon-active"
                                        : "menu-item-icon-inactive"
                                        }`}
                                >
                                    {nav.icon}
                                </span>
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    <span className={`menu-item-text ml-3 font-medium`}>{nav.name}</span>
                                )}
                            </Link>
                        )
                    )}
                    {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                        <div
                            ref={(el) => {
                                subMenuRefs.current[`${menuType}-${index}`] = el;
                            }}
                            className="overflow-hidden transition-all duration-300"
                            style={{
                                height:
                                    openSubmenu?.type === menuType && openSubmenu?.index === index
                                        ? `${subMenuHeight[`${menuType}-${index}`]}px`
                                        : "0px",
                            }}
                        >
                            <ul className="mt-2 space-y-1 ml-9 border-l border-white/5 pl-4">
                                {nav.subItems.map((subItem) => (
                                    <li key={subItem.name}>
                                        <Link
                                            href={subItem.path}
                                            className={`menu-dropdown-item py-2 ${isActive(subItem.path)
                                                ? "menu-dropdown-item-active"
                                                : "menu-dropdown-item-inactive"
                                                }`}
                                        >
                                            {subItem.name}
                                            <span className="flex items-center gap-1 ml-auto">
                                                {subItem.new && (
                                                    <span className="ml-auto menu-dropdown-badge menu-dropdown-badge-active">
                                                        new
                                                    </span>
                                                )}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 
            bg-white/80 dark:bg-slate-950/40 backdrop-blur-2xl 
            text-slate-600 dark:text-slate-400 
            h-screen transition-all duration-300 ease-in-out z-50 
            border-r border-slate-200 dark:border-white/5 
        ${isExpanded || isMobileOpen
                    ? "w-[290px]"
                    : isHovered
                        ? "w-[290px]"
                        : "w-[90px]"
                }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`py-8 flex items-center h-20 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                    }`}
            >
                <Link href="/" className="flex items-center gap-4 group">
                    {logoUrl ? (
                        <div className="relative w-10 h-10 group-hover:scale-110 transition-transform">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={logoUrl} alt="Logo" className="object-contain w-full h-full" />
                        </div>
                    ) : (
                        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                            H
                        </div>
                    )}
                    {(isExpanded || isHovered || isMobileOpen) && (
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">HCSEM</h1>
                    )}
                </Link>
            </div>
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar flex-1 pb-10">
                <nav className="">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2
                                className={`mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-600 ${!isExpanded && !isHovered
                                    ? "lg:justify-center"
                                    : "justify-start"
                                    } flex items-center`}
                            >
                                {isExpanded || isHovered || isMobileOpen ? (
                                    "Command Menu"
                                ) : (
                                    <HorizontaLDots className="w-4 h-4" />
                                )}
                            </h2>
                            {renderMenuItems(navItems, "main")}
                        </div>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default AppSidebar;
