'use client';

import { useState } from 'react';
import { CalendarCheck, X } from 'lucide-react';

export default function RsvpButton({ eventId, rsvpCount = 0 }) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [count, setCount] = useState(rsvpCount);
    const [status, setStatus] = useState(null); // null | 'success' | 'error'
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        try {
            const res = await fetch('/api/events/rsvp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId, name, email }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setStatus('success');
                setMessage(data.message || 'RSVP confirmed!');
                setCount(data.rsvpCount);
                setName('');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to RSVP. Please try again.');
            }
        } catch {
            setStatus('error');
            setMessage('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold text-base hover:opacity-90 transition-all"
                >
                    <CalendarCheck className="w-5 h-5" />
                    RSVP to this Event
                    {count > 0 && (
                        <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                            {count} going
                        </span>
                    )}
                </button>
            ) : (
                <div className="border border-border rounded-2xl p-6 max-w-md space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">Reserve your spot</h3>
                        <button onClick={() => { setIsOpen(false); setStatus(null); }} className="text-muted-foreground hover:text-foreground">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {status === 'success' ? (
                        <div className="text-center py-4 space-y-2">
                            <div className="text-4xl">🎉</div>
                            <p className="text-green-600 dark:text-green-400 font-semibold">{message}</p>
                            <p className="text-sm text-muted-foreground">{count} people are going</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Your name"
                                    className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="your@email.com"
                                    className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                />
                            </div>
                            {status === 'error' && (
                                <p className="text-red-500 text-sm">{message}</p>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
                            >
                                {loading ? 'Submitting...' : 'Confirm RSVP'}
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
