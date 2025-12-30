'use client';

import React, { useState, useEffect } from 'react';
import { Save, Upload } from 'lucide-react';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        heroImage: '',
        heroTitle: '',
        heroSubtitle: '',
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setSettings(prev => ({ ...prev, ...data.data }));
                }
            })
            .catch(err => console.error("Failed to load settings", err));
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setSettings(prev => ({ ...prev, heroImage: data.data.url }));
            }
        } catch (error) {
            console.error("Upload failed", error);
            setMessage({ type: 'error', text: 'Image upload failed' });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Settings updated successfully!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to update settings.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Site Settings</h2>

            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Hero Image Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hero / Banner Image</label>
                        <div className="flex items-start gap-6">
                            <div className="w-64 h-36 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative">
                                {settings.heroImage ? (
                                    <img
                                        src={settings.heroImage}
                                        alt="Hero Preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = 'https://placehold.co/600x400'; }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">No Image Set</div>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors w-fit">
                                    <Upload size={18} />
                                    <span>{uploading ? 'Uploading...' : 'Upload New Image'}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        disabled={uploading}
                                    />
                                </label>
                                <p className="text-xs text-gray-500 mt-2">Recommended size: 1920x1080px. Max 5MB.</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={settings.heroTitle}
                                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                                placeholder="Welcome to HCSEM"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Subtitle</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={settings.heroSubtitle}
                                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                                placeholder="Empowering Communities..."
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Save size={18} />
                            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
