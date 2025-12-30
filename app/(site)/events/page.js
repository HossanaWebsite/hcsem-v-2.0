'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import RoomWalkthrough from '@/components/RoomWalkthrough';
import InfiniteScroll from '@/components/InfiniteScroll';
import VideoSection from '@/components/VideoSection';
import LargeGallery from '@/components/LargeGallery';

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch events
        fetch('/api/events')
            .then(res => res.json())
            .then(data => {
                setEvents(data.events || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Mock events for demonstration
    const mockEvents = [
        {
            _id: '1',
            title: 'Cultural Festival 2024',
            description: 'Join us for our annual cultural celebration featuring traditional music, dance, and food.',
            date: new Date('2024-12-15'),
            location: 'Minneapolis Convention Center',
            coverImage: '/event-placeholder.png'
        },
        {
            _id: '2',
            title: 'Community Gathering',
            description: 'Monthly meetup for community members to connect and share experiences.',
            date: new Date('2024-12-20'),
            location: 'Community Center',
            coverImage: '/blog-placeholder.png'
        },
        {
            _id: '3',
            title: 'Youth Education Program',
            description: 'Educational workshop for young members of our community.',
            date: new Date('2024-12-25'),
            location: 'Public Library',
            coverImage: '/about-mission.png'
        }
    ];

    const displayEvents = events.length > 0 ? events : mockEvents;

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="min-h-[60vh] flex items-center justify-center px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center space-y-6"
                >
                    <h1 className="text-6xl md:text-8xl font-heading font-bold">
                        Events
                    </h1>
                    <p className="text-2xl md:text-3xl font-light text-foreground/80">
                        Join us in our upcoming gatherings<br />
                        and celebrations.
                    </p>
                </motion.div>
            </section>

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

            {/* Community Video Section */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center space-y-4 mb-12"
                    >
                        <h2 className="text-5xl md:text-6xl font-heading font-bold text-gradient">
                            Experience Our Events
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Watch how we celebrate culture, unity, and community together
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="aspect-video max-w-5xl mx-auto"
                    >
                        <VideoSection
                            src="/folder/1.mp4"
                            title="Community Events Highlights"
                            description="See our vibrant community in action"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Room-by-Room Walkthrough */}
            <section className="py-32 px-6 bg-muted/20">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center space-y-4 mb-16"
                    >
                        <h2 className="text-5xl md:text-6xl font-heading font-bold text-gradient">
                            Explore Our Community
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Take a journey through our community spaces and discover what we offer
                        </p>
                    </motion.div>

                    <RoomWalkthrough />
                </div>
            </section>

            {/* Large Gallery */}
            <section className="py-32 px-6 bg-muted/20">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center space-y-4 mb-12"
                    >
                        <h2 className="text-5xl md:text-6xl font-heading font-bold text-gradient">
                            Event Gallery
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Moments captured from our community events and celebrations
                        </p>
                    </motion.div>

                    <LargeGallery />
                </div>
            </section>

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
