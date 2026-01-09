'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { toast } from 'react-toastify';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [userForm, setUserForm] = useState({});
    const [myPermissions, setMyPermissions] = useState([]);

    const [myRole, setMyRole] = useState(null);

    const fetchData = async () => {
        try {
            const [usersRes, rolesRes, meRes] = await Promise.all([
                fetch('/api/users'),
                fetch('/api/roles'),
                fetch('/api/users?id=me')
            ]);

            const usersData = await usersRes.json();
            const rolesData = await rolesRes.json();
            const meData = await meRes.json();

            if (usersData.success) setUsers(usersData.data);
            if (rolesData.success) setRoles(rolesData.data);
            if (meData.success) {
                const role = meData.data.role;
                setMyPermissions(role?.permissions || []);
                setMyRole(role?.name || '');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const canManageUsers = myPermissions.includes('manage_users') || (myRole && myRole.toLowerCase() === 'admin');

    const handleDelete = async (id) => {
        if (!confirm('Delete this user?')) return;
        try {
            const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('User deleted successfully');
                fetchData();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to delete user');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error deleting user');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const method = userForm._id ? 'PUT' : 'POST';
        // If role is an object (from population), send its ID. If it's a string (ID), send it as is.
        const roleId = userForm.role && typeof userForm.role === 'object' ? userForm.role._id : userForm.role;

        const body = {
            ...userForm,
            id: userForm._id,
            role: roleId || (roles.length > 0 ? roles[0]._id : undefined) // Default to first role if available
        };

        try {
            const res = await fetch('/api/users', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                setIsEditing(false);
                setUserForm({});
                toast.success(`User ${userForm._id ? 'updated' : 'created'} successfully`);
                fetchData();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to save user');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error saving user');
        }
    };

    if (isEditing) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="w-full max-w-xl glass-panel p-8 rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
                    <h2 className="text-2xl font-bold mb-6 text-white">{userForm._id ? 'Edit User' : 'Create User'}</h2>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                            <input
                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                                value={userForm.fullName || ''}
                                onChange={e => setUserForm({ ...userForm, fullName: e.target.value })}
                                required
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                            <input
                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                                type="email"
                                value={userForm.email || ''}
                                onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                                required
                                placeholder="john@example.com"
                            />
                        </div>
                        {!userForm._id && (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                                <input
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                                    type="password"
                                    value={userForm.password || ''}
                                    onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>
                        )}
                        <div className="flex items-center gap-3 bg-slate-950/30 p-4 rounded-xl border border-white/5">
                            <input
                                id="mustChangePassword"
                                type="checkbox"
                                className="w-5 h-5 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-slate-950/50"
                                checked={userForm.mustChangePassword || false}
                                onChange={e => setUserForm({ ...userForm, mustChangePassword: e.target.checked })}
                            />
                            <label htmlFor="mustChangePassword" className="text-sm font-medium text-slate-300 cursor-pointer select-none">
                                User must change password on next login
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                            <select
                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                                value={
                                    userForm.role && typeof userForm.role === 'object'
                                        ? userForm.role._id
                                        : userForm.role || ''
                                }
                                onChange={e => setUserForm({ ...userForm, role: e.target.value })}
                            >
                                <option value="" className="bg-slate-900 text-slate-400">Select a Role</option>
                                {roles.map(role => (
                                    <option key={role._id} value={role._id} className="bg-slate-900 text-white">
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-4 pt-4 justify-end">
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
                                Save User
                            </button>
                        </div>
                    </form>
                </div >
            </div >
        );
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">Users</h1>
                    <p className="text-slate-400">Manage system users and access roles</p>
                </div>
                {canManageUsers && (
                    <button
                        onClick={() => { setUserForm({}); setIsEditing(true); }}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all"
                    >
                        <Plus size={18} /> Add User
                    </button>
                )}
            </div>

            <div className="glass-panel rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 backdrop-blur-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400">
                            <tr>
                                <th className="px-6 py-4 text-xs uppercase font-semibold tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs uppercase font-semibold tracking-wider">Email</th>
                                <th className="px-6 py-4 text-xs uppercase font-semibold tracking-wider">Role</th>
                                {canManageUsers && <th className="px-6 py-4 text-xs uppercase font-semibold tracking-wider text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                            {users.map(user => (
                                <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{user.fullName}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10`}>
                                            {
                                                typeof user.role === 'object' && user.role !== null
                                                    ? user.role.name
                                                    : user.role || 'No Role'
                                            }
                                        </span>
                                    </td>
                                    {canManageUsers && (
                                        <td className="px-6 py-4 flex gap-3 justify-end">
                                            <button
                                                onClick={() => { setUserForm(user); setIsEditing(true); }}
                                                className="p-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all"
                                                title="Edit User"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2 text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                                                title="Delete User"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500 italic">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
