'use client';

import Link from 'next/link';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-card border-t border-border">
            <div className="max-w-7xl mx-auto px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
                    {/* About */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                                H
                            </div>
                            <span className="text-2xl font-heading font-bold">HCSEM</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Building a stronger, united community of Ethiopians in Minnesota through cultural preservation and community support.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-heading font-bold">Quick Links</h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'Home', href: '/' },
                                { name: 'About Us', href: '/about' },
                                { name: 'Events', href: '/events' },
                                { name: 'Blog', href: '/blog' },
                                { name: 'Contact', href: '/contact' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors inline-block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Get Involved */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-heading font-bold">Get Involved</h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'Become a Member', href: '/contact' },
                                { name: 'Volunteer', href: '/contact' },
                                { name: 'Donate', href: '/contact?donate=true' },
                                { name: 'Partner With Us', href: '/contact' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors inline-block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-heading font-bold">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-muted-foreground">
                                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                                <span>info@hcsem.org</span>
                            </li>
                            <li className="flex items-start gap-3 text-muted-foreground">
                                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-start gap-3 text-muted-foreground">
                                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                                <span>Minneapolis, Minnesota</span>
                            </li>
                        </ul>
                    </div>
                </div>

{/*                 <div className="glass-card p-10 mb-16 text-center space-y-6">
                    <Heart className="w-12 h-12 mx-auto text-primary" />
                    <h3 className="text-3xl font-heading font-bold">Support Our Community</h3>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Your generous donations help us continue our mission of building a stronger, more connected community.
                    </p>
                    <Link href="/contact?donate=true">
                        <button className="bg-primary text-primary-foreground px-10 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all inline-flex items-center gap-3">
                            <Heart className="w-5 h-5" />
                            Donate Now
                        </button>
                    </Link>
                </div> */}

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground">
                    <p>© 2024 HCSEM. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-primary transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="hover:text-primary transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
