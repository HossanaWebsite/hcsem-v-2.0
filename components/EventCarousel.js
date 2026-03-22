'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function EventCarousel({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return null;

    const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="relative w-full h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl group bg-slate-900">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={images[currentIndex]}
                        alt={`Gallery Item ${currentIndex + 1}`}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/20 to-transparent text-white">
                        <p className="text-sm font-medium opacity-60 uppercase tracking-widest mb-1">
                            Gallery {currentIndex + 1} of {images.length}
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all text-white border border-white/20 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label="Previous Image"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all text-white border border-white/20 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label="Next Image"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Progress Dots */}
                    <div className="absolute bottom-8 right-8 flex gap-2">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`h-1.5 transition-all rounded-full ${
                                    i === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-white/40'
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
