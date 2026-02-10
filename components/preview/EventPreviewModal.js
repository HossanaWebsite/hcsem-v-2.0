'use client';

import { X, Calendar, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

export default function EventPreviewModal({ isOpen, onClose, event }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
            <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden my-8 relative flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-xs bg-indigo-500 text-white">PREVIEW MODE</span>
                        {event.title || 'Untitled Event'}
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

                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        {/* Left: Image */}
                        <div className="space-y-4">
                            <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl bg-slate-100 dark:bg-slate-800">
                                {event.coverImage ? (
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={event.coverImage}
                                            alt={event.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <Calendar className="w-16 h-16 opacity-50" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: details */}
                        <div className="space-y-6">
                            <h1 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white leading-tight">
                                {event.title || 'Event Title'}
                            </h1>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">Date</div>
                                        <div className="font-semibold">{event.date ? new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Date not set'}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">Location</div>
                                        <div className="font-semibold">{event.location || 'Online / TBD'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Assuming we might have a button or action on public page */}
                            <button disabled className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold opacity-50 cursor-not-allowed">
                                Register Now (Disabled in Preview)
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 dark:border-white/10 pt-8">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">About this Event</h3>
                        <div
                            className="prose prose-lg dark:prose-invert max-w-none
                                prose-headings:font-heading prose-headings:font-bold
                                prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
                                prose-img:rounded-xl prose-img:shadow-lg"
                            dangerouslySetInnerHTML={{ __html: event.description || '<p>Event description...</p>' }}
                        />
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 flex justify-between items-center text-sm text-slate-500">
                    <p>This is how your event will look to visitors.</p>
                </div>
            </div>
        </div>
    );
}
