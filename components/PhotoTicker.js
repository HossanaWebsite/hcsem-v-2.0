'use client';

import React from 'react';

const PhotoTicker = ({ images }) => {
    if (!images || images.length === 0) return null;

    return (
        <div className="w-full overflow-hidden bg-background/50 backdrop-blur-sm py-8 border-y border-white/5">
            <div className="flex gap-8 items-center animate-scroll whitespace-nowrap">
                {/* Triplicate for smooth infinite scroll */}
                {[...images, ...images, ...images].map((img, i) => (
                    <div key={i} className="relative w-64 h-40 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 mx-2 glass-card group cursor-pointer">
                        <img
                            src={img.url}
                            alt={img.title || "Gallery Image"}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {(img.title || img.subtitle) && (
                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {img.title && <p className="text-white font-bold text-sm whitespace-normal leading-tight">{img.title}</p>}
                                {img.subtitle && <p className="text-white/70 text-xs whitespace-normal mt-0.5 leading-tight">{img.subtitle}</p>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <style jsx>{`
                .animate-scroll {
                    animation: scroll 40s linear infinite;
                }
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default PhotoTicker;
