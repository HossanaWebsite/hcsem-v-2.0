'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, Loader2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import Image from 'next/image';

const defaults = {
    contactPageTitle: "Contact Us",
    contactPageSubtitle: "Get in touch with us",
    contactPageImage: "",
    contactOfficeHours: "Monday - Friday: 9:00 AM - 5:00 PM\nSaturday: 10:00 AM - 2:00 PM\nSunday: Closed",
    contactAddress: "Minneapolis, Minnesota",
    contactPhone: "+1 (555) 123-4567",
    contactEmail: "info@hcsem.org"
};

export default function ContactContentPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        contactPageTitle: defaults.contactPageTitle,
        contactPageSubtitle: defaults.contactPageSubtitle,
        contactPageImage: defaults.contactPageImage,
        contactOfficeHours: defaults.contactOfficeHours,
        contactAddress: defaults.contactAddress,
        contactPhone: defaults.contactPhone,
        contactEmail: defaults.contactEmail,
        contactPhone: defaults.contactPhone,
        contactEmail: defaults.contactEmail,
        showContactHeader: true,
        contactReasons: []
    });

    const [newReason, setNewReason] = useState({ en: '', am: '' });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    setSettings({
                        ...data,
                        contactPageTitle: data.contactPageTitle || defaults.contactPageTitle,
                        contactPageSubtitle: data.contactPageSubtitle || defaults.contactPageSubtitle,
                        contactPageImage: data.contactPageImage || defaults.contactPageImage,
                        contactOfficeHours: data.contactOfficeHours || defaults.contactOfficeHours,
                        contactAddress: data.contactAddress || defaults.contactAddress,
                        contactPhone: data.contactPhone || defaults.contactPhone,
                        contactEmail: data.contactEmail || defaults.contactEmail,
                        showContactHeader: data.showContactHeader !== undefined ? data.showContactHeader : true,
                        contactReasons: data.contactReasons || []
                    });
                }
            } catch (error) {
                console.error(error);
                toast.error('Error loading settings');
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                toast.success('Contact page settings saved successfully');
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
                setSettings(prev => ({ ...prev, contactPageImage: data.url }));
                toast.update(toastId, { render: "Image uploaded!", type: "success", isLoading: false, autoClose: 3000 });
            } else {
                toast.update(toastId, { render: "Upload failed", type: "error", isLoading: false, autoClose: 3000 });
            }
        } catch (error) {
            console.error(error);
            toast.update(toastId, { render: "Error uploading", type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    const handleAddReason = () => {
        if (!newReason.en || !newReason.am) {
            toast.error('Please provide both English and Amharic labels');
            return;
        }

        const updatedReasons = [...(settings.contactReasons || []), {
            value: newReason.en,
            label: { en: newReason.en, am: newReason.am }
        }];

        setSettings({ ...settings, contactReasons: updatedReasons });
        setNewReason({ en: '', am: '' });
        toast.success('Reason added - click Save Changes to persist');
    };

    const handleRemoveReason = (index) => {
        const updatedReasons = [...(settings.contactReasons || [])];
        updatedReasons.splice(index, 1);
        setSettings({ ...settings, contactReasons: updatedReasons });
        toast.info('Reason removed - click Save Changes to persist');
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
                    <h1 className="text-3xl font-bold font-heading text-white">Contact Page Content</h1>
                    <p className="text-slate-400">Manage contact page appearance</p>
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

            <section className={`glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl transition-all ${!settings.showContactHeader ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Page Header</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400">{settings.showContactHeader ? 'Visible' : 'Hidden'}</span>
                        <button
                            onClick={() => setSettings({ ...settings, showContactHeader: !settings.showContactHeader })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.showContactHeader ? 'bg-indigo-600' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.showContactHeader ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Page Title</label>
                            <input
                                type="text"
                                value={settings.contactPageTitle}
                                onChange={(e) => setSettings({ ...settings, contactPageTitle: e.target.value })}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                                placeholder="e.g. Contact Us"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Page Subtitle</label>
                            <textarea
                                value={settings.contactPageSubtitle}
                                onChange={(e) => setSettings({ ...settings, contactPageSubtitle: e.target.value })}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all h-[80px] min-h-[50px] resize-y"
                                placeholder="Subtitle text..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Header Background Image</label>
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-slate-950 group">
                            {settings.contactPageImage && settings.contactPageImage.trim() !== '' ? (
                                <>
                                    <Image src={settings.contactPageImage} alt="Contact Header" fill className="object-cover" />
                                    <button
                                        onClick={() => setSettings({ ...settings, contactPageImage: '' })}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10 hover:bg-red-600"
                                        title="Remove Image"
                                    >
                                        <X className="w-4 h-4" strokeWidth={3} />
                                    </button>
                                </>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-2">
                                    <Upload className="w-8 h-8 opacity-20" />
                                    <span className="text-sm">No Image</span>
                                </div>
                            )}
                            <div className={`absolute inset-0 bg-black/50 transition-opacity flex items-center justify-center ${settings.contactPageImage ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                                <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors border border-white/10 flex items-center gap-2">
                                    <Upload className="w-4 h-4" /> {settings.contactPageImage ? 'Change Image' : 'Upload Image'}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Information */}
            <section className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
                <h2 className="text-xl font-semibold text-white mb-6">Contact Information</h2>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Office Hours</label>
                        <textarea
                            value={settings.contactOfficeHours || ''}
                            onChange={(e) => setSettings({ ...settings, contactOfficeHours: e.target.value })}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all h-[100px] resize-y"
                            placeholder="e.g. Monday - Friday: 9:00 AM - 5:00 PM&#10;Saturday: 10:00 AM - 2:00 PM&#10;Sunday: Closed"
                        />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Address</label>
                            <input
                                type="text"
                                value={settings.contactAddress || ''}
                                onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                                placeholder="e.g. Minneapolis, Minnesota"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Phone Number</label>
                            <input
                                type="text"
                                value={settings.contactPhone || ''}
                                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                                placeholder="e.g. +1 (555) 123-4567"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Email Address</label>
                        <input
                            type="email"
                            value={settings.contactEmail || ''}
                            onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                            placeholder="e.g. info@hcsem.org"
                        />
                    </div>
                </div>
            </section>

            {/* Contact Reasons Management */}
            <section className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
                <h2 className="text-xl font-semibold text-white mb-6">Contact Reasons</h2>
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                        <input
                            type="text"
                            value={newReason.en}
                            onChange={(e) => setNewReason({ ...newReason, en: e.target.value })}
                            placeholder="Reason (English)"
                            className="bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600"
                        />
                        <input
                            type="text"
                            value={newReason.am}
                            onChange={(e) => setNewReason({ ...newReason, am: e.target.value })}
                            placeholder="Reason (Amharic)"
                            className="bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600"
                        />
                        <button
                            onClick={handleAddReason}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                        >
                            Add
                        </button>
                    </div>

                    <div className="space-y-3">
                        {settings.contactReasons && settings.contactReasons.length > 0 ? (
                            settings.contactReasons.map((reason, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 group">
                                    <div className="flex gap-4 items-center">
                                        <div className="text-white font-medium">{reason.label?.en || reason.value}</div>
                                        <div className="text-slate-600">|</div>
                                        <div className="text-slate-300 font-amharic">{reason.label?.am}</div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveReason(index)}
                                        className="text-slate-500 hover:text-red-400 transition-colors p-2 hover:bg-white/5 rounded-full opacity-0 group-hover:opacity-100"
                                        title="Remove Reason"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-slate-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                                No custom reasons added yet
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div >
    );
}
