'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';

export default function SafeImage({
    src,
    alt,
    fallbackSrc = '/event-placeholder.png',
    className,
    fill,
    width,
    height,
    ...props
}) {
    const [hasError, setHasError] = useState(false);

    let finalSrc = src;
    if (typeof finalSrc === 'string') {
        finalSrc = finalSrc.replace(/\/next\/img(\/url)?/g, '/uploads');
    }

    if (!finalSrc || finalSrc.trim() === '') {
        return (
            <div
                className={`relative bg-muted/20 flex items-center justify-center overflow-hidden ${className}`}
                style={fill ? { width: '100%', height: '100%' } : { width, height }}
            >
                <ImageOff className="w-8 h-8 text-muted-foreground/50" />
            </div>
        );
    }

    return (
        <Image
            src={hasError ? fallbackSrc : finalSrc}
            alt={alt || 'Image'}
            className={className}
            fill={fill}
            width={!fill ? (width || 500) : undefined}
            height={!fill ? (height || 500) : undefined}
            onError={() => setHasError(true)}
            unoptimized={props.unoptimized || (typeof finalSrc === 'string' && finalSrc.startsWith('/uploads'))}
            {...props}
        />
    );
}
