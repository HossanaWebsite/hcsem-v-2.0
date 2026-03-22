'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const getSpanPattern = (index) => {
    const pattern = ['row-span-2', 'row-span-1', 'row-span-3', 'row-span-1', 'row-span-2', 'row-span-1'];
    return pattern[index % pattern.length];
};

export default function LargeGallery({ images = [] }) {
    if (!images || images.length === 0) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-[220px] gap-4">
            {images.map((image, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: (index % 10) * 0.05 }}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    className={`relative rounded-2xl overflow-hidden glass-card group cursor-pointer ${image.span || getSpanPattern(index)}`}
                >
                    <Image
                        src={image.url || image.src}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <div className="text-white text-sm font-medium">Event Photo {index + 1}</div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
