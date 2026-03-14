'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { ImageOff } from 'lucide-react';

// Detects if a src is a Cloudinary public ID or a full Cloudinary URL.
// CldImage can accept either a public_id like "hcsem_uploads/some-image"
// or a full https://res.cloudinary.com URL.
function isCloudinarySource(src) {
    if (!src || typeof src !== 'string') return false;
    return (
        src.includes('res.cloudinary.com') ||
        src.startsWith('hcsem_uploads/')
    );
}

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

    if (!src || src.trim() === '') {
        return (
            <div
                className={`relative bg-muted/20 flex items-center justify-center overflow-hidden ${className}`}
                style={fill ? { width: '100%', height: '100%' } : { width, height }}
            >
                <ImageOff className="w-8 h-8 text-muted-foreground/50" />
            </div>
        );
    }

    if (isCloudinarySource(src) && !hasError) {
        return (
            <CldImage
                src={src}
                alt={alt || 'Image'}
                className={className}
                fill={fill}
                width={!fill ? (width || 500) : undefined}
                height={!fill ? (height || 500) : undefined}
                crop={{
                    type: 'auto',
                    source: true,
                }}
                onError={() => setHasError(true)}
                {...props}
            />
        );
    }

    // Fallback for local /public images or if Cloudinary load fails
    return (
        <Image
            src={hasError ? fallbackSrc : src}
            alt={alt || 'Image'}
            className={className}
            fill={fill}
            width={!fill ? width : undefined}
            height={!fill ? height : undefined}
            onError={() => setHasError(true)}
            {...props}
        />
    );
}
