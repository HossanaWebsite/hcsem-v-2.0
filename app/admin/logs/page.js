'use client';

import React, { useState, useEffect } from 'react';
import { 
    Activity, Shield, Trash, Edit, LogIn, LogOut, Key, 
    Users, PlusCircle, RefreshCw, ChevronDown, ChevronUp,
    Clock, Monitor, User, AlertTriangle, Search, X
} from 'lucide-react';

// Map action types to colours and icons
const ACTION_CONFIG = {
    LOGIN: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', icon: LogIn, label: 'Login' },
    LOGOUT: { color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20', icon: LogOut, label: 'Logout' },
    CREATE_EVENT: { color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20', icon: PlusCircle, label: 'Create Event' },
    UPDATE_EVENT: { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', icon: Edit, label: 'Edit Event' },
    DELETE_EVENT: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: Trash, label: 'Delete Event' },
    CREATE_BLOG: { color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', icon: PlusCircle, label: 'Create Blog' },
    UPDATE_BLOG: { color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20', icon: Edit, label: 'Edit Blog' },
    DELETE_BLOG: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: Trash, label: 'Delete Blog' },
    CREATE_USER: { color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', icon: Users, label: 'Create User' },
    UPDATE_USER: { color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20', icon: Edit, label: 'Edit User' },
    DELETE_USER: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: Trash, label: 'Delete User' },
    UNLOCK_ACCOUNT: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', icon: Shield, label: 'Unlock Account' },
    INITIATE_PASSWORD_RESET: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: Key, label: 'Password Reset' },
    RESET_FAILED_ATTEMPTS: { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', icon: RefreshCw, label: 'Reset Attempts' },
};

const DEFAULT_CONFIG = { color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20', icon: Activity, label: null };

function getConfig(action) {
    return ACTION_CONFIG[action] || DEFAULT_CONFIG;
}

function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

function DetailValue({ value }) {
    if (value === null || value === undefined) return <span className="text-slate-500 italic">null</span>;
    if (typeof value === 'boolean') return <span className={value ? 'text-green-400' : 'text-red-400'}>{String(value)}</span>;
    if (typeof value === 'object') return (
        <pre className="text-xs text-slate-300 bg-slate-950/50 rounded-lg p-3 overflow-auto max-h-48 whitespace-pre-wrap break-all">
            {JSON.stringify(value, null, 2)}
        </pre>
    );
    return <span className="text-white break-all">{String(value)}</span>;
}

function LogDetailPanel({ log, onClose }) {
    const config = getConfig(log.action);
    const Icon = config.icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl max-h-[90vh] flex flex-col glass-panel rounded-2xl border border-white/10 bg-slate-900 shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl border ${config.bg}`}>
                            <Icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{config.label || log.action}</h2>
                            <p className="text-sm text-slate-400">{new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 overflow-y-auto">
                    {/* Meta row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">
                                <User size={12} /> Performed By
                            </div>
                            <p className="text-white font-medium">{log.userId?.fullName || 'System / Guest'}</p>
                            {log.userId?.email && <p className="text-slate-400 text-sm mt-1">{log.userId.email}</p>}
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">
                                <Monitor size={12} /> IP Address
                            </div>
                            <p className="text-white font-mono">{log.ipAddress || '—'}</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">
                                <Clock size={12} /> Timestamp
                            </div>
                            <p className="text-white">{new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">
                                <Activity size={12} /> Action Code
                            </div>
                            <p className={`font-mono text-sm font-medium ${config.color}`}>{log.action}</p>
                        </div>
                    </div>

                    {/* Details */}
                    {log.details && Object.keys(log.details).length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Action Details</h3>
                            <div className="space-y-3">
                                {Object.entries(log.details).map(([key, val]) => (
                                    <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-2 p-3 bg-slate-800/50 rounded-xl border border-white/5">
                                        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider w-36 flex-shrink-0 mt-0.5">{key}</span>
                                        <DetailValue value={val} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function LogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState(null);
    const [search, setSearch] = useState('');
    const [actionFilter, setActionFilter] = useState('ALL');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 50;

    const fetchLogs = async (pg = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/logs?page=${pg}&limit=${LIMIT}`);
            const data = await res.json();
            if (data.success) {
                // API now returns { logs, page, total, totalPages }
                const items = data.data?.logs ?? data.data ?? [];
                setLogs(items);
                setTotalPages(data.data?.totalPages ?? 1);
                setPage(pg);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLogs(1); }, []);

    const uniqueActions = ['ALL', ...new Set(logs.map(l => l.action))];

    const filtered = logs.filter(log => {
        const matchesSearch = !search ||
            log.action.toLowerCase().includes(search.toLowerCase()) ||
            (log.userId?.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
            (log.ipAddress || '').includes(search);
        const matchesFilter = actionFilter === 'ALL' || log.action === actionFilter;
        return matchesSearch && matchesFilter;
    });

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">Audit Logs</h1>
                    <p className="text-slate-400">Track all admin actions and system events</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 rounded-xl px-4 py-2.5 border border-white/5">
                    <Activity size={14} />
                    <span>{filtered.length} of {logs.length} events</span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by action, user, or IP..."
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                </div>
                <select
                    value={actionFilter}
                    onChange={e => setActionFilter(e.target.value)}
                    className="bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none min-w-[180px]"
                >
                    {uniqueActions.map(a => (
                        <option key={a} value={a} className="bg-slate-900">
                            {a === 'ALL' ? 'All Actions' : (getConfig(a).label || a)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Log List */}
            <div className="glass-panel rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <AlertTriangle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                        <p className="text-slate-400">No logs match your search.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {filtered.map(log => {
                            const config = getConfig(log.action);
                            const Icon = config.icon;
                            return (
                                <button
                                    key={log._id}
                                    onClick={() => setSelectedLog(log)}
                                    className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors text-left group"
                                >
                                    {/* Icon */}
                                    <div className={`p-2.5 rounded-xl border flex-shrink-0 ${config.bg}`}>
                                        <Icon className={`w-4 h-4 ${config.color}`} />
                                    </div>

                                    {/* Action + User */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm font-semibold text-white">
                                                {config.label || log.action}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border font-mono ${config.bg} ${config.color}`}>
                                                {log.action}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {log.userId?.fullName || 'System / Guest'}
                                            {log.ipAddress && ` · ${log.ipAddress}`}
                                        </p>
                                    </div>

                                    {/* Time */}
                                    <div className="flex flex-col items-end flex-shrink-0">
                                        <span className="text-xs text-slate-400">{timeAgo(log.timestamp)}</span>
                                        <span className="text-xs text-slate-500 mt-0.5 hidden sm:block">
                                            {new Date(log.timestamp).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* Chevron */}
                                    <ChevronDown size={16} className="text-slate-500 group-hover:text-white transition-colors flex-shrink-0" />
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                        disabled={page <= 1}
                        onClick={() => fetchLogs(page - 1)}
                        className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800/50 border border-white/10 text-white disabled:opacity-40 hover:bg-slate-700/50 transition-all"
                    >
                        ← Previous
                    </button>
                    <span className="text-sm text-slate-400">Page {page} of {totalPages}</span>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => fetchLogs(page + 1)}
                        className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800/50 border border-white/10 text-white disabled:opacity-40 hover:bg-slate-700/50 transition-all"
                    >
                        Next →
                    </button>
                </div>
            )}

            {/* Detail Modal */}
            {selectedLog && (
                <LogDetailPanel log={selectedLog} onClose={() => setSelectedLog(null)} />
            )}
        </div>
    );
}
