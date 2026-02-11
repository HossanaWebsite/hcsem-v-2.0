'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';

export default function SafeImage({ src, alt, fallbackSrc = '/event-placeholder.png', className, fill, width, height, ...props }) {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImgSrc(src);
        setHasError(false);
    }, [src]);

    if (!src || src.trim() === '') {
        return (
            <div className={`relative bg-muted/20 flex items-center justify-center overflow-hidden ${className}`} style={fill ? { width: '100%', height: '100%' } : { width, height }}>
                <ImageOff className="w-8 h-8 text-muted-foreground/50" />
            </div>
        );
    }

    return (
        <Image
            {...props}
            src={hasError ? fallbackSrc : imgSrc}
            alt={alt || 'Image'}
            className={className}
            fill={fill}
            width={!fill ? width : undefined}
            height={!fill ? height : undefined}
            onError={() => {
                if (!hasError) {
                    setHasError(true);
                    setImgSrc(fallbackSrc);
                }
            }}
        />
    );
}
