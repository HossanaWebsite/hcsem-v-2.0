'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Plus, Edit, Trash, Calendar } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';
import EventPreviewModal from '@/components/preview/EventPreviewModal';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEvent, setCurrentEvent] = useState({});
    const [showPreview, setShowPreview] = useState(false);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/events');
            const data = await res.json();
            if (data.success) setEvents(data.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEvents(); }, []);

    const handleDelete = async (id) => {
        if (!confirm('Delete this event?')) return;
        try {
            await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
            fetchEvents();
        } catch (error) { alert('Failed to delete'); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const method = currentEvent._id ? 'PUT' : 'POST';
        const body = { ...currentEvent, id: currentEvent._id };

        // Ensure gallery is an array if strings
        if (typeof currentEvent.gallery === 'string') {
            body.gallery = currentEvent.gallery.split(',').map(s => s.trim());
        }

        try {
            const res = await fetch('/api/events', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                setIsEditing(false);
                setCurrentEvent({});
                fetchEvents();
            } else {
                alert('Failed to save');
            }
        } catch (error) { alert('Error saving event'); }
    };

    if (isEditing) {
        return (
            <div className="max-w-4xl mx-auto glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{currentEvent._id ? 'Edit Event' : 'Create Event'}</h2>
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Title</label>
                            <input className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white" value={currentEvent.title || ''} onChange={e => setCurrentEvent({ ...currentEvent, title: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Slug</label>
                            <input className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white" value={currentEvent.slug || ''} onChange={e => setCurrentEvent({ ...currentEvent, slug: e.target.value })} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Date</label>
                            <input type="date" className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white" value={currentEvent.date ? new Date(currentEvent.date).toISOString().split('T')[0] : ''} onChange={e => setCurrentEvent({ ...currentEvent, date: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Location</label>
                            <input className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white" value={currentEvent.location || ''} onChange={e => setCurrentEvent({ ...currentEvent, location: e.target.value })} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Layout Option</label>
                        <select
                            className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                            value={currentEvent.layoutTemplate || 'standard'}
                            onChange={e => setCurrentEvent({ ...currentEvent, layoutTemplate: e.target.value })}
                        >
                            <option value="standard">Standard (Default)</option>
                            <option value="featured">Featured Event (Big Header)</option>
                            <option value="minimal">Minimal (Text Focused)</option>
                            <option value="gallery">Gallery View (Image Focused)</option>
                            <option value="carousel">Carousel Mode</option>
                            <option value="video-centric">Video Centric</option>
                            <option value="hero-overlay">Hero Overlay</option>
                            <option value="split-view">Split View</option>
                            <option value="timeline">Timeline Style</option>
                            <option value="magazine">Magazine Style</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Description</label>
                        <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-white/10">
                            <ReactQuill
                                theme="snow"
                                value={currentEvent.description || ''}
                                onChange={content => setCurrentEvent({ ...currentEvent, description: content })}
                                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                modules={{
                                    toolbar: [
                                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                        ['bold', 'italic', 'underline', 'strike'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                        [{ 'color': [] }, { 'background': [] }],
                                        [{ 'align': [] }],
                                        ['link', 'clean']
                                    ],
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Cover Image</label>
                        <input className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white" value={currentEvent.coverImage || ''} onChange={e => setCurrentEvent({ ...currentEvent, coverImage: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Gallery Images (comma separated URLs)</label>
                        <textarea className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white h-24" value={Array.isArray(currentEvent.gallery) ? currentEvent.gallery.join(', ') : currentEvent.gallery || ''} onChange={e => setCurrentEvent({ ...currentEvent, gallery: e.target.value })} />
                    </div>

                    <div className="flex gap-4 pt-4 justify-end">
                        <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">Cancel</button>
                        <button type="button" onClick={() => setShowPreview(true)} className="px-6 py-2.5 bg-slate-800 dark:bg-slate-700 text-white rounded-xl hover:bg-slate-700 dark:hover:bg-slate-600 shadow-lg shadow-slate-500/20 transition-all font-medium flex items-center gap-2">Preview</button>
                        <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all font-medium">Save Event</button>
                    </div>
                </form>
                <EventPreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)} event={currentEvent} />
            </div>
        );
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">Events Management</h2>
                <button onClick={() => { setCurrentEvent({ gallery: [] }); setIsEditing(true); }} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all font-medium"><Plus size={18} /> Create Event</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                    <div key={event._id} className="glass-panel border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 rounded-2xl shadow-sm overflow-hidden group">
                        <div className="relative h-48 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            {event.coverImage ? (
                                <Image src={event.coverImage} alt={event.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400'; }} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <Calendar className="w-12 h-12" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2 line-clamp-1">{event.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(event.date).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                                <button onClick={() => { setCurrentEvent(event); setIsEditing(true); }} className="flex-1 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all text-sm font-medium">Edit</button>
                                <button onClick={() => handleDelete(event._id)} className="flex-1 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all text-sm font-medium">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
