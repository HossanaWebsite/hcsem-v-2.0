'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Password reset successfully! Redirecting to login...');
                setTimeout(() => {
                    router.push('/admin');
                }, 2000);
            } else {
                toast.error(data.error || 'Failed to reset password');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error resetting password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
            <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10 bg-slate-900/50 shadow-2xl backdrop-blur-xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                        <Lock className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
                    <p className="text-slate-400">Enter your new password below</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Reset Token</label>
                        <input
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                            placeholder="Enter reset token"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-3 rounded-xl font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/admin" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
