'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function CreativeGallery({ images = [] }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    if (!images || images.length === 0) return null;

    // Use up to 7 images for the accordion to look right on average screens
    const displayImages = images.slice(0, 7);

    return (
        <div className="flex w-full h-[380px] md:h-[450px] lg:h-[520px] gap-2 md:gap-4 group">
            <AnimatePresence>
                {displayImages.map((image, index) => {
                    const isHovered = hoveredIndex === index;
                    const isAnyHovered = hoveredIndex !== null;
                    
                    return (
                        <motion.div
                            key={index}
                            layout
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ 
                                layout: { type: "spring", bounce: 0.15, duration: 0.6 },
                                opacity: { duration: 0.4, delay: index * 0.1 },
                                y: { duration: 0.4, delay: index * 0.1 }
                            }}
                            className="relative h-full rounded-2xl md:rounded-[2rem] overflow-hidden cursor-pointer"
                            style={{
                                // Flex grow determines width
                                flexGrow: isHovered ? 4 : (isAnyHovered ? 1 : 2),
                                flexBasis: 0,
                                // Filter affects un-hovered images
                                filter: isAnyHovered && !isHovered ? 'blur(2px) brightness(0.7)' : 'blur(0px) brightness(1)'
                            }}
                        >
                            <Image
                                src={image.url || image.src}
                                alt={`Community gallery image ${index + 1}`}
                                fill
                                className="object-cover"
                                unoptimized
                                priority={index < 3}
                            />
                            
                            {/* Overlay Gradient */}
                            <motion.div 
                                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6 md:p-8 opacity-0"
                                animate={{ opacity: isHovered ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div 
                                    className="space-y-2 translate-y-4"
                                    animate={{ translateY: isHovered ? 0 : 20 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                >
                                    <div className="w-10 h-1 bg-indigo-500 rounded-full mb-4"></div>
                                    <h3 className="text-white font-heading font-bold text-xl md:text-3xl">Community Moment</h3>
                                    <p className="text-indigo-200 text-sm md:text-base font-medium">Capturing the spirit of HCSEM</p>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
