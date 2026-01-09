'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Shield, Check } from 'lucide-react';
import { toast } from 'react-toastify';

const AVAILABLE_PERMISSIONS = [
    { id: 'manage_users', label: 'Manage Users' },
    { id: 'manage_roles', label: 'Manage Roles' },
    { id: 'manage_content', label: 'Manage Content' },
    { id: 'manage_settings', label: 'Manage Settings' },
    { id: 'view_audit_log', label: 'View Audit Log' },
];

export default function RolesPage() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRole, setCurrentRole] = useState({ permissions: [] });

    const fetchRoles = async () => {
        try {
            const res = await fetch('/api/roles');
            const data = await res.json();
            if (data.success) setRoles(data.data);
        } catch (error) {
            console.error('Failed to fetch roles:', error);
            toast.error('Failed to load roles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRoles(); }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this role?')) return;
        try {
            const res = await fetch(`/api/roles?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Role deleted successfully');
                fetchRoles();
            } else {
                toast.error('Failed to delete role');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error deleting role');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const method = currentRole._id ? 'PUT' : 'POST';
        const body = { ...currentRole, id: currentRole._id };

        try {
            const res = await fetch('/api/roles', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                toast.success(`Role ${currentRole._id ? 'updated' : 'created'} successfully`);
                setIsEditing(false);
                setCurrentRole({ permissions: [] });
                fetchRoles();
            } else {
                toast.error('Failed to save role');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error saving role');
        }
    };

    const togglePermission = (permissionId) => {
        const currentPermissions = currentRole.permissions || [];
        if (currentPermissions.includes(permissionId)) {
            setCurrentRole({
                ...currentRole,
                permissions: currentPermissions.filter(p => p !== permissionId)
            });
        } else {
            setCurrentRole({
                ...currentRole,
                permissions: [...currentPermissions, permissionId]
            });
        }
    };

    if (isEditing) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="w-full max-w-2xl glass-panel p-8 rounded-2xl border border-white/10 bg-slate-900 shadow-2xl max-h-[90vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-6 text-white">{currentRole._id ? 'Edit Role' : 'Create Role'}</h2>
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Role Name</label>
                                <input
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                                    value={currentRole.name || ''}
                                    onChange={e => setCurrentRole({ ...currentRole, name: e.target.value })}
                                    required
                                    placeholder="e.g. Content Editor"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                                <textarea
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all resize-none h-24"
                                    value={currentRole.description || ''}
                                    onChange={e => setCurrentRole({ ...currentRole, description: e.target.value })}
                                    placeholder="Brief description of what this role can do..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">Permissions</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {AVAILABLE_PERMISSIONS.map(permission => (
                                        <div
                                            key={permission.id}
                                            onClick={() => togglePermission(permission.id)}
                                            className={`
                                                flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                                                ${(currentRole.permissions || []).includes(permission.id)
                                                    ? 'bg-indigo-600/20 border-indigo-500/50'
                                                    : 'bg-slate-950/30 border-white/5 hover:border-white/10'}
                                            `}
                                        >
                                            <div className={`
                                                w-5 h-5 rounded flex items-center justify-center border transition-all
                                                ${(currentRole.permissions || []).includes(permission.id)
                                                    ? 'bg-indigo-500 border-indigo-500 text-white'
                                                    : 'border-slate-500 text-transparent'}
                                            `}>
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <span className={(currentRole.permissions || []).includes(permission.id) ? 'text-white' : 'text-slate-400'}>
                                                {permission.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 justify-end border-t border-white/5 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 rounded-xl font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all"
                            >
                                Save Role
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
    );

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-white">Roles & Permissions</h1>
                    <p className="text-slate-400">Define access levels for system administrators</p>
                </div>
                <button
                    onClick={() => { setCurrentRole({ permissions: [] }); setIsEditing(true); }}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all"
                >
                    <Plus size={18} /> Create Role
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map(role => (
                    <div key={role._id} className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl group hover:border-white/10 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                                <Shield size={24} />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => { setCurrentRole(role); setIsEditing(true); }}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(role._id)}
                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{role.name}</h3>
                        <p className="text-slate-400 text-sm mb-6 line-clamp-2 h-10">{role.description || 'No description provided'}</p>

                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Permissions</h4>
                            <div className="flex flex-wrap gap-2">
                                {(role.permissions || []).slice(0, 3).map((perm, i) => (
                                    <span key={i} className="text-xs px-2 py-1 rounded bg-white/5 text-slate-300 border border-white/5">
                                        {AVAILABLE_PERMISSIONS.find(p => p.id === perm)?.label || perm}
                                    </span>
                                ))}
                                {(role.permissions || []).length > 3 && (
                                    <span className="text-xs px-2 py-1 rounded bg-white/5 text-slate-400 border border-white/5">
                                        +{(role.permissions || []).length - 3} more
                                    </span>
                                )}
                                {(role.permissions || []).length === 0 && (
                                    <span className="text-xs text-slate-500 italic">No permissions assigned</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={() => { setCurrentRole({ permissions: [] }); setIsEditing(true); }}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-white/5 hover:border-white/10 hover:bg-white/5 transition-all text-slate-500 hover:text-slate-300 gap-4 group min-h-[300px]"
                >
                    <div className="p-4 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                        <Plus size={32} />
                    </div>
                    <span className="font-medium">Create New Role</span>
                </button>
            </div>
        </div>
    );
}
