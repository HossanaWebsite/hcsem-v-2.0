'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Home, Calendar, Users, Heart, Sparkles, Award, MapPin, Building, Info, Star } from 'lucide-react';
import Image from 'next/image';

const iconMap = {
    Home,
    Calendar,
    Users,
    Heart,
    Sparkles,
    Award,
    MapPin,
    Building,
    Info,
    Star
};

const defaultRooms = [
    {
        id: 1,
        name: 'Welcome Hall',
        iconName: 'Home',
        title: 'Community Gathering Space',
        description: 'Our main gathering area where members connect and celebrate together.',
        image: '/folder/2.jpg',
        features: ['Monthly meetups', 'Cultural celebrations', 'Networking events']
    },
    {
        id: 2,
        name: 'Events Room',
        iconName: 'Calendar',
        title: 'Event Planning Center',
        description: 'Where we organize and coordinate all our community events and activities.',
        image: '/folder/3.jpg',
        features: ['Festival planning', 'Workshop coordination', 'Event management']
    },
    {
        id: 3,
        name: 'Community Hub',
        iconName: 'Users',
        title: 'Member Services',
        description: 'Support and resources for all community members.',
        image: '/folder/9.jpg',
        features: ['New member orientation', 'Resource sharing', 'Community support']
    },
    {
        id: 4,
        name: 'Cultural Center',
        iconName: 'Heart',
        title: 'Heritage Preservation',
        description: 'Dedicated to preserving and celebrating our rich Ethiopian culture.',
        image: '/folder/10.jpg',
        features: ['Language classes', 'Traditional arts', 'Cultural education']
    },
    {
        id: 5,
        name: 'Youth Wing',
        iconName: 'Sparkles',
        title: 'Next Generation Programs',
        description: 'Empowering our youth through education and mentorship.',
        image: '/folder/13.jpg',
        features: ['Mentorship programs', 'Educational workshops', 'Youth leadership']
    },
    {
        id: 6,
        name: 'Achievement Hall',
        iconName: 'Award',
        title: 'Success Stories',
        description: 'Celebrating the accomplishments of our community members.',
        image: '/folder/16.jpg',
        features: ['Member achievements', 'Community impact', 'Recognition programs']
    }
];

export default function RoomWalkthrough({ items }) {
    const rooms = (items && items.length > 0) ? items : defaultRooms;
    const [currentRoom, setCurrentRoom] = useState(0);
    const [direction, setDirection] = useState(0);

    const nextRoom = () => {
        setDirection(1);
        setCurrentRoom((prev) => (prev + 1) % rooms.length);
    };

    const prevRoom = () => {
        setDirection(-1);
        setCurrentRoom((prev) => (prev - 1 + rooms.length) % rooms.length);
    };

    const goToRoom = (index) => {
        setDirection(index > currentRoom ? 1 : -1);
        setCurrentRoom(index);
    };

    const room = rooms[currentRoom];
    const Icon = iconMap[room.iconName] || iconMap.Info;

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.8,
            rotateY: direction > 0 ? 45 : -45
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.8,
            rotateY: direction < 0 ? 45 : -45
        })
    };

    return (
        <div className="relative">
            {/* Progress Bar */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Room {currentRoom + 1} of {rooms.length}
                    </h3>
                    <div className="text-sm font-medium text-primary">
                        {Math.round(((currentRoom + 1) / rooms.length) * 100)}% Complete
                    </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-primary to-orange-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentRoom + 1) / rooms.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Room Navigation Dots */}
            <div className="flex justify-center gap-2 mb-8">
                {rooms.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToRoom(index)}
                        className={`transition-all duration-300 ${index === currentRoom
                            ? 'w-12 h-3 bg-primary rounded-full'
                            : index < currentRoom
                                ? 'w-3 h-3 bg-primary/50 rounded-full'
                                : 'w-3 h-3 bg-muted rounded-full'
                            }`}
                        aria-label={`Go to room ${index + 1}`}
                    />
                ))}
            </div>

            {/* Room Content */}
            <div className="relative h-[600px] perspective-1000">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentRoom}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.3 },
                            scale: { duration: 0.3 },
                            rotateY: { duration: 0.5 }
                        }}
                        className="absolute inset-0"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                            {/* Image */}
                            <div className="relative rounded-3xl overflow-hidden glass-card h-full">
                                <Image
                                    src={room.image}
                                    alt={room.name}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover"
                                />
                                <div className="absolute top-6 left-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col justify-center space-y-6">
                                <div>
                                    <h2 className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">
                                        {room.name}
                                    </h2>
                                    <h3 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                                        {room.title}
                                    </h3>
                                    <p className="text-xl text-muted-foreground leading-relaxed">
                                        {room.description}
                                    </p>
                                </div>

                                {/* Features */}
                                <div className="space-y-3">
                                    {room.features.map((feature, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                            <span className="text-lg">{feature}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
                <button
                    onClick={prevRoom}
                    disabled={currentRoom === 0}
                    className="flex items-center gap-2 px-6 py-3 rounded-full glass-card hover:bg-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="font-medium">Previous</span>
                </button>

                <button
                    onClick={nextRoom}
                    disabled={currentRoom === rooms.length - 1}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="font-medium">Next Room</span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
