'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    Eye,
    Trash2,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    Mail,
    Phone,
    MapPin,
    X,
    CheckCircle,
    Send,
    Loader2,
    Archive,
    RotateCcw,
    Trash,
    AlertTriangle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

export default function RequestsPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Filters
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'reviewed', 'archived'
    const [viewMode, setViewMode] = useState('active'); // 'active', 'trash'

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState(null); // 'soft' or 'hard'

    // Email Reply State
    const [isReplying, setIsReplying] = useState(false);
    const [emailForm, setEmailForm] = useState({
        to: '',
        cc: '',
        subject: '',
        message: ''
    });
    const [sendingEmail, setSendingEmail] = useState(false);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                isDeleted: viewMode === 'trash',
                status: filterStatus
            });

            const res = await fetch(`/api/contact?${query.toString()}`);
            const data = await res.json();
            if (data.success) {
                setRequests(data.data);
            } else {
                toast.error('Failed to fetch requests');
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            toast.error('Error loading data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [filterStatus, viewMode]);

    // Filter and Search Logic
    const filteredRequests = requests.filter(request => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (request.firstName && request.firstName.toLowerCase().includes(searchLower)) ||
            (request.lastName && request.lastName.toLowerCase().includes(searchLower)) ||
            (request.email && request.email.toLowerCase().includes(searchLower)) ||
            (request.reason && request.reason.toLowerCase().includes(searchLower))
        );
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const confirmDelete = (id, e, type) => {
        e.stopPropagation();
        setItemToDelete(id);
        setDeleteType(type);
        setDeleteModalOpen(true);
    };

    const handleExecuteDelete = async () => {
        if (!itemToDelete) return;

        try {
            // force=true for 'hard' (permanent), false for 'soft' (trash)
            const force = deleteType === 'hard';
            const res = await fetch(`/api/contact?id=${itemToDelete}&force=${force}`, { method: 'DELETE' });

            if (res.ok) {
                toast.success(force ? 'Permanently deleted' : 'Moved to trash');
                setRequests(requests.filter(r => r._id !== itemToDelete));

                if (selectedRequest?._id === itemToDelete) {
                    setIsDetailOpen(false);
                    setSelectedRequest(null);
                }
            } else {
                toast.error('Failed to delete');
            }
        } catch (error) {
            toast.error('Error handling delete');
        } finally {
            setDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };

    const handleRestore = async (id, e) => {
        e.stopPropagation();
        try {
            const res = await fetch('/api/contact', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isDeleted: false })
            });

            if (res.ok) {
                toast.success('Restored from trash');
                setRequests(requests.filter(r => r._id !== id)); // Remove from trash view
                if (selectedRequest?._id === id) {
                    setIsDetailOpen(false);
                    setSelectedRequest(null);
                }
            } else {
                toast.error('Failed to restore');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error restoring');
        }
    }

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setEmailForm({
            to: request.email,
            cc: '',
            subject: `Re: ${request.reason}`,
            message: `Hi ${request.firstName},\n\n`
        });
        setIsReplying(false);
        setIsDetailOpen(true);
    };

    const handleStatusChange = async (newStatus) => {
        if (!selectedRequest) return;
        try {
            const res = await fetch('/api/contact', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedRequest._id, status: newStatus })
            });

            if (res.ok) {
                toast.success('Status updated');
                // Update local state
                const updatedReq = { ...selectedRequest, status: newStatus };
                setRequests(requests.map(r => r._id === selectedRequest._id ? updatedReq : r));
                setSelectedRequest(updatedReq);
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error updating status');
        }
    };

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setSendingEmail(true);
        try {
            const res = await fetch('/api/contact/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestId: selectedRequest._id,
                    ...emailForm
                })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success('Email sent successfully');
                setIsReplying(false);

                // Add the new reply to the local conversation history immediately
                const newReply = {
                    sender: 'Admin',
                    subject: emailForm.subject,
                    message: emailForm.message,
                    createdAt: new Date().toISOString()
                };

                const updatedReq = {
                    ...selectedRequest,
                    status: 'reviewed', // Auto-set to reviewed
                    replies: [...(selectedRequest.replies || []), newReply]
                };

                setRequests(requests.map(r => r._id === selectedRequest._id ? updatedReq : r));
                setSelectedRequest(updatedReq);

            } else {
                toast.error(data.error || 'Failed to send email');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error sending email');
        } finally {
            setSendingEmail(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'reviewed': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'archived': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-white flex items-center gap-3">
                        <MessageSquare className="text-indigo-500" />
                        Requests
                    </h1>
                    <p className="text-slate-400 mt-1">Manage incoming contact requests and inquiries</p>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-80">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-xl leading-5 bg-slate-900/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 sm:text-sm transition-all shadow-lg shadow-black/20"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to first page on search
                        }}
                    />
                </div>
            </div>

            {/* Toolbar: Filters & View Mode */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white/5 p-2 rounded-xl border border-white/5">
                <div className="flex p-1 bg-black/20 rounded-lg">
                    {['active', 'trash'].map(mode => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${viewMode === mode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            {mode === 'trash' ? 'Trash' : 'Active Requests'}
                        </button>
                    ))}
                </div>

                {viewMode === 'active' && (
                    <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 px-1 w-full sm:w-auto">
                        {['all', 'pending', 'reviewed', 'archived'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap capitalize border ${filterStatus === status ? getStatusColor(status).replace('text-', 'bg-opacity-20 ').replace('border-', 'border-opacity-50 ') + ' shadow-sm' : 'border-transparent text-slate-400 hover:bg-white/5'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="glass-panel rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl overflow-hidden shadow-2xl">
                {loading ? (
                    <div className="p-20 text-center flex justify-center">
                        <Loader2 className="animate-spin text-indigo-500 w-8 h-8" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white/5 border-b border-white/5 text-slate-400">
                                <tr>
                                    <th className="px-6 py-4 text-xs uppercase font-semibold tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-xs uppercase font-semibold tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-xs uppercase font-semibold tracking-wider">Reason</th>
                                    <th className="px-6 py-4 text-xs uppercase font-semibold tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs uppercase font-semibold tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs uppercase font-semibold tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-slate-300">
                                {currentItems.length > 0 ? (
                                    currentItems.map((request) => (
                                        <tr
                                            key={request._id}
                                            onClick={() => handleViewDetails(request)}
                                            className="hover:bg-white/5 transition-all cursor-pointer group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-white group-hover:text-indigo-400 transition-colors">
                                                    {request.firstName} {request.lastName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col text-sm">
                                                    <span className="text-slate-300">{request.email}</span>
                                                    <span className="text-slate-500 text-xs">{request.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="truncate max-w-[150px] block" title={request.reason}>
                                                    {request.reason}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-400">
                                                {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => handleViewDetails(request)}
                                                        className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 rounded-lg transition-all"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>

                                                    {viewMode === 'trash' ? (
                                                        <>
                                                            <button
                                                                onClick={(e) => handleRestore(request._id, e)}
                                                                className="p-2 text-green-500 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all"
                                                                title="Restore"
                                                            >
                                                                <RotateCcw size={18} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => confirmDelete(request._id, e, 'hard')}
                                                                className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                                title="Identify Delete"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => confirmDelete(request._id, e, 'soft')}
                                                            className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                            title="Move to Trash"
                                                        >
                                                            <Trash size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-16 text-center text-slate-500">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-600">
                                                    <Search size={24} />
                                                </div>
                                                <p className="text-lg font-medium">No requests found</p>
                                                <p className="text-sm">Try adjusting your filters or search.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                {filteredRequests.length > 0 && (
                    <div className="px-6 py-4 border-t border-white/5 bg-black/20 flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                            Showing <span className="font-medium text-white">{indexOfFirstItem + 1}</span> to <span className="font-medium text-white">{Math.min(indexOfLastItem, filteredRequests.length)}</span> of <span className="font-medium text-white">{filteredRequests.length}</span> results
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-slate-300"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            {Array.from({ length: totalPages }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => paginate(idx + 1)}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${currentPage === idx + 1
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                            : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-slate-300"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                        onClick={() => setDeleteModalOpen(false)}
                    />
                    <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-6 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                <AlertTriangle className="text-red-500 w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                {deleteType === 'hard' ? 'Delete Permanently?' : 'Move to Trash?'}
                            </h3>
                            <p className="text-slate-400 mb-6">
                                {deleteType === 'hard'
                                    ? 'This action cannot be undone. This request will be permanently removed from the database.'
                                    : 'This request will be moved to the trash. You can restore it later if needed.'
                                }
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleExecuteDelete}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium shadow-lg shadow-red-500/20 transition-all"
                                >
                                    {deleteType === 'hard' ? 'Delete Forever' : 'Move to Trash'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Request Detail Modal */}
            {isDetailOpen && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsDetailOpen(false)}
                    />
                    <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                            <div>
                                <h2 className="text-xl font-bold text-white">Request Details</h2>
                                <p className="text-sm text-slate-400">
                                    Submitted on {format(new Date(selectedRequest.createdAt), 'PPP p')}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsDetailOpen(false)}
                                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 md:p-8 overflow-y-auto space-y-6 custom-scrollbar text-sm md:text-base">

                            {/* Status and Action Bar (Only for active requests) */}
                            {viewMode === 'active' && (
                                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedRequest.status).includes('green') ? 'bg-green-500' : getStatusColor(selectedRequest.status).includes('yellow') ? 'bg-yellow-500' : 'bg-slate-500'}`} />
                                        <select
                                            value={selectedRequest.status}
                                            onChange={(e) => handleStatusChange(e.target.value)}
                                            className="bg-transparent text-white font-medium border-none focus:ring-0 cursor-pointer text-base p-0"
                                        >
                                            <option value="pending" className="bg-slate-900 text-yellow-500">Pending</option>
                                            <option value="reviewed" className="bg-slate-900 text-green-500">Reviewed</option>
                                            <option value="archived" className="bg-slate-900 text-slate-500">Archived</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => setIsReplying(!isReplying)}
                                        className={`w-full md:w-auto px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${isReplying ? 'bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/50' : 'bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400'}`}
                                    >
                                        <Mail size={16} />
                                        {isReplying ? 'Cancel Reply' : 'Reply to User'}
                                    </button>
                                </div>
                            )}

                            {/* Deleted Banner */}
                            {viewMode === 'trash' && (
                                <div className="flex flex-col items-center justify-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-medium">
                                    This request is in the trash. Restore it to reply or edit.
                                </div>
                            )}

                            {/* Email Reply Form */}
                            {isReplying && viewMode === 'active' && (
                                <div className="bg-slate-950 border border-indigo-500/30 rounded-xl p-5 shadow-lg shadow-black/20 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Send size={14} /> Compose Reply
                                    </h3>
                                    <form onSubmit={handleSendEmail} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-slate-500 mb-1 block">To</label>
                                                <input
                                                    type="email"
                                                    value={emailForm.to}
                                                    readOnly
                                                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-slate-300 focus:outline-none cursor-not-allowed"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500 mb-1 block">CC</label>
                                                <input
                                                    type="text"
                                                    value={emailForm.cc}
                                                    onChange={e => setEmailForm({ ...emailForm, cc: e.target.value })}
                                                    placeholder="optional"
                                                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-700"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 mb-1 block">Subject</label>
                                            <input
                                                type="text"
                                                value={emailForm.subject}
                                                onChange={e => setEmailForm({ ...emailForm, subject: e.target.value })}
                                                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white font-medium focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-700"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 mb-1 block">Message</label>
                                            <textarea
                                                rows="6"
                                                value={emailForm.message}
                                                onChange={e => setEmailForm({ ...emailForm, message: e.target.value })}
                                                className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-700 leading-relaxed"
                                                placeholder="Write your reply here..."
                                            ></textarea>
                                        </div>
                                        <div className="flex justify-end pt-2">
                                            <button
                                                type="submit"
                                                disabled={sendingEmail}
                                                className="px-6 py-2.5 rounded-xl font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                {sendingEmail ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                                {sendingEmail ? 'Sending...' : 'Send Email'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Conversation History */}
                            {selectedRequest.replies && selectedRequest.replies.length > 0 && (
                                <div className="space-y-4 pt-2">
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 border-b border-white/5 pb-2">Conversation History</h3>
                                    <div className="space-y-3">
                                        {selectedRequest.replies.map((reply, index) => (
                                            <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/5 ml-4 border-l-4 border-l-indigo-500">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="text-white font-medium">To: {selectedRequest.email}</span>
                                                        <div className="text-xs text-slate-400">Subject: {reply.subject}</div>
                                                    </div>
                                                    <span className="text-xs text-slate-500">{format(new Date(reply.createdAt), 'MMM dd, p')}</span>
                                                </div>
                                                <div className="text-slate-300 text-sm whitespace-pre-wrap">{reply.message}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Original Message */}
                            <div className="bg-slate-900/30 rounded-xl p-5 border border-white/5">
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Original Message</h3>
                                <div className="space-y-1 mb-4">
                                    <div className="flex items-center gap-2 text-white font-medium">
                                        {selectedRequest.firstName} {selectedRequest.lastName}
                                    </div>
                                    <div className="text-slate-400 text-xs">
                                        {format(new Date(selectedRequest.createdAt), 'PPP p')}
                                    </div>
                                </div>

                                <div className="space-y-1 mb-4">
                                    <label className="text-xs text-slate-500">Reason</label>
                                    <div className="text-white font-medium">{selectedRequest.reason}</div>
                                </div>
                                {selectedRequest.notes && (
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-500">Notes</label>
                                        <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">{selectedRequest.notes}</div>
                                    </div>
                                )}
                            </div>

                            {/* Contact Details (Bottom) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/5">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Contact Info</h3>
                                    <div className="text-sm">
                                        <div className="text-slate-300 flex items-center gap-2"><Mail size={14} className="text-indigo-400" /> {selectedRequest.email}</div>
                                        {selectedRequest.phone && <div className="text-slate-300 flex items-center gap-2 mt-2"><Phone size={14} className="text-indigo-400" /> {selectedRequest.phone}</div>}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Location</h3>
                                    <div className="text-sm text-slate-300 flex items-start gap-2">
                                        <MapPin size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                                        <span>
                                            {selectedRequest.address}, {selectedRequest.apartment && <>{selectedRequest.apartment}, </>}
                                            {selectedRequest.city}, {selectedRequest.state} {selectedRequest.zipCode}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
