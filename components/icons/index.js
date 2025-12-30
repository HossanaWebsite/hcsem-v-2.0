import React from 'react';

// Simplification: Instead of importing SVGs as modules (which requires specific loader config),
// I will define the icons as React components directly here or in separate files.
// For speed and reliability in this environment, I'll inline the critical ones used in Sidebar.

export const GridIcon = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.5" d="M14 10V2H20C21.1046 2 22 2.89543 22 4V10H14Z" fill="currentColor" />
        <path opacity="0.5" d="M22 14V20C22 21.1046 21.1046 22 20 22H14V14H22Z" fill="currentColor" />
        <path opacity="0.5" d="M2 20C2 21.1046 2.89543 22 4 22H10V14H2V20Z" fill="currentColor" />
        <path d="M10 2H4C2.89543 2 2 2.89543 2 4V10H10V2Z" fill="currentColor" />
    </svg>
);

export const CalenderIcon = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.5" d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" fill="currentColor" />
        <path d="M16 2V5M8 2V5M2 8H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const BoxCubeIcon = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.5" d="M12.0002 2L2 7.33333L12.0002 12.6667L22.0003 7.33333L12.0002 2Z" fill="currentColor" />
        <path d="M12.0002 22V12.6667L22.0003 7.33337V16.6667L12.0002 22Z" fill="currentColor" />
        <path opacity="0.5" d="M2 16.6667V7.33337L12.0002 12.6667V22L2 16.6667Z" fill="currentColor" />
    </svg>
);

export const ListIcon = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 6H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 12H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const TableIcon = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.5" d="M2 7V17C2 20 4 22 7 22H17C20 22 22 20 22 17V7C22 4 20 2 17 2H7C4 2 2 4 2 7Z" fill="currentColor" />
        <path d="M2 7H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M2 17H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 2V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export const ChevronDownIcon = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const HorizontaLDots = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="5" cy="12" r="2" fill="currentColor" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <circle cx="19" cy="12" r="2" fill="currentColor" />
    </svg>
);

// Add placeholders for others if needed, or implement them properly as required.
export const PieChartIcon = GridIcon;
export const PageIcon = ListIcon;
export const PlugInIcon = BoxCubeIcon;
export const UserCircleIcon = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.5" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" />
        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" fill="currentColor" />
        <path d="M18.1187 18.0001C18.1187 14.6864 15.3853 12.0001 12.0002 12.0001C8.6151 12.0001 5.8817 14.6864 5.8817 18.0001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export const BellIcon = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.73 21A2 2 0 0 1 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

