'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Users, Mail, ToggleLeft, ToggleRight, Trash2, Search, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminNewsletterPage() {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // all | active | inactive

    const fetchSubscribers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/subscribe');
            const data = await res.json();
            if (data.success) setSubscribers(data.data || []);
        } catch {
            toast.error('Failed to load subscribers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSubscribers(); }, []);

    const toggleActive = async (id, currentState) => {
        try {
            const res = await fetch('/api/subscribe', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, active: !currentState }),
            });
            if (res.ok) {
                setSubscribers(prev => prev.map(s => s._id === id ? { ...s, active: !currentState } : s));
                toast.success(`Subscriber ${!currentState ? 'activated' : 'deactivated'}`);
            }
        } catch {
            toast.error('Failed to update subscriber');
        }
    };

    const deleteSubscriber = async (id) => {
        try {
            const res = await fetch(`/api/subscribe?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setSubscribers(prev => prev.filter(s => s._id !== id));
                toast.success('Subscriber removed');
            }
        } catch {
            toast.error('Failed to delete subscriber');
        }
    };

    const exportCSV = () => {
        const active = subscribers.filter(s => s.active);
        const csv = ['Email,Subscribed At', ...active.map(s => `${s.email},${new Date(s.subscribedAt).toLocaleDateString()}`)].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'subscribers.csv'; a.click();
        URL.revokeObjectURL(url);
        toast.success(`Exported ${active.length} active subscribers`);
    };

    const filtered = subscribers.filter(s => {
        const matchSearch = s.email.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'all' || (filter === 'active' ? s.active : !s.active);
        return matchSearch && matchFilter;
    });

    const activeCount = subscribers.filter(s => s.active).length;

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">Newsletter</h1>
                    <p className="text-slate-400 mt-1">Manage your community subscribers</p>
                </div>
                <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-lg shadow-emerald-500/20 transition-all"
                >
                    <Download size={16} /> Export CSV
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Subscribers', value: subscribers.length, icon: Users, color: 'text-blue-400' },
                    { label: 'Active', value: activeCount, icon: Mail, color: 'text-emerald-400' },
                    { label: 'Inactive', value: subscribers.length - activeCount, icon: ToggleLeft, color: 'text-amber-400' },
                ].map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="glass-panel rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 p-5"
                    >
                        <div className={`${s.color} mb-2`}><s.icon size={20} /></div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search emails..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                </div>
                <select
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* Table */}
            <div className="glass-panel rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center">
                        <Mail className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                        <p className="text-slate-500">No subscribers found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Subscribed</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-sm">
                            {filtered.map(subscriber => (
                                <tr key={subscriber._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{subscriber.email}</td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {new Date(subscriber.subscribedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                            subscriber.active
                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                        }`}>
                                            {subscriber.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => toggleActive(subscriber._id, subscriber.active)}
                                                className={`p-2 rounded-lg transition-all ${subscriber.active ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10' : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'}`}
                                                title={subscriber.active ? 'Deactivate' : 'Activate'}
                                            >
                                                {subscriber.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                            </button>
                                            <button
                                                onClick={() => deleteSubscriber(subscriber._id)}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                )}
            </div>
        </div>
    );
}
