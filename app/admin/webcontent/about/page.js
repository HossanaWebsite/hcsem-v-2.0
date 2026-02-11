'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function AboutContentPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        aboutPageTitle: '',
        aboutPageSubtitle: '',
        aboutPageImage: '',
        aboutMission: '',
        aboutVision: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                const data = await res.json();
                setSettings({
                    aboutPageTitle: data.aboutPageTitle || '',
                    aboutPageSubtitle: data.aboutPageSubtitle || '',
                    aboutPageImage: data.aboutPageImage || '',
                    aboutMission: data.aboutMission || '',
                    aboutVision: data.aboutVision || ''
                });
            }
        } catch (error) {
            console.error(error);
            toast.error('Error loading settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                toast.success('About page settings saved successfully');
            } else {
                toast.error('Failed to save settings');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        const toastId = toast.loading("Uploading image...");

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setSettings(prev => ({ ...prev, aboutPageImage: data.url }));
                toast.update(toastId, { render: "Image uploaded!", type: "success", isLoading: false, autoClose: 3000 });
            } else {
                toast.update(toastId, { render: "Upload failed", type: "error", isLoading: false, autoClose: 3000 });
            }
        } catch (error) {
            console.error(error);
            toast.update(toastId, { render: "Error uploading", type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-white">About Page Content</h1>
                    <p className="text-slate-400">Manage about page appearance and content</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </motion.button>
            </div>

            <section className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
                <h2 className="text-xl font-semibold text-white mb-6">Page Header</h2>
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Page Title</label>
                            <input
                                type="text"
                                value={settings.aboutPageTitle}
                                onChange={(e) => setSettings({ ...settings, aboutPageTitle: e.target.value })}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                                placeholder="e.g. About Us"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Page Subtitle</label>
                            <textarea
                                value={settings.aboutPageSubtitle}
                                onChange={(e) => setSettings({ ...settings, aboutPageSubtitle: e.target.value })}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all h-[80px] min-h-[50px] resize-y"
                                placeholder="Subtitle text..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Header Background Image</label>
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-slate-950 group">
                            {settings.aboutPageImage && settings.aboutPageImage.trim() !== '' ? (
                                <Image src={settings.aboutPageImage} alt="About Header" fill className="object-cover" unoptimized />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-500">No Image</div>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors border border-white/10 flex items-center gap-2">
                                    <Upload className="w-4 h-4" /> Change Image
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
                <h2 className="text-xl font-semibold text-white mb-6">Mission & Vision</h2>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Mission Statement</label>
                        <textarea
                            value={settings.aboutMission}
                            onChange={(e) => setSettings({ ...settings, aboutMission: e.target.value })}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all h-[120px] resize-y"
                            placeholder="Enter your organization's mission..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Vision Statement</label>
                        <textarea
                            value={settings.aboutVision}
                            onChange={(e) => setSettings({ ...settings, aboutVision: e.target.value })}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all h-[120px] resize-y"
                            placeholder="Enter your organization's vision..."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
