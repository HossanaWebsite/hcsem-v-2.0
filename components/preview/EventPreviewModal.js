'use client';

import { X, Calendar, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import EventCarousel from '@/components/EventCarousel';

export default function EventPreviewModal({ isOpen, onClose, event }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
            <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden my-8 relative flex flex-col max-h-[90vh]">
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
                <div className="overflow-y-auto p-6 md:p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start mb-12">
                        {/* Main Cover */}
                        <div className="lg:col-span-2 relative aspect-video rounded-2xl overflow-hidden shadow-lg bg-slate-100 dark:bg-slate-800">
                            {event.coverImage ? (
                                <Image
                                    src={event.coverImage}
                                    alt={event.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400">
                                    No Cover Image
                                </div>
                            )}
                        </div>

                        {/* Event Info Sidebar */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold font-heading text-slate-900 dark:text-white leading-tight">
                                {event.title || 'Event Title'}
                            </h2>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">Date</div>
                                        <div className="font-semibold">
                                            {event.date && !isNaN(new Date(event.date).getTime()) 
                                                ? new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) 
                                                : 'Date not set'}
                                        </div>
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

                            <button disabled className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold opacity-50 cursor-not-allowed">
                                Register Now (Disabled in Preview)
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 dark:border-white/10 pt-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">About this Event</h3>
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-500 uppercase tracking-wider border border-slate-200 dark:border-white/10">
                                Template: {event.layoutTemplate || 'standard'}
                            </span>
                        </div>

                        {event.layoutTemplate?.toLowerCase() === 'featured' ? (
                            <div className="space-y-8">
                                <div
                                    className="prose prose-2xl dark:prose-invert max-w-none text-center font-heading 
                                        prose-headings:font-heading prose-headings:font-bold
                                        prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline"
                                    dangerouslySetInnerHTML={{ __html: event.description || '<p>Event description...</p>' }}
                                />
                            </div>
                        ) : event.layoutTemplate?.toLowerCase() === 'minimal' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                                <div
                                    className="prose prose-lg dark:prose-invert 
                                        prose-headings:font-heading prose-headings:font-bold
                                        prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline"
                                    dangerouslySetInnerHTML={{ __html: event.description || '<p>Event description...</p>' }}
                                />
                                {event.gallery && event.gallery.length > 0 && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {event.gallery.slice(0, 4).map((img, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
                                                <Image src={img} alt="" fill className="object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : event.layoutTemplate?.toLowerCase() === 'gallery' ? (
                            <div className="space-y-8">
                                {event.gallery && event.gallery.length > 0 && (
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                        {event.gallery.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden shadow-md">
                                                <Image src={img} alt="" fill className="object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div
                                    className="prose prose-lg dark:prose-invert max-w-none pt-8 border-t border-slate-100 dark:border-white/5 
                                        prose-headings:font-heading prose-headings:font-bold"
                                    dangerouslySetInnerHTML={{ __html: event.description || '<p>Event description...</p>' }}
                                />
                            </div>
                        ) : event.layoutTemplate?.toLowerCase() === 'carousel' ? (
                            <div className="space-y-8">
                                <div className="prose prose-lg dark:prose-invert max-w-none " dangerouslySetInnerHTML={{ __html: event.description || '<p>Event description...</p>' }} />
                                {event.gallery && event.gallery.length > 0 && (
                                    <EventCarousel images={event.gallery} />
                                )}
                            </div>
                        ) : event.layoutTemplate?.toLowerCase() === 'video-centric' ? (
                            <div className="space-y-12">
                                <div
                                    className="prose prose-xl dark:prose-invert max-w-2xl mx-auto text-center 
                                        prose-headings:font-heading prose-headings:font-bold"
                                    dangerouslySetInnerHTML={{ __html: event.description || '<p>Event description...</p>' }}
                                />
                                {event.gallery && event.gallery.length > 0 && (
                                    <div className="aspect-video relative rounded-3xl overflow-hidden shadow-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                        <Image src={event.gallery[0]} alt="" fill className="object-cover opacity-60" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : event.layoutTemplate?.toLowerCase() === 'hero-overlay' ? (
                            <div className="relative -mt-12 pt-12">
                                <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
                                    <div className="prose prose-lg dark:prose-invert max-w-none font-heading " dangerouslySetInnerHTML={{ __html: event.description || '<p>Event description...</p>' }} />
                                </div>
                            </div>
                        ) : event.layoutTemplate?.toLowerCase() === 'split-view' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="prose prose-lg dark:prose-invert " dangerouslySetInnerHTML={{ __html: event.description || '<p>Event description...</p>' }} />
                                <div className="space-y-4">
                                    {event.gallery && event.gallery.slice(0, 2).map((img, idx) => (
                                        <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden shadow-md">
                                            <Image src={img} alt="" fill className="object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : event.layoutTemplate?.toLowerCase() === 'timeline' ? (
                            <div className="border-l-2 border-indigo-500/20 ml-2 pl-8 space-y-8">
                                <div className="prose prose-lg dark:prose-invert max-w-none " dangerouslySetInnerHTML={{ __html: event.description || '<p>Event description...</p>' }} />
                                {event.gallery && event.gallery.slice(0, 2).map((img, idx) => (
                                    <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden shadow-sm">
                                        <Image src={img} alt="" fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                        ) : event.layoutTemplate?.toLowerCase() === 'magazine' ? (
                            <div className="space-y-12">
                                <div className="md:columns-2 gap-8 prose prose-lg dark:prose-invert max-w-none " dangerouslySetInnerHTML={{ __html: event.description || '<p>Event description...</p>' }} />
                                {event.gallery && event.gallery.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="col-span-2 relative aspect-video rounded-2xl overflow-hidden shadow-md">
                                            <Image src={event.gallery[0]} alt="" fill className="object-cover" />
                                        </div>
                                        {event.gallery[1] && (
                                            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md">
                                                <Image src={event.gallery[1]} alt="" fill className="object-cover" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                className="prose prose-lg dark:prose-invert max-w-none 
                                    prose-headings:font-heading prose-headings:font-bold
                                    prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
                                    prose-img:rounded-xl prose-img:shadow-lg"
                                dangerouslySetInnerHTML={{ __html: event.description || '<p>Event description...</p>' }}
                            />
                        )}

                        {event.gallery && event.gallery.length > 0 && !['gallery', 'minimal', 'video-centric'].includes(event.layoutTemplate?.toLowerCase()) && (
                            <div className="mt-12 space-y-6">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Event Gallery</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {(event.gallery || []).slice(event.layoutTemplate?.toLowerCase() === 'minimal' ? 4 : 0).map((img, idx) => (
                                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden shadow-sm">
                                            <Image src={img} alt="" fill className="object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
