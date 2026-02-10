'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

// Mini gallery with fewer images for home page
const images = [
    { src: '/folder/2.jpg', span: 'row-span-2' },
    { src: '/folder/3.jpg', span: 'row-span-1' },
    { src: '/folder/9.jpg', span: 'row-span-1' },
    { src: '/folder/10.jpg', span: 'row-span-2' },
    { src: '/folder/13.jpg', span: 'row-span-1' },
    { src: '/folder/16.jpg', span: 'row-span-1' },
];

export default function MiniGallery({ images: propImages }) {
    const displayImages = (propImages && propImages.length > 0) ? propImages : images;
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[180px] gap-3">
            {displayImages.map((image, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    className={`relative rounded-xl overflow-hidden glass-card group cursor-pointer ${image.span}`}
                >
                    <Image
                        src={image.url || image.src || '/event-placeholder.png'}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
            ))}
        </div>
    );
}
