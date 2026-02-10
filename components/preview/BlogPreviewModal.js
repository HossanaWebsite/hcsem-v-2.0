'use client';

import { X, Calendar, User, Clock } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

export default function BlogPreviewModal({ isOpen, onClose, blog }) {
    if (!isOpen) return null;

    // Helper to estimate read time
    const readTime = Math.max(1, Math.ceil((blog.content?.split(/\s+/).length || 0) / 200));

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
            <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden my-8 relative flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-xs bg-indigo-500 text-white">PREVIEW MODE</span>
                        {blog.title || 'Untitled Blog'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X size={20} className="text-slate-500 dark:text-slate-400" />
                    </button>
                </div>

                {/* Content Preview */}
                <div className="overflow-y-auto p-6 md:p-10 space-y-8">
                    {/* Hero Section */}
                    <div className="space-y-6 text-center max-w-3xl mx-auto">
                        <div className="flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date().toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><Clock size={14} /> {readTime} min read</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold font-heading text-slate-900 dark:text-white leading-tight">
                            {blog.title || 'Your Blog Title'}
                        </h1>
                        {blog.summary && (
                            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                                {blog.summary}
                            </p>
                        )}
                    </div>

                    {/* Cover Image */}
                    {blog.coverImage && (
                        <div className="relative rounded-2xl overflow-hidden aspect-video shadow-2xl">
                            <Image
                                src={blog.coverImage}
                                alt={blog.title}
                                fill
                                sizes="(max-width: 1536px) 100vw, 1536px"
                                className="object-cover"
                            />
                        </div>
                    )}

                    {/* Rich Text Content */}
                    <div
                        className="prose prose-lg dark:prose-invert max-w-3xl mx-auto
                            prose-headings:font-heading prose-headings:font-bold
                            prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
                            prose-img:rounded-xl prose-img:shadow-lg
                            prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-white/5 prose-blockquote:p-4 prose-blockquote:rounded-r-lg"
                        dangerouslySetInnerHTML={{ __html: blog.content || '<p>Start writing your content...</p>' }}
                    />
                </div>

                {/* Footer Controls (Layout Reset/Check placeholder) */}
                <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 flex justify-between items-center text-sm text-slate-500">
                    <p>This is how your post will look to visitors.</p>
                </div>
            </div>
        </div>
    );
}
