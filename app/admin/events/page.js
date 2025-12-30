'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEvent, setCurrentEvent] = useState({});

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
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">{currentEvent._id ? 'Edit Event' : 'Create Event'}</h2>
                <form onSubmit={handleSave} className="space-y-4">
                    <div><label className="block text-sm mb-1">Title</label><input className="w-full border p-2 rounded" value={currentEvent.title || ''} onChange={e => setCurrentEvent({ ...currentEvent, title: e.target.value })} required /></div>
                    <div><label className="block text-sm mb-1">Slug</label><input className="w-full border p-2 rounded" value={currentEvent.slug || ''} onChange={e => setCurrentEvent({ ...currentEvent, slug: e.target.value })} required /></div>
                    <div><label className="block text-sm mb-1">Date</label><input type="date" className="w-full border p-2 rounded" value={currentEvent.date ? new Date(currentEvent.date).toISOString().split('T')[0] : ''} onChange={e => setCurrentEvent({ ...currentEvent, date: e.target.value })} required /></div>
                    <div><label className="block text-sm mb-1">Location</label><input className="w-full border p-2 rounded" value={currentEvent.location || ''} onChange={e => setCurrentEvent({ ...currentEvent, location: e.target.value })} /></div>
                    <div><label className="block text-sm mb-1">Cover Image</label><input className="w-full border p-2 rounded" value={currentEvent.coverImage || ''} onChange={e => setCurrentEvent({ ...currentEvent, coverImage: e.target.value })} /></div>
                    <div><label className="block text-sm mb-1">Gallery Images (comma separated URLs)</label><textarea className="w-full border p-2 rounded" value={Array.isArray(currentEvent.gallery) ? currentEvent.gallery.join(', ') : currentEvent.gallery || ''} onChange={e => setCurrentEvent({ ...currentEvent, gallery: e.target.value })} /></div>
                    <div className="flex gap-4 pt-4"><button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded">Cancel</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button></div>
                </form>
            </div>
        );
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Events Management</h2>
                <button onClick={() => { setCurrentEvent({ gallery: [] }); setIsEditing(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"><Plus size={18} /> Create Event</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                    <div key={event._id} className="bg-white rounded-lg shadow overflow-hidden group">
                        <div className="h-40 bg-gray-200 relative">
                            {event.coverImage && <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://placehold.co/600x400'} />}
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg">{event.title}</h3>
                            <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()} - {event.location}</p>
                            <div className="mt-4 flex gap-2">
                                <button onClick={() => { setCurrentEvent(event); setIsEditing(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18} /></button>
                                <button onClick={() => handleDelete(event._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash size={18} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
