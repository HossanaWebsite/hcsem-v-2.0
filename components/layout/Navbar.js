'use client'
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Menu, X, Sun, Moon, Monitor, Search, Layout, History } from "lucide-react"
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from "next-themes"
import SearchOverlay from "@/components/SearchOverlay"

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [showThemeMenu, setShowThemeMenu] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [showLanguageMenu, setShowLanguageMenu] = useState(false)
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [logoUrl, setLogoUrl] = useState(null);
    const { language, setLanguage } = useLanguage();

    useEffect(() => {
        setMounted(true)
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll)

        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data.logoUrl) setLogoUrl(data.logoUrl);
                }
            } catch (error) {
                console.error("Failed to fetch settings for navbar logo", error);
            }
        };
        fetchSettings();

        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Events", href: "/events" },
        { name: "Blog", href: "/blog" },
        { name: "Contact", href: "/contact" },
    ]

    const themeOptions = [
        { name: 'Light', value: 'light', icon: Sun },
        { name: 'System', value: 'system', icon: Monitor },
        { name: 'Dark', value: 'dark', icon: Moon },
    ]

    const languageOptions = [
        { name: 'English', value: 'en', flag: '🇺🇸' },
        { name: 'Amharic', value: 'am', flag: '🇪🇹' },
    ]

    return (
        <>
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-2 backdrop-blur-md border-b border-white/10" : "py-4 bg-transparent"
                    }`}
            >
                <div className="container mx-auto px-4">
                    <nav className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2">
                            {logoUrl ? (
                                <div className="relative w-8 h-8">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <Image src={logoUrl} alt="Logo" width={32} height={32} className="object-contain w-full h-full" />
                                </div>
                            ) : (
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                                    <Image src="/images/logo.png" alt="Logo" width={32} height={32} className="object-contain w-full h-full" />
                                </div>
                            )}
                            <span>HCSEM<span className="text-primary">.</span></span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="hidden lg:flex items-center gap-4">
                            {/* Search Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                                onClick={() => setIsSearchOpen(true)}
                            >
                                <Search className="h-5 w-5" />
                                <span className="sr-only">Search</span>
                            </Button>

                            {/* Language Dropdown */}
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-full px-3 gap-2"
                                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                                >
                                    <span>{language === 'en' ? '🇺🇸 EN' : '🇪🇹 AM'}</span>
                                </Button>

                                {showLanguageMenu && (
                                    <div className="absolute top-full right-0 mt-2 bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-lg p-2 min-w-[140px]">
                                        {languageOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    setLanguage(option.value);
                                                    setShowLanguageMenu(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${language === option.value
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'hover:bg-muted text-muted-foreground'
                                                    }`}
                                            >
                                                <span className="text-base">{option.flag}</span>
                                                <span className="text-sm font-medium">{option.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Theme Toggle Dropdown */}
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full"
                                    onClick={() => setShowThemeMenu(!showThemeMenu)}
                                >
                                    {mounted && (
                                        <>
                                            {theme === 'light' && <Sun className="h-5 w-5" />}
                                            {theme === 'dark' && <Moon className="h-5 w-5" />}
                                            {theme === 'system' && <Monitor className="h-5 w-5" />}
                                        </>
                                    )}
                                    <span className="sr-only">Toggle theme</span>
                                </Button>

                                {showThemeMenu && (
                                    <div className="absolute top-full right-0 mt-2 bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-lg p-2 min-w-[140px]">
                                        {themeOptions.map((option) => {
                                            const Icon = option.icon
                                            return (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        setTheme(option.value)
                                                        setShowThemeMenu(false)
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${theme === option.value
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'hover:bg-muted text-muted-foreground'
                                                        }`}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{option.name}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className="lg:hidden p-2 text-foreground"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </nav>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-white/10 p-4 lg:hidden animate-accordion-down">
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-medium p-2 hover:bg-white/5 rounded-lg"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {/* Mobile Search Button */}
                            <button
                                onClick={() => {
                                    setIsSearchOpen(true)
                                    setIsMobileMenuOpen(false)
                                }}
                                className="text-lg font-medium p-2 hover:bg-white/5 rounded-lg flex items-center gap-2"
                            >
                                <Search className="w-5 h-5" />
                                Search
                            </button>

                            {/* Mobile Theme Selector */}
                            <div className="mt-4 space-y-2">
                                <p className="text-sm text-muted-foreground px-2">Theme</p>
                                <div className="flex gap-2">
                                    {themeOptions.map((option) => {
                                        const Icon = option.icon
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => setTheme(option.value)}
                                                className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition-colors ${theme === option.value
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'bg-muted/50 text-muted-foreground'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span className="text-xs">{option.name}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    )
}
