'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        // Load from local storage if available
        const stored = localStorage.getItem('app_language_v2');
        if (stored) {
            setLanguage(stored);
        } else {
            // Force default to English if no v2 preference exists
            setLanguage('en');
            localStorage.setItem('app_language_v2', 'en');
        }
    }, []);

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'am' : 'en';
        setLanguage(newLang);
        localStorage.setItem('app_language_v2', newLang);
    };

    const getLocalized = (content) => {
        if (!content) return '';
        if (typeof content === 'string') return content; // Fallback for legacy string data
        return content[language] || content['en'] || '';
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, getLocalized }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
