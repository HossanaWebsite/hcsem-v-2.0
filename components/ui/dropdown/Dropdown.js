'use client';
import React, { useEffect, useRef, useState } from 'react';

export function Dropdown({ isOpen, onClose, className, children }) {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div ref={dropdownRef} className={`absolute z-40 ${className}`}>
            {children}
        </div>
    );
}

export function DropdownItem({ children, onClick, href, className }) {
    if (href) {
        return <a href={href} className={className}>{children}</a>
    }
    return (
        <button onClick={onClick} className={className}>
            {children}
        </button>
    )
}
