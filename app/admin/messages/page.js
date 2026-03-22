'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Mail, Inbox, CheckCircle, Archive, Trash2, Clock, Eye, Send, Search, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '@/components/admin/ConfirmModal';

const STATUS_COLORS = {
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    reviewed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    archived: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
};

const STATUS_ICONS = { pending: Clock, reviewed: CheckCircle, archived: Archive };

function timeAgo(date) {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [confirm, setConfirm] = useState({ isOpen: false, id: null, force: false });

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/contact');
            const data = await res.json();
            if (data.success) setMessages(data.data || []);
        } catch { toast.error('Failed to load messages'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchMessages(); }, []);

    const markRead = async (id) => {
        await fetch('/api/contact', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, read: true }),
        });
        setMessages(prev => prev.map(m => m._id === id ? { ...m, read: true } : m));
    };

    const updateStatus = async (id, status) => {
        await fetch('/api/contact', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status }),
        });
        setMessages(prev => prev.map(m => m._id === id ? { ...m, status } : m));
        toast.success(`Status updated to ${status}`);
    };

    const toggleExpand = (id) => {
        setExpanded(e => e === id ? null : id);
        const msg = messages.find(m => m._id === id);
        if (msg && !msg.read) markRead(id);
        setReplyText('');
    };

    const sendReply = async (msg) => {
        if (!replyText.trim()) return;
        setSending(true);
        try {
            const res = await fetch('/api/contact/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: msg._id, message: replyText, to: msg.email }),
            });
            if (res.ok) {
                toast.success('Reply sent!');
                setReplyText('');
                fetchMessages();
            } else {
                toast.error('Failed to send reply');
            }
        } catch { toast.error('Network error'); }
        finally { setSending(false); }
    };

    const handleDelete = (id, force = false) => setConfirm({ isOpen: true, id, force });

    const executeDelete = async () => {
        const { id, force } = confirm;
        setConfirm({ isOpen: false, id: null, force: false });
        const res = await fetch(`/api/contact?id=${id}&force=${force}`, { method: 'DELETE' });
        if (res.ok) {
            setMessages(prev => prev.filter(m => m._id !== id));
            toast.success(force ? 'Permanently deleted' : 'Moved to trash');
        }
    };

    const filtered = messages.filter(m => {
        const q = search.toLowerCase();
        const matchSearch = !search ||
            m.firstName?.toLowerCase().includes(q) ||
            m.lastName?.toLowerCase().includes(q) ||
            m.email?.toLowerCase().includes(q) ||
            m.reason?.toLowerCase().includes(q);
        const matchStatus = statusFilter === 'all' || m.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const unread = messages.filter(m => !m.read).length;

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-3">
                        Messages
                        {unread > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white animate-pulse">
                                {unread} new
                            </span>
                        )}
                    </h1>
                    <p className="text-slate-400 mt-1">Community contact requests</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, reason..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="archived">Archived</option>
                </select>
            </div>

            {/* Messages */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                    <Inbox className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                    <p className="text-slate-500">No messages found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(msg => {
                        const isOpen = expanded === msg._id;
                        const StatusIcon = STATUS_ICONS[msg.status] || Clock;
                        return (
                            <motion.div key={msg._id} layout className={`glass-panel rounded-2xl border transition-all ${msg.read ? 'border-slate-200 dark:border-white/5' : 'border-indigo-500/30 shadow-indigo-500/5 shadow-lg'} bg-white dark:bg-slate-900/50 overflow-hidden`}>
                                {/* Row */}
                                <button
                                    onClick={() => toggleExpand(msg._id)}
                                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                >
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${msg.read ? 'bg-slate-300 dark:bg-slate-600' : 'bg-indigo-500 animate-pulse'}`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-semibold text-slate-900 dark:text-white text-sm">
                                                {msg.firstName} {msg.lastName}
                                            </span>
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[msg.status]}`}>
                                                <StatusIcon size={10} />
                                                {msg.status}
                                            </span>
                                            {msg.replies?.length > 0 && (
                                                <span className="text-xs text-indigo-400 font-medium">{msg.replies.length} repl{msg.replies.length === 1 ? 'y' : 'ies'}</span>
                                            )}
                                        </div>
                                        <p className="text-slate-500 text-xs truncate">{msg.reason} · {msg.email}</p>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <span className="text-xs text-slate-400">{timeAgo(msg.createdAt)}</span>
                                        {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                                    </div>
                                </button>

                                {/* Expanded Detail */}
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 space-y-5 border-t border-slate-100 dark:border-white/5 pt-5">
                                                {/* Details Grid */}
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                    {[
                                                        { label: 'Reason', value: msg.reason },
                                                        { label: 'Email', value: msg.email },
                                                        { label: 'Phone', value: msg.phone },
                                                        { label: 'City', value: msg.city },
                                                        { label: 'State', value: msg.state },
                                                        { label: 'Zip', value: msg.zipCode },
                                                    ].map(({ label, value }) => value ? (
                                                        <div key={label}>
                                                            <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
                                                            <p className="text-sm text-slate-900 dark:text-white">{value}</p>
                                                        </div>
                                                    ) : null)}
                                                </div>
                                                {msg.notes && (
                                                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4">
                                                        <p className="text-xs text-slate-400 font-medium mb-1">Notes</p>
                                                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{msg.notes}</p>
                                                    </div>
                                                )}

                                                {/* Previous Replies */}
                                                {msg.replies?.length > 0 && (
                                                    <div className="space-y-2">
                                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Previous Replies</p>
                                                        {msg.replies.map((r, i) => (
                                                            <div key={i} className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-xl p-3">
                                                                <p className="text-sm text-slate-700 dark:text-slate-200">{r.message}</p>
                                                                <p className="text-xs text-slate-400 mt-1">{new Date(r.createdAt).toLocaleString()}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Reply Box */}
                                                {msg.email && (
                                                    <div className="space-y-2">
                                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reply to {msg.email}</p>
                                                        <textarea
                                                            value={replyText}
                                                            onChange={e => setReplyText(e.target.value)}
                                                            placeholder="Type your reply..."
                                                            rows={3}
                                                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                                        />
                                                        <div className="flex items-center justify-between gap-3">
                                                            <div className="flex gap-2">
                                                                {['pending', 'reviewed', 'archived'].map(s => (
                                                                    <button
                                                                        key={s}
                                                                        onClick={() => updateStatus(msg._id, s)}
                                                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${msg.status === s ? STATUS_COLORS[s] : 'border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300'}`}
                                                                    >
                                                                        {s}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleDelete(msg._id)}
                                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                                                                    title="Move to trash"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => sendReply(msg)}
                                                                    disabled={sending || !replyText.trim()}
                                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-50 transition-all"
                                                                >
                                                                    <Send size={14} />
                                                                    {sending ? 'Sending...' : 'Send Reply'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            <ConfirmModal
                isOpen={confirm.isOpen}
                onClose={() => setConfirm({ isOpen: false, id: null, force: false })}
                onConfirm={executeDelete}
                title="Delete Message"
                message="Move this message to trash? You can restore it later."
                confirmText="Delete"
                isDanger={true}
            />
        </div>
    );
}
