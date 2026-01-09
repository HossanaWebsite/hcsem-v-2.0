'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, Loader2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function AboutContentPage() {
    const defaults = {
        aboutPageTitle: { en: "About HCSEM", am: "ስለ HCSEM" },
        aboutPageSubtitle: { en: "Connecting Ethiopians, preserving culture, building a stronger community in Minnesota", am: "ኢትዮጵያውያንን ማገናኘት፣ ባህልን መጠበቅ፣ በሜኒሶታ ጠንካራ ማህበረሰብ መገንባት" },
        aboutPageImage: "/hero-home.png",
        aboutMission: { en: "To foster a sense of belonging and unity...", am: "የባለቤትነት እና የአንድነት ስሜትን ለማሳደግ..." },
        aboutMissionImage: "/about-mission.png",
        aboutVision: { en: "To be the leading Ethiopian community organization...", am: "ቀዳሚ የኢትዮጵያ ማህበረሰብ ድርጅት ለመሆን..." },
        aboutVisionImage: "/about-vision.png",
        aboutActivities: []
    };

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editLang, setEditLang] = useState('en'); // 'en' or 'am'
    const [settings, setSettings] = useState({
        aboutPageTitle: defaults.aboutPageTitle,
        aboutPageSubtitle: defaults.aboutPageSubtitle,
        aboutPageImage: defaults.aboutPageImage,
        aboutMission: defaults.aboutMission,
        aboutMissionImage: defaults.aboutMissionImage,
        aboutVision: defaults.aboutVision,
        aboutVisionImage: defaults.aboutVisionImage,
        aboutActivities: [],
        showAboutHeader: true,
        showAboutMission: true,
        showAboutVision: true
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    // Helper to ensure bilingual structure
    const ensureBilingual = (val, defaultVal) => {
        if (!val) return defaultVal;
        if (typeof val === 'string') return { en: val, am: '' };
        return val;
    };

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                const data = await res.json();
                setSettings({
                    ...data,
                    aboutPageTitle: ensureBilingual(data.aboutPageTitle, defaults.aboutPageTitle),
                    aboutPageSubtitle: ensureBilingual(data.aboutPageSubtitle, defaults.aboutPageSubtitle),
                    aboutPageImage: data.aboutPageImage || defaults.aboutPageImage,
                    aboutMission: ensureBilingual(data.aboutMission, defaults.aboutMission),
                    aboutMissionImage: data.aboutMissionImage || defaults.aboutMissionImage,
                    aboutVision: ensureBilingual(data.aboutVision, defaults.aboutVision),
                    aboutVisionImage: data.aboutVisionImage || defaults.aboutVisionImage,
                    aboutActivities: data.aboutActivities || [],
                    showAboutHeader: data.showAboutHeader !== undefined ? data.showAboutHeader : true,
                    showAboutMission: data.showAboutMission !== undefined ? data.showAboutMission : true,
                    showAboutVision: data.showAboutVision !== undefined ? data.showAboutVision : true
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

    const updateField = (field, value) => {
        setSettings(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [editLang]: value
            }
        }));
    };

    // ... (Image Upload Logic same as before) ...
    const handleImageUpload = async (e, type = 'header') => {
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
                if (type === 'header') {
                    setSettings(prev => ({ ...prev, aboutPageImage: data.url }));
                } else if (type === 'mission') {
                    setSettings(prev => ({ ...prev, aboutMissionImage: data.url }));
                } else if (type === 'vision') {
                    setSettings(prev => ({ ...prev, aboutVisionImage: data.url }));
                }
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
                    <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">About Page Content</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage about page appearance and content</p>
                </div>
                <div className="flex gap-4">
                    {/* Language Toggle */}
                    <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-white/10">
                        <button
                            onClick={() => setEditLang('en')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${editLang === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setEditLang('am')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${editLang === 'am' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            Amharic
                        </button>
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
            </div>

            {/* Page Header Section */}
            <section className={`glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl transition-all ${!settings.showAboutHeader ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Page Header ({editLang.toUpperCase()})</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500 dark:text-slate-400">{settings.showAboutHeader ? 'Visible' : 'Hidden'}</span>
                        <button
                            onClick={() => setSettings({ ...settings, showAboutHeader: !settings.showAboutHeader })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.showAboutHeader ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.showAboutHeader ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Page Title</label>
                            <input
                                type="text"
                                value={settings.aboutPageTitle?.[editLang] || ''}
                                onChange={(e) => updateField('aboutPageTitle', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all"
                                placeholder={`Enter title in ${editLang === 'en' ? 'English' : 'Amharic'}`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Page Subtitle</label>
                            <textarea
                                value={settings.aboutPageSubtitle?.[editLang] || ''}
                                onChange={(e) => updateField('aboutPageSubtitle', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all h-[80px] min-h-[50px] resize-y"
                                placeholder={`Subtitle in ${editLang === 'en' ? 'English' : 'Amharic'}`}
                            />
                        </div>
                    </div>
                    {/* Image block remains the same */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Header Background Image</label>
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-950 group">
                            {settings.aboutPageImage && settings.aboutPageImage.trim() !== '' ? (
                                <>
                                    <Image src={settings.aboutPageImage} alt="About Header" fill className="object-cover" />
                                    <button onClick={() => setSettings({ ...settings, aboutPageImage: '' })} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10 hover:bg-red-600"><X className="w-4 h-4" strokeWidth={3} /></button>
                                </>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2"><Upload className="w-8 h-8 opacity-20" /><span className="text-sm">No Image</span></div>
                            )}
                            <div className={`absolute inset-0 bg-black/50 transition-opacity flex items-center justify-center ${settings.aboutPageImage ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                                <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors border border-white/10 flex items-center gap-2">
                                    <Upload className="w-4 h-4" /> {settings.aboutPageImage ? 'Change Image' : 'Upload Image'}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'header')} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className={`glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl transition-all ${!settings.showAboutMission ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Mission ({editLang.toUpperCase()})</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500 dark:text-slate-400">{settings.showAboutMission ? 'Visible' : 'Hidden'}</span>
                        <button onClick={() => setSettings({ ...settings, showAboutMission: !settings.showAboutMission })} className={`w-12 h-6 rounded-full transition-colors relative ${settings.showAboutMission ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.showAboutMission ? 'right-1' : 'left-1'}`} /></button>
                    </div>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Mission Statement</label>
                        <textarea
                            value={settings.aboutMission?.[editLang] || ''}
                            onChange={(e) => updateField('aboutMission', e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all h-[150px] resize-y"
                            placeholder={`Mission in ${editLang === 'en' ? 'English' : 'Amharic'}`}
                        />
                    </div>
                    {/* Image block remains the same */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Mission Image</label>
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-950 group">
                            {settings.aboutMissionImage && settings.aboutMissionImage.trim() !== '' ? (
                                <>
                                    <Image src={settings.aboutMissionImage} alt="Mission" fill className="object-cover" />
                                    <button onClick={() => setSettings({ ...settings, aboutMissionImage: '' })} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10 hover:bg-red-600"><X className="w-4 h-4" strokeWidth={3} /></button>
                                </>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2"><Upload className="w-8 h-8 opacity-20" /><span className="text-sm">No Image</span></div>
                            )}
                            <div className={`absolute inset-0 bg-black/50 transition-opacity flex items-center justify-center ${settings.aboutMissionImage ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                                <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors border border-white/10 flex items-center gap-2">
                                    <Upload className="w-4 h-4" /> {settings.aboutMissionImage ? 'Change Image' : 'Upload Image'}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'mission')} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision Section */}
            <section className={`glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl transition-all ${!settings.showAboutVision ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Vision ({editLang.toUpperCase()})</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500 dark:text-slate-400">{settings.showAboutVision ? 'Visible' : 'Hidden'}</span>
                        <button onClick={() => setSettings({ ...settings, showAboutVision: !settings.showAboutVision })} className={`w-12 h-6 rounded-full transition-colors relative ${settings.showAboutVision ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.showAboutVision ? 'right-1' : 'left-1'}`} /></button>
                    </div>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Vision Statement</label>
                        <textarea
                            value={settings.aboutVision?.[editLang] || ''}
                            onChange={(e) => updateField('aboutVision', e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all h-[150px] resize-y"
                            placeholder={`Vision in ${editLang === 'en' ? 'English' : 'Amharic'}`}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Vision Image</label>
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-950 group">
                            {settings.aboutVisionImage && settings.aboutVisionImage.trim() !== '' ? (
                                <>
                                    <Image src={settings.aboutVisionImage} alt="Vision" fill className="object-cover" />
                                    <button onClick={() => setSettings({ ...settings, aboutVisionImage: '' })} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10 hover:bg-red-600"><X className="w-4 h-4" strokeWidth={3} /></button>
                                </>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2"><Upload className="w-8 h-8 opacity-20" /><span className="text-sm">No Image</span></div>
                            )}
                            <div className={`absolute inset-0 bg-black/50 transition-opacity flex items-center justify-center ${settings.aboutVisionImage ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                                <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors border border-white/10 flex items-center gap-2">
                                    <Upload className="w-4 h-4" /> {settings.aboutVisionImage ? 'Change Image' : 'Upload Image'}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'vision')} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What We Do Section */}
            <section className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">What We Do ({editLang.toUpperCase()})</h2>
                    <button
                        onClick={() => setSettings({ ...settings, aboutActivities: [...settings.aboutActivities, { title: { en: '', am: '' }, description: { en: '', am: '' }, icon: 'Heart', color: 'from-amber-500 to-orange-500' }] })}
                        className="px-4 py-2 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600/20 rounded-lg text-sm font-medium transition-all"
                    >
                        + Add Activity
                    </button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {settings.aboutActivities?.map((activity, index) => (
                        <div key={index} className="p-4 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5 space-y-4">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-mono text-slate-500">#{index + 1}</span>
                                <button
                                    onClick={() => {
                                        const newActivities = [...settings.aboutActivities];
                                        newActivities.splice(index, 1);
                                        setSettings({ ...settings, aboutActivities: newActivities });
                                    }}
                                    className="text-red-500 hover:text-red-400 p-1"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-slate-500 dark:text-slate-400">Title ({editLang})</label>
                                <input
                                    type="text"
                                    value={ensureBilingual(activity.title, { en: '', am: '' })?.[editLang] || ''}
                                    onChange={(e) => {
                                        const newActivities = [...settings.aboutActivities];
                                        newActivities[index].title = {
                                            ...ensureBilingual(newActivities[index].title, { en: '', am: '' }),
                                            [editLang]: e.target.value
                                        };
                                        setSettings({ ...settings, aboutActivities: newActivities });
                                    }}
                                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-slate-500 dark:text-slate-400">Description ({editLang})</label>
                                <textarea
                                    value={ensureBilingual(activity.description, { en: '', am: '' })?.[editLang] || ''}
                                    onChange={(e) => {
                                        const newActivities = [...settings.aboutActivities];
                                        newActivities[index].description = {
                                            ...ensureBilingual(newActivities[index].description, { en: '', am: '' }),
                                            [editLang]: e.target.value
                                        };
                                        setSettings({ ...settings, aboutActivities: newActivities });
                                    }}
                                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500/50 h-20 resize-none"
                                />
                            </div>

                            <div className="flex gap-2">
                                <div className="flex-1 space-y-1">
                                    <label className="text-xs text-slate-500 dark:text-slate-400">Icon</label>
                                    <select
                                        value={activity.icon}
                                        onChange={(e) => {
                                            const newActivities = [...settings.aboutActivities];
                                            newActivities[index].icon = e.target.value;
                                            setSettings({ ...settings, aboutActivities: newActivities });
                                        }}
                                        className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-2 text-slate-900 dark:text-white text-xs"
                                    >
                                        {['Heart', 'Users', 'Lightbulb', 'Target', 'Shield', 'Sparkles'].map(icon => (
                                            <option key={icon} value={icon}>{icon}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
