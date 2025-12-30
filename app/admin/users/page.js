'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState({});

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            if (data.success) setUsers(data.data);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleDelete = async (id) => {
        if (!confirm('Delete this user?')) return;
        await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
        fetchUsers();
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const method = currentUser._id ? 'PUT' : 'POST';
        const body = { ...currentUser, id: currentUser._id };

        try {
            const res = await fetch('/api/users', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                setIsEditing(false);
                setCurrentUser({});
                fetchUsers();
            } else { alert('Failed'); }
        } catch { }
    };

    if (isEditing) {
        return (
            <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">{currentUser._id ? 'Edit User' : 'Create User'}</h2>
                <form onSubmit={handleSave} className="space-y-4">
                    <div><label className="block text-sm mb-1">Full Name</label><input className="w-full border p-2 rounded" value={currentUser.fullName || ''} onChange={e => setCurrentUser({ ...currentUser, fullName: e.target.value })} required /></div>
                    <div><label className="block text-sm mb-1">Email</label><input className="w-full border p-2 rounded" type="email" value={currentUser.email || ''} onChange={e => setCurrentUser({ ...currentUser, email: e.target.value })} required /></div>
                    {!currentUser._id && (
                        <div><label className="block text-sm mb-1">Password</label><input className="w-full border p-2 rounded" type="password" value={currentUser.password || ''} onChange={e => setCurrentUser({ ...currentUser, password: e.target.value })} required /></div>
                    )}
                    <div><label className="block text-sm mb-1">Role</label>
                        <select className="w-full border p-2 rounded" value={currentUser.role || 'user'} onChange={e => setCurrentUser({ ...currentUser, role: e.target.value })}>
                            <option value="user">User</option>
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex gap-4 pt-4"><button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded">Cancel</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button></div>
                </form>
            </div>
        );
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Users</h2>
                <button onClick={() => { setCurrentUser({}); setIsEditing(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"><Plus size={18} /> Add User</button>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-xs uppercase">Name</th><th className="px-6 py-3 text-xs uppercase">Email</th><th className="px-6 py-3 text-xs uppercase">Role</th><th className="px-6 py-3 text-xs uppercase">Actions</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map(user => (
                            <tr key={user._id}>
                                <td className="px-6 py-4">{user.fullName}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4 capitalize">{user.role}</td>
                                <td className="px-6 py-4 flex gap-3">
                                    <button onClick={() => { setCurrentUser(user); setIsEditing(true); }} className="text-blue-600"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(user._id)} className="text-red-600"><Trash size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
