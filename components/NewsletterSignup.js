'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

export default function NewsletterSignup() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null); // null | 'success' | 'error'
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setStatus('success');
                setMessage(data.message || 'Subscribed!');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to subscribe. Please try again.');
            }
        } catch {
            setStatus('error');
            setMessage('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {status === 'success' ? (
                <p className="text-center text-green-500 font-medium py-2">
                    ✓ {message}
                </p>
            ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <div className="flex-1 relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all whitespace-nowrap"
                    >
                        {loading ? '...' : 'Subscribe'}
                    </button>
                </form>
            )}
            {status === 'error' && (
                <p className="text-red-500 text-xs mt-1 text-center">{message}</p>
            )}
        </div>
    );
}
