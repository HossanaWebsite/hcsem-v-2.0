'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import Image from 'next/image';

export default function InfiniteScroll({ items = [], speed = 50 }) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const scrollRef = useRef(null);
    const controls = useAnimation();

    // Calculate animation duration based on content width and speed
    const duration = items.length * speed;

    useEffect(() => {
        if (isPlaying) {
            controls.start({
                x: [0, -50 + '%'],
                transition: {
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: isHovered ? duration * 2 : duration,
                        ease: "linear",
                    },
                },
            });
        } else {
            controls.stop();
        }
    }, [isPlaying, isHovered, controls, duration]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="relative overflow-hidden py-8">
            {/* Play/Pause Button */}
            <div className="absolute top-4 right-4 z-20">
                <button
                    onClick={togglePlay}
                    className="glass-card p-3 rounded-full hover:bg-primary/20 transition-all group"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? (
                        <Pause className="w-5 h-5 text-primary" />
                    ) : (
                        <Play className="w-5 h-5 text-primary" />
                    )}
                </button>
            </div>

            {/* Scrolling Content */}
            <div
                className="flex gap-6"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <motion.div
                    ref={scrollRef}
                    className="flex gap-6 flex-shrink-0"
                    animate={controls}
                >
                    {/* Render items twice for seamless loop */}
                    {[...items, ...items].map((item, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-80 h-96 rounded-2xl overflow-hidden glass-card group cursor-pointer"
                        >
                            {item.type === 'image' ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={item.src}
                                        alt={item.title || 'Gallery item'}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {item.title && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                                            <div>
                                                <h3 className="text-white text-2xl font-heading font-bold mb-2">
                                                    {item.title}
                                                </h3>
                                                {item.description && (
                                                    <p className="text-white/80 text-sm line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center p-8">
                                    <div className="text-center">
                                        <h3 className="text-2xl font-heading font-bold mb-2">
                                            {item.title}
                                        </h3>
                                        {item.description && (
                                            <p className="text-muted-foreground">{item.description}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
