'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Heart, Users, Lightbulb, Target, Shield, Sparkles } from 'lucide-react';

export default function AboutPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const activities = [
        {
            icon: Heart,
            title: "Cultural Events",
            description: "Traditional celebrations, festivals, and gatherings that keep our heritage alive and vibrant.",
            color: "from-amber-500 to-orange-500"
        },
        {
            icon: Users,
            title: "Community Support",
            description: "Assistance to new arrivals, integration help, and support during challenging times.",
            color: "from-orange-500 to-red-500"
        },
        {
            icon: Lightbulb,
            title: "Youth Programs",
            description: "Educational programs, mentorship, and cultural education for the next generation.",
            color: "from-amber-600 to-yellow-500"
        },
        {
            icon: Target,
            title: "Networking",
            description: "Opportunities to connect, collaborate, and build meaningful relationships.",
            color: "from-orange-600 to-amber-500"
        },
        {
            icon: Shield,
            title: "Advocacy",
            description: "Representing our community's interests and ensuring our voices are heard.",
            color: "from-red-500 to-orange-500"
        },
        {
            icon: Sparkles,
            title: "Resource Sharing",
            description: "Access to resources, information, and services that help our members succeed.",
            color: "from-yellow-500 to-amber-500"
        }
    ];

    return (
        <div ref={containerRef} className="min-h-screen">
            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center space-y-8"
                >
                    <h1 className="text-6xl md:text-8xl font-heading font-bold">
                        About HCSEM
                    </h1>
                    <p className="text-2xl md:text-3xl font-light text-foreground/80 leading-relaxed">
                        Connecting Ethiopians, preserving culture,<br />
                        building a stronger community in Minnesota.
                    </p>
                </motion.div>
            </section>

            {/* Mission & Vision - Alternating */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto space-y-32">
                    {/* Mission - Left */}
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                    >
                        <div className="space-y-6">
                            <h2 className="text-5xl md:text-6xl font-heading font-bold text-gradient">
                                Our Mission
                            </h2>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                To foster a sense of belonging and unity among Ethiopians from Hossaaena City living in Minnesota,
                                while preserving our cultural identity and supporting our community members in their journey to
                                success and integration.
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
                                src="/about-mission.png"
                                alt="Our Mission"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </motion.div>

                    {/* Vision - Right */}
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
                                src="/about-vision.png"
                                alt="Our Vision"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                        <div className="space-y-6 order-1 lg:order-2">
                            <h2 className="text-5xl md:text-6xl font-heading font-bold text-gradient">
                                Our Vision
                            </h2>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                To be the leading Ethiopian community organization in Minnesota, recognized for our commitment
                                to cultural preservation, community development, and creating opportunities for our members to
                                thrive and contribute to society.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* What We Do - Flying Birds Effect */}
            <section className="py-32 px-6 bg-muted/20">
                <div className="max-w-7xl mx-auto space-y-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-6xl font-heading font-bold text-center text-gradient"
                    >
                        What We Do
                    </motion.h2>

                    <div className="space-y-24">
                        {activities.map((activity, index) => {
                            const Icon = activity.icon;
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
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activity.color} flex items-center justify-center`}>
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="text-3xl font-heading font-bold">{activity.title}</h3>
                                            <p className="text-lg text-muted-foreground leading-relaxed">
                                                {activity.description}
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
