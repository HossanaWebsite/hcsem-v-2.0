'use client';

import { useState, useRef } from 'react';
import { Link2, Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

/**
 * A reusable image input that supports both:
 *  - Paste / type a URL
 *  - Upload a file to Cloudinary via /api/upload
 *
 * Props:
 *   value       {string}   current image URL (controlled)
 *   onChange    {fn}       called with new URL string
 *   label       {string}   field label
 *   className   {string}   wrapper className
 */
export default function ImageInput({ value, onChange, label = 'Cover Image', className = '' }) {
    const [tab, setTab] = useState('url'); // 'url' | 'upload'
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileRef = useRef(null);

    const inputClass =
        'w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm';

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const result = await res.json();

            // Handle both wrapped { success, data: { url } } and raw { url } responses
            const imageData = result.data || result;

            if (res.ok && (imageData.url || imageData.secure_url)) {
                onChange(imageData.url || imageData.secure_url);
            } else {
                setError(result.error || result.message || 'Upload failed. Please try again.');
            }
        } catch (error) {
            console.error('Upload component error:', error);
            setError('Network error. Please try again.');
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
            </label>

            {/* Tab toggle */}
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
                <button
                    type="button"
                    onClick={() => setTab('url')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        tab === 'url'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                >
                    <Link2 className="w-3.5 h-3.5" />
                    Paste URL
                </button>
                <button
                    type="button"
                    onClick={() => setTab('upload')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        tab === 'upload'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                >
                    <Upload className="w-3.5 h-3.5" />
                    Upload File
                </button>
            </div>

            {/* URL Input */}
            {tab === 'url' && (
                <div className="relative">
                    <input
                        type="url"
                        className={inputClass}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>
            )}

            {/* Upload Input */}
            {tab === 'upload' && (
                <div>
                    <label
                        className={`flex flex-col items-center justify-center gap-2 w-full h-28 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
                            uploading
                                ? 'border-indigo-300 bg-indigo-50 dark:bg-indigo-500/5 cursor-wait'
                                : 'border-slate-300 dark:border-white/10 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                    >
                        {uploading ? (
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                                <span className="text-xs text-slate-500">Uploading...</span>
                            </div>
                        ) : (
                            <>
                                <Upload className="w-6 h-6 text-slate-400" />
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    Click to choose a file (JPG, PNG, WebP, GIF)
                                </span>
                            </>
                        )}
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            disabled={uploading}
                            onChange={handleFileChange}
                        />
                    </label>
                    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                </div>
            )}

            {/* Preview */}
            {value && (
                <div className="relative w-full h-36 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 mt-2">
                    <Image
                        src={value}
                        alt="Preview"
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover"
                        onError={() => {}}
                    />
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                        title="Remove image"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            )}
        </div>
    );
}
