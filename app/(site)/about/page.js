'use client';

import { motion, useScroll } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Heart, Users, Lightbulb, Target, Shield, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
    const { getLocalized } = useLanguage();
    const containerRef = useRef(null);
    const [settings, setSettings] = useState({
        aboutPageTitle: { en: 'About HCSEM', am: 'ስለ HCSEM' },
        aboutPageSubtitle: { en: 'Connecting Ethiopians...', am: 'ኢትዮጵያውያንን ማገናኘት...' },
        aboutPageImage: '',
        aboutMission: { en: '', am: '' },
        aboutMissionImage: '',
        aboutVision: { en: '', am: '' },
        aboutVisionImage: '',
        aboutActivities: [],
        showAboutHeader: true,
        showAboutMission: true,
        showAboutVision: true
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    setSettings({
                        ...data,
                        aboutActivities: data.aboutActivities || []
                    });
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const iconMap = { Heart, Users, Lightbulb, Target, Shield, Sparkles };

    const defaultActivities = [
        {
            icon: "Heart",
            title: { en: "Cultural Events", am: "የባህል ዝግጅቶች" },
            description: { en: "Traditional celebrations, festivals, and gatherings that keep our heritage alive and vibrant.", am: "ባህላችንን ህያው እና ንቁ ሆነው እንዲቀጥሉ የሚያደርጉ ባህላዊ በዓላትና ስብሰባዎች።" },
            color: "from-amber-500 to-orange-500"
        },
        // ... (other defaults can be added here if needed for fallback)
    ];

    const displayActivities = settings.aboutActivities && settings.aboutActivities.length > 0
        ? settings.aboutActivities
        : defaultActivities;

    return (
        <div ref={containerRef} className="min-h-screen">
            {/* Hero Section */}
            {settings.showAboutHeader && (
                <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
                    {/* Background image if provided */}
                    {settings.aboutPageImage && (
                        <div
                            className="absolute inset-0 bg-cover bg-center z-0 opacity-20 pointer-events-none"
                            style={{ backgroundImage: `url(${settings.aboutPageImage})` }}
                        />
                    )}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto text-center space-y-8 relative z-10"
                    >
                        <h1 className="text-6xl md:text-8xl font-heading font-bold">
                            {getLocalized(settings.aboutPageTitle) || 'About HCSEM'}
                        </h1>
                        <p className="text-2xl md:text-3xl font-light text-foreground/80 leading-relaxed whitespace-pre-line">
                            {getLocalized(settings.aboutPageSubtitle)}
                        </p>
                    </motion.div>
                </section>
            )}

            {/* Mission & Vision - Alternating */}
            {(settings.showAboutMission || settings.showAboutVision) && (
                <section className="py-32 px-6">
                    <div className="max-w-7xl mx-auto space-y-32">
                        {/* Mission - Left */}
                        {settings.showAboutMission && (
                            <motion.div
                                initial={{ opacity: 0, x: -100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                            >
                                <div className="space-y-6">
                                    <h2 className="text-5xl md:text-6xl font-heading font-bold text-gradient">
                                        {getLocalized({ en: "Our Mission", am: "ተልዕኳችን" })}
                                    </h2>
                                    <p className="text-xl text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {getLocalized(settings.aboutMission)}
                                    </p>
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="h-96 rounded-3xl overflow-hidden glass-card"
                                >
                                    <img
                                        src={settings.aboutMissionImage || "/about-mission.png"}
                                        alt="Our Mission"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Vision - Right */}
                        {settings.showAboutVision && (
                            <motion.div
                                initial={{ opacity: 0, x: 100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="h-96 rounded-3xl overflow-hidden glass-card order-2 lg:order-1"
                                >
                                    <img
                                        src={settings.aboutVisionImage || "/about-vision.png"}
                                        alt="Our Vision"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                                <div className="space-y-6 order-1 lg:order-2">
                                    <h2 className="text-5xl md:text-6xl font-heading font-bold text-gradient">
                                        {getLocalized({ en: "Our Vision", am: "ራዕያችን" })}
                                    </h2>
                                    <p className="text-xl text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {getLocalized(settings.aboutVision)}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </section>
            )}

            {/* What We Do - Flying Birds Effect */}
            <section className="py-32 px-6 bg-muted/20">
                <div className="max-w-7xl mx-auto space-y-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-6xl font-heading font-bold text-center text-gradient"
                    >
                        {getLocalized({ en: "What We Do", am: "የምንሰራው ስራ" })}
                    </motion.h2>

                    <div className="space-y-24">
                        {displayActivities.map((activity, index) => {
                            const Icon = iconMap[activity.icon] || Heart;
                            const isEven = index % 2 === 0;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{
                                        opacity: 0,
                                        x: isEven ? -200 : 200,
                                        y: 100,
                                        rotate: isEven ? -15 : 15
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        x: 0,
                                        y: 0,
                                        rotate: 0
                                    }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{
                                        duration: 1,
                                        type: "spring",
                                        bounce: 0.3
                                    }}
                                    className={`flex ${isEven ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className="max-w-2xl">
                                        <div className="glass-card p-10 space-y-6 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500">
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activity.color || 'from-amber-500 to-orange-500'} flex items-center justify-center`}>
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="text-3xl font-heading font-bold">
                                                {getLocalized(activity.title)}
                                            </h3>
                                            <p className="text-lg text-muted-foreground leading-relaxed">
                                                {getLocalized(activity.description)}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}

