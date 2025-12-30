'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Check, X } from 'lucide-react';

export default function BlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBlog, setCurrentBlog] = useState({});

    // Fetch Blogs
    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/blogs');
            const data = await res.json();
            if (data.success) setBlogs(data.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBlogs(); }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;
        try {
            const res = await fetch(`/api/blogs?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchBlogs();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const method = currentBlog._id ? 'PUT' : 'POST';
        const body = { ...currentBlog, id: currentBlog._id }; // ensure id is passed for PUT

        try {
            const res = await fetch('/api/blogs', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (data.success) {
                setIsEditing(false);
                setCurrentBlog({});
                fetchBlogs();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to save');
        }
    };

    const handleEdit = (blog) => {
        setCurrentBlog(blog);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setCurrentBlog({ title: '', slug: '', summary: '', isHidden: true, blocks: [] });
        setIsEditing(true);
    };

    if (loading && !isEditing) return <div>Loading blogs...</div>;

    if (isEditing) {
        return (
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">{currentBlog._id ? 'Edit Blog' : 'Create New Blog'}</h2>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input className="w-full border p-2 rounded" value={currentBlog.title || ''} onChange={e => setCurrentBlog({ ...currentBlog, title: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Slug</label>
                        <input className="w-full border p-2 rounded" value={currentBlog.slug || ''} onChange={e => setCurrentBlog({ ...currentBlog, slug: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Summary</label>
                        <textarea className="w-full border p-2 rounded h-24" value={currentBlog.summary || ''} onChange={e => setCurrentBlog({ ...currentBlog, summary: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                        <input className="w-full border p-2 rounded" value={currentBlog.coverImage || ''} onChange={e => setCurrentBlog({ ...currentBlog, coverImage: e.target.value })} placeholder="/images/blog-1.jpg" />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="isHidden" checked={currentBlog.isHidden} onChange={e => setCurrentBlog({ ...currentBlog, isHidden: e.target.checked })} />
                        <label htmlFor="isHidden">Save as Draft (Hidden)</label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Blog</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Blogs Management</h2>
                <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    <Plus size={18} /> Create Blog
                </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold uppercase">Title</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase">Author</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase">Status</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {blogs.map(blog => (
                            <tr key={blog._id}>
                                <td className="px-6 py-4">{blog.title}</td>
                                <td className="px-6 py-4">{blog.author?.fullName || 'Unknown'}</td>
                                <td className="px-6 py-4">
                                    {blog.isHidden ?
                                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Draft</span> :
                                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Published</span>
                                    }
                                </td>
                                <td className="px-6 py-4 flex gap-3">
                                    <button onClick={() => handleEdit(blog)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(blog._id)} className="text-red-600 hover:text-red-800"><Trash size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
