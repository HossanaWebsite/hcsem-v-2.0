'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Lock, Check, AlertCircle } from 'lucide-react';

export default function ForcePasswordChangeModal({ user, onSuccess }) {
    const [isOpen, setIsOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkUserStatus = async () => {
            if (user) {
                if (user.mustChangePassword) setIsOpen(true);
                return;
            }

            try {
                const res = await fetch('/api/users?id=me');
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data.mustChangePassword) {
                        setIsOpen(true);
                    }
                }
            } catch (error) {
                console.error("Failed to check user status", error);
            }
        };

        checkUserStatus();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            // We reuse the basic PUT user endpoint, assuming the user updates 'self' or by ID
            // Ideally should have a specific 'change-password' endpoint, but 'PUT /api/users' works if permissions allow self-update
            // Since we might not have 'manage_users' permission as a basic user, we need to check if API allows self-update
            // The API currently checks 'manage_users'. We might need to adjust API to allow self-update.
            // Let's assume for now we use a special flag or ID='me' works if implemented, 
            // BUT api/users/route.js currently requires 'manage_users'. 
            // We need to fix API to allow self-password change.

            // Wait, looking at API code... PUT checks 'manage_users'. 
            // We need to create a dedicated route or update PUT to allow 'me' context updates or just ID match.
            // Let's use a new route `api/users/change-password` to be safe and clean.

            const res = await fetch('/api/users/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: newPassword }),
            });

            if (res.ok) {
                toast.success("Password changed successfully");
                setIsOpen(false);
                if (onSuccess) onSuccess();
                // Optionally reload to clear flag from local context if needed
                window.location.reload();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update password");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
                <div className="p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Change Password Required</h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            For your security, you must update your password before continuing.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Update Password <Check className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
