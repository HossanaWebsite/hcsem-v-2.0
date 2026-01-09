'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import RoomWalkthrough from '@/components/RoomWalkthrough';
import InfiniteScroll from '@/components/InfiniteScroll';
import VideoSection from '@/components/VideoSection';
import LargeGallery from '@/components/LargeGallery';
import PhotoTicker from '@/components/PhotoTicker';

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        eventsPageTitle: 'Events',
        eventsPageSubtitle: 'Join us in our upcoming gatherings\nand celebrations.',
        eventsVideoTitle: 'Experience Our Events',
        eventsVideoSubtitle: 'Watch how we celebrate culture, unity, and community together',
        eventsVideoUrl: '/folder/1.mp4',
        walkthroughTitle: 'Explore Our Community',
        walkthroughSubtitle: 'Take a journey through our community spaces and discover what we offer',
        walkthroughItems: [],
        eventsGalleryTitle: 'Event Gallery',
        eventsGallerySubtitle: 'Moments captured from our community events and celebrations',
        eventsGalleryImages: [],
        tickerImages: [],
        defaultEvents: [],
        showEventsHeader: true,
        showEventsVideo: true,
        showEventsGallery: true,
        showWalkthrough: true
    });

    useEffect(() => {
        // Fetch events
        fetch('/api/events')
            .then(res => res.json())
            .then(data => {
                setEvents(data.data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));

        // Fetch settings
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    setSettings({
                        ...data,
                        eventsPageTitle: data.eventsPageTitle || 'Events',
                        eventsPageSubtitle: data.eventsPageSubtitle || 'Join us in our upcoming gatherings\nand celebrations.',
                        eventsVideoTitle: data.eventsVideoTitle || 'Experience Our Events',
                        eventsVideoSubtitle: data.eventsVideoSubtitle || 'Watch how we celebrate culture, unity, and community together',
                        eventsVideoUrl: data.eventsVideoUrl || '/folder/1.mp4',
                        walkthroughTitle: data.walkthroughTitle || 'Explore Our Community',
                        walkthroughSubtitle: data.walkthroughSubtitle || 'Take a journey through our community spaces and discover what we offer',
                        walkthroughItems: data.walkthroughItems || [],
                        eventsGalleryTitle: data.eventsGalleryTitle || 'Event Gallery',
                        eventsGallerySubtitle: data.eventsGallerySubtitle || 'Moments captured from our community events and celebrations',
                        eventsGalleryImages: (data.eventsGalleryImages && data.eventsGalleryImages.length > 0) ? data.eventsGalleryImages : [],
                        tickerImages: data.tickerImages || [],
                        defaultEvents: data.defaultEvents || [],
                        showEventsHeader: data.showEventsHeader !== undefined ? data.showEventsHeader : true,
                        showEventsVideo: data.showEventsVideo !== undefined ? data.showEventsVideo : true,
                        showEventsGallery: data.showEventsGallery !== undefined ? data.showEventsGallery : true,
                        showWalkthrough: data.showWalkthrough !== undefined ? data.showWalkthrough : true
                    });
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const displayEvents = events.length > 0 ? events : settings.defaultEvents;

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            {settings.showEventsHeader && (
                <section className="min-h-[60vh] flex items-center justify-center px-6 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto text-center space-y-6"
                    >
                        <h1 className="text-6xl md:text-8xl font-heading font-bold">
                            {settings.eventsPageTitle}
                        </h1>
                        <p className="text-2xl md:text-3xl font-light text-foreground/80 whitespace-pre-line">
                            {settings.eventsPageSubtitle}
                        </p>
                    </motion.div>
                </section>
            )}

            {/* Events Grid with Flying Animations */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto space-y-32">
                    {displayEvents.map((event, index) => {
                        const isEven = index % 2 === 0;

                        return (
                            <motion.div
                                key={event._id}
                                initial={{
                                    opacity: 0,
                                    x: isEven ? -300 : 300,
                                    y: 150,
                                    rotate: isEven ? -20 : 20,
                                    scale: 0.8
                                }}
                                whileInView={{
                                    opacity: 1,
                                    x: 0,
                                    y: 0,
                                    rotate: 0,
                                    scale: 1
                                }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{
                                    duration: 1.2,
                                    type: "spring",
                                    bounce: 0.4
                                }}
                                className="group"
                            >
                                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:grid-flow-dense' : ''}`}>
                                    {/* Image/Visual */}
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                        className={`relative h-96 rounded-3xl overflow-hidden ${!isEven ? 'lg:col-start-2' : ''}`}
                                    >
                                        {event.coverImage ? (
                                            <img
                                                src={event.coverImage}
                                                alt={event.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary via-orange-500 to-amber-500 flex items-center justify-center">
                                                <Calendar className="w-24 h-24 text-foreground/30" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    </motion.div>

                                    {/* Content */}
                                    <div className={`space-y-6 ${!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 }}
                                            className="space-y-4"
                                        >
                                            {/* Date & Time */}
                                            <div className="flex flex-wrap gap-3">
                                                <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="text-sm font-medium">
                                                        {new Date(event.date).toLocaleDateString('en-US', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="text-sm font-medium">
                                                        {new Date(event.date).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h2 className="text-4xl md:text-5xl font-heading font-bold">
                                                {event.title}
                                            </h2>

                                            {/* Location */}
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <MapPin className="w-5 h-5" />
                                                <span className="text-lg">{event.location}</span>
                                            </div>

                                            {/* Description */}
                                            <p className="text-lg text-muted-foreground leading-relaxed">
                                                {event.description}
                                            </p>

                                            {/* CTA */}
                                            <motion.div
                                                whileHover={{ x: 10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Link
                                                    href={`/events/${event._id}`}
                                                    className="inline-flex items-center gap-2 text-primary font-semibold text-lg group/link"
                                                >
                                                    Learn More
                                                    <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                                                </Link>
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* Events Carousel */}
            {settings.tickerImages && settings.tickerImages.length > 0 && (
                <PhotoTicker images={settings.tickerImages} />
            )}

            {/* Community Video Section */}
            {settings.showEventsVideo && (
                <section className="py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center space-y-4 mb-12"
                        >
                            <h2 className="text-5xl md:text-6xl font-heading font-bold text-gradient">
                                {settings.eventsVideoTitle}
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                {settings.eventsVideoSubtitle}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="aspect-video max-w-5xl mx-auto"
                        >
                            <VideoSection
                                src={settings.eventsVideoUrl || "/folder/1.mp4"}
                                title={settings.eventsVideoTitle}
                                description={settings.eventsVideoSubtitle}
                            />
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Room-by-Room Walkthrough */}
            {settings.showWalkthrough && (
                <section className="py-32 px-6 bg-muted/20">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center space-y-4 mb-16"
                        >
                            <h2 className="text-5xl md:text-6xl font-heading font-bold text-gradient">
                                {settings.walkthroughTitle || "Explore Our Community"}
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                {settings.walkthroughSubtitle || "Take a journey through our community spaces and discover what we offer"}
                            </p>
                        </motion.div>

                        <RoomWalkthrough items={settings.walkthroughItems} />
                    </div>
                </section>
            )}

            {/* Large Gallery */}
            {settings.showEventsGallery && (
                <section className="py-32 px-6 bg-muted/20">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center space-y-4 mb-12"
                        >
                            <h2 className="text-5xl md:text-6xl font-heading font-bold text-gradient">
                                {settings.eventsGalleryTitle}
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                {settings.eventsGallerySubtitle}
                            </p>
                        </motion.div>

                        <LargeGallery images={settings.eventsGalleryImages} />
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-32 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center space-y-8"
                >
                    <h2 className="text-4xl md:text-5xl font-heading font-bold">
                        Don't miss out on our events
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Stay connected with our community and never miss an event.
                    </p>
                    <Link href="/contact">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-primary text-primary-foreground px-10 py-5 rounded-full font-semibold text-lg shadow-lg hover:shadow-primary/25 transition-all"
                        >
                            Get Involved
                        </motion.button>
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}
