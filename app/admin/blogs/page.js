'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Plus, Edit, Trash, Check, X, Eye } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';
import BlogPreviewModal from '@/components/preview/BlogPreviewModal';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function BlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBlog, setCurrentBlog] = useState({});
    const [showPreview, setShowPreview] = useState(false);

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
        setCurrentBlog({ title: '', slug: '', summary: '', content: '', coverImage: '', isHidden: true, blocks: [] });
        setIsEditing(true);
    };

    if (loading && !isEditing) return <div>Loading blogs...</div>;

    if (isEditing) {
        return (
            <div className="max-w-4xl mx-auto glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{currentBlog._id ? 'Edit Blog' : 'Create New Blog'}</h2>
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Title</label>
                            <input
                                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                value={currentBlog.title || ''}
                                onChange={e => {
                                    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                                    setCurrentBlog({ ...currentBlog, title: e.target.value, slug: currentBlog.slug || slug })
                                }}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Slug</label>
                            <input
                                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                value={currentBlog.slug || ''}
                                onChange={e => setCurrentBlog({ ...currentBlog, slug: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Content</label>
                        <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-white/10">
                            <ReactQuill
                                theme="snow"
                                value={currentBlog.content || ''}
                                onChange={content => setCurrentBlog({ ...currentBlog, content })}
                                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                modules={{
                                    toolbar: [
                                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                        [{ 'font': [] }],
                                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                        [{ 'color': [] }, { 'background': [] }],
                                        [{ 'align': [] }],
                                        ['link', 'image', 'video'],
                                        ['clean']
                                    ],
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Summary</label>
                        <textarea
                            className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all h-24"
                            value={currentBlog.summary || ''}
                            onChange={e => setCurrentBlog({ ...currentBlog, summary: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Cover Image URL</label>
                        <input
                            className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                            value={currentBlog.coverImage || ''}
                            onChange={e => setCurrentBlog({ ...currentBlog, coverImage: e.target.value })}
                            placeholder="/images/blog-1.jpg"
                        />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/5">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={!currentBlog.isHidden}
                                onChange={e => setCurrentBlog({ ...currentBlog, isHidden: !e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                        </label>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {currentBlog.isHidden ? 'Draft (Hidden)' : 'Published (Visible)'}
                        </span>
                    </div>

                    <div className="flex gap-4 pt-4 justify-end">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2.5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowPreview(true)}
                            className="px-6 py-2.5 bg-slate-800 dark:bg-slate-700 text-white rounded-xl hover:bg-slate-700 dark:hover:bg-slate-600 shadow-lg shadow-slate-500/20 transition-all font-medium flex items-center gap-2"
                        >
                            <Eye size={18} /> Preview
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all font-medium"
                        >
                            Save Blog
                        </button>
                    </div>
                </form>
                <BlogPreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)} blog={currentBlog} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">Blogs Management</h2>
                <button onClick={handleCreate} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all font-medium">
                    <Plus size={18} /> Create Blog
                </button>
            </div>

            <div className="glass-panel rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 backdrop-blur-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Title</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Author</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {blogs.map(blog => (
                            <tr key={blog._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{blog.title}</td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{blog.author?.fullName || 'Unknown'}</td>
                                <td className="px-6 py-4">
                                    {blog.isHidden ?
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">Draft</span> :
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">Published</span>
                                    }
                                </td>
                                <td className="px-6 py-4 flex gap-3 justify-end">
                                    <button onClick={() => handleEdit(blog)} className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(blog._id)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"><Trash size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
