'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Upload, ArrowUp, ArrowDown, Loader2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import Image from 'next/image';

const defaults = {
    heroTitle: "HCSEM",
    heroSubtitle: "Building community.\nPreserving culture.",
    heroImage: "",
    stats: [
        { label: "Members", value: "500+" },
        { label: "Events", value: "50+" },
        { label: "Years", value: "10+" }
    ],
    tickerImages: [
        { url: "/folder/2.jpg", title: "Cultural Festival", subtitle: "Celebrating our heritage together" },
        { url: "/folder/3.jpg", title: "Community Gathering", subtitle: "Sharing traditional Ethiopian flavors" },
        { url: "/folder/9.jpg", title: "Youth Program", subtitle: "Empowering our next generation" },
        { url: "/folder/10.jpg", title: "Heritage Day", subtitle: "Keeping our traditions alive" }
    ],
    galleryTitle: "Community Gallery",
    gallerySubtitle: "Capturing the spirit of our community through photos",
    galleryImages: [
        { url: "/folder/2.jpg" },
        { url: "/folder/3.jpg" },
        { url: "/folder/9.jpg" },
        { url: "/folder/10.jpg" },
        { url: "/folder/13.jpg" },
        { url: "/folder/16.jpg" }
    ],
    upcomingEventsTitle: "Upcoming Events",
    upcomingEventsSubtitle: "Join us in our upcoming gatherings and celebrations",
    defaultEvents: [
        { title: "Cultural Festival 2024", date: "Dec 15", description: "Annual celebration featuring traditional music, dance, and food", image: "/event-placeholder.png" },
        { title: "Community Gathering", date: "Dec 20", description: "Monthly meetup for community members to connect", image: "/about-mission.png" },
        { title: "Youth Education Program", date: "Dec 25", description: "Educational workshop for young members", image: "/about-vision.png" }
    ],
    defaultBlogs: [
        { title: "Sample Blog Post 1", date: "Dec 1, 2024", summary: "Discover the latest updates and stories from our vibrant community.", image: "/blog-placeholder.png" },
        { title: "Sample Blog Post 2", date: "Dec 2, 2024", summary: "Learn about our initiatives, events, and the amazing people making a difference.", image: "/folder/2.jpg" }
    ]
};

export default function HomePageSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        logoUrl: null,
        heroTitle: defaults.heroTitle,
        heroSubtitle: defaults.heroSubtitle,
        heroImage: defaults.heroImage,
        stats: defaults.stats,
        tickerImages: [],
        eventsTitle: defaults.eventsTitle,
        eventsSubtitle: defaults.eventsSubtitle,
        galleryTitle: defaults.galleryTitle,
        gallerySubtitle: defaults.gallerySubtitle,
        galleryImages: [],
        upcomingEventsTitle: defaults.upcomingEventsTitle,
        upcomingEventsSubtitle: defaults.upcomingEventsSubtitle,
        showHero: true,
        showStats: true,
        showEventsHighlight: true,
        showCommunityGallery: true,
        showUpcomingEvents: true
    });

    const [previewOpen, setPreviewOpen] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    setSettings({
                        ...data,
                        logoUrl: data.logoUrl || null,
                        heroTitle: data.heroTitle || defaults.heroTitle,
                        heroSubtitle: data.heroSubtitle || defaults.heroSubtitle,
                        heroImage: data.heroImage || defaults.heroImage,
                        stats: (data.stats && data.stats.length > 0) ? data.stats : defaults.stats,
                        tickerImages: (data.tickerImages && data.tickerImages.length > 0) ? data.tickerImages : defaults.tickerImages,
                        eventsTitle: data.eventsTitle || defaults.eventsTitle,
                        eventsSubtitle: data.eventsSubtitle || defaults.eventsSubtitle,
                        galleryTitle: data.galleryTitle || defaults.galleryTitle,
                        gallerySubtitle: data.gallerySubtitle || defaults.gallerySubtitle,
                        galleryImages: (data.galleryImages && data.galleryImages.length > 0) ? data.galleryImages : defaults.galleryImages,
                        upcomingEventsTitle: data.upcomingEventsTitle || defaults.upcomingEventsTitle,
                        upcomingEventsSubtitle: data.upcomingEventsSubtitle || defaults.upcomingEventsSubtitle,
                        defaultEvents: data.defaultEvents || defaults.defaultEvents,
                        defaultBlogs: data.defaultBlogs || defaults.defaultBlogs,
                        showHero: data.showHero !== undefined ? data.showHero : true,
                        showStats: data.showStats !== undefined ? data.showStats : true,
                        showEventsHighlight: data.showEventsHighlight !== undefined ? data.showEventsHighlight : true,
                        showCommunityGallery: data.showCommunityGallery !== undefined ? data.showCommunityGallery : true,
                        showUpcomingEvents: data.showUpcomingEvents !== undefined ? data.showUpcomingEvents : true
                    });
                } else {
                    toast.error('Failed to load settings');
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
                toast.success('Home page settings saved successfully');
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

    const handleStatChange = (index, field, value) => {
        const newStats = [...settings.stats];
        newStats[index][field] = value;
        setSettings({ ...settings, stats: newStats });
    };

    const addStat = () => {
        setSettings({
            ...settings,
            stats: [...settings.stats, { label: '', value: '' }]
        });
    };

    const removeStat = (index) => {
        const newStats = settings.stats.filter((_, i) => i !== index);
        setSettings({ ...settings, stats: newStats });
    };

    const handleImageUpload = async (e, type = 'ticker') => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const toastId = toast.loading("Uploading image(s)...");
        let successCount = 0;

        try {
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append('file', files[i]);

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (res.ok) {
                    const response = await res.json();
                    console.log('Upload response:', response); // Debug log
                    console.log('Upload type:', type); // Debug log

                    // Extract URL from nested data object
                    const imageUrl = response.data?.url || response.url;
                    console.log('Extracted image URL:', imageUrl); // Debug log

                    if (!imageUrl) {
                        console.error('No URL in response:', response);
                        toast.error('Upload failed: No URL returned');
                        continue;
                    }

                    if (type === 'logo') {
                        setSettings(prev => ({ ...prev, logoUrl: imageUrl }));
                        successCount++;
                        break;
                    } else if (type === 'hero') {
                        setSettings(prev => ({ ...prev, heroImage: imageUrl }));
                        successCount++;
                        break;
                    } else if (type === 'gallery') {
                        setSettings(prev => ({
                            ...prev,
                            galleryImages: [
                                ...prev.galleryImages,
                                { url: imageUrl, order: prev.galleryImages.length }
                            ]
                        }));
                        successCount++;
                    } else {
                        // ticker images with title and subtitle
                        const newImage = { url: imageUrl, title: '', subtitle: '', order: settings.tickerImages.length };
                        console.log('Adding ticker image:', newImage); // Debug log
                        setSettings(prev => ({
                            ...prev,
                            tickerImages: [
                                ...prev.tickerImages,
                                newImage
                            ]
                        }));
                        successCount++;
                    }
                } else {
                    const errorText = await res.text();
                    console.error('Upload failed:', res.status, errorText);
                    toast.error(`Upload failed: ${res.status}`);
                }
            }

            if (successCount > 0) {
                toast.update(toastId, { render: `${successCount} image(s) uploaded!`, type: "success", isLoading: false, autoClose: 3000 });
            } else {
                toast.update(toastId, { render: "Upload failed", type: "error", isLoading: false, autoClose: 3000 });
            }

        } catch (error) {
            console.error('Upload error:', error);
            toast.update(toastId, { render: `Error uploading: ${error.message}`, type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    const handleCarouselImageChange = (index, field, value) => {
        const newImages = [...settings.tickerImages];
        newImages[index][field] = value;
        setSettings({ ...settings, tickerImages: newImages });
    };

    const removeImage = (index) => {
        const newImages = settings.tickerImages.filter((_, i) => i !== index);
        setSettings({ ...settings, tickerImages: newImages });
    };

    const removeGalleryImage = (index) => {
        const newImages = settings.galleryImages.filter((_, i) => i !== index);
        setSettings({ ...settings, galleryImages: newImages });
    };

    const moveImage = (index, direction) => {
        const newImages = [...settings.tickerImages];
        if (direction === 'up' && index > 0) {
            [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
        } else if (direction === 'down' && index < newImages.length - 1) {
            [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
        }
        setSettings({ ...settings, tickerImages: newImages });
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
                    <h1 className="text-3xl font-bold font-heading text-white">Home Page Content</h1>
                    <p className="text-slate-400">Manage home page content and appearance</p>
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

            {/* Logo Section */}
            <section className={`glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl mb-8`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Site Logo</h2>
                    <span className="text-sm text-slate-400">Global</span>
                </div>
                <div className="grid gap-8 md:grid-cols-2 items-center">
                    <div className="space-y-4">
                        <p className="text-slate-400 text-sm">Upload a transparent PNG for best results. This logo will appear in the sidebar and header.</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Logo Image</label>
                        <div className="relative w-full max-w-xs aspect-video rounded-xl overflow-hidden border border-white/10 bg-slate-950 group flex items-center justify-center p-4">
                            {settings.logoUrl ? (
                                <>
                                    <div className="relative w-full h-full">
                                        <Image src={settings.logoUrl} alt="Logo" fill className="object-contain" unoptimized />
                                    </div>
                                    <button
                                        onClick={() => setSettings({ ...settings, logoUrl: null })}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10 hover:bg-red-600"
                                        title="Remove Logo"
                                    >
                                        <X className="w-4 h-4" strokeWidth={3} />
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
                                    <Upload className="w-8 h-8 opacity-20" />
                                    <span className="text-sm">No Logo</span>
                                </div>
                            )}
                            <div className={`absolute inset-0 bg-black/50 transition-opacity flex items-center justify-center ${settings.logoUrl ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                                <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors border border-white/10 flex items-center gap-2">
                                    <Upload className="w-4 h-4" /> {settings.logoUrl ? 'Change Logo' : 'Upload Logo'}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hero Section */}
            <section className={`glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl transition-all ${!settings.showHero ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Hero Section</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400">{settings.showHero ? 'Visible' : 'Hidden'}</span>
                        <button
                            onClick={() => setSettings({ ...settings, showHero: !settings.showHero })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.showHero ? 'bg-indigo-600' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.showHero ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Hero Title</label>
                            <input
                                type="text"
                                value={settings.heroTitle}
                                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                                placeholder="e.g. HCSEM"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Hero Subtitle</label>
                            <textarea
                                value={settings.heroSubtitle}
                                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all h-[80px] min-h-[50px] resize-y"
                                placeholder="Subtitle text..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Hero Background Image</label>
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-slate-950 group">
                            {settings.heroImage && settings.heroImage.trim() !== '' ? (
                                <>
                                    <Image src={settings.heroImage} alt="Hero" fill className="object-cover" unoptimized />
                                    <button
                                        onClick={() => setSettings({ ...settings, heroImage: '' })}
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
                            <div className={`absolute inset-0 bg-black/50 transition-opacity flex items-center justify-center ${settings.heroImage ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                                <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors border border-white/10 flex items-center gap-2">
                                    <Upload className="w-4 h-4" /> {settings.heroImage ? 'Change Image' : 'Upload Image'}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero')} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className={`glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl transition-all ${!settings.showStats ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Statistics Section</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400">{settings.showStats ? 'Visible' : 'Hidden'}</span>
                        <button
                            onClick={() => setSettings({ ...settings, showStats: !settings.showStats })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.showStats ? 'bg-indigo-600' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.showStats ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {settings.stats.map((stat, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr,1fr,auto] gap-4 items-end bg-slate-950/50 p-4 rounded-xl border border-white/10">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Label</label>
                                <input
                                    type="text"
                                    value={stat.label}
                                    onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                    placeholder="e.g. Members"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Value</label>
                                <input
                                    type="text"
                                    value={stat.value}
                                    onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                    placeholder="e.g. 500+"
                                />
                            </div>
                            <button
                                onClick={() => removeStat(index)}
                                className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addStat}
                        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Add New Statistic
                    </button>
                </div>
            </section>

            {/* Events Highlight & Photo Carousel Section (Merged) */}
            <section className={`glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl transition-all ${!settings.showEventsHighlight ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Events Highlight & Carousel</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400">{settings.showEventsHighlight ? 'Visible' : 'Hidden'}</span>
                        <button
                            onClick={() => setSettings({ ...settings, showEventsHighlight: !settings.showEventsHighlight })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.showEventsHighlight ? 'bg-indigo-600' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.showEventsHighlight ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Section Title</label>
                        <input
                            type="text"
                            value={settings.eventsTitle || ''}
                            onChange={(e) => setSettings({ ...settings, eventsTitle: e.target.value })}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                            placeholder="e.g. Event Highlights"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Section Subtitle</label>
                        <input
                            type="text"
                            value={settings.eventsSubtitle || ''}
                            onChange={(e) => setSettings({ ...settings, eventsSubtitle: e.target.value })}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                            placeholder="Subtitle text..."
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-medium text-white">Carousel Images</h3>
                        <p className="text-slate-400 text-sm mt-1">Upload images with titles and subtitles for the carousel</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setPreviewOpen(!previewOpen)}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm border border-white/10 transition-colors"
                        >
                            {previewOpen ? "Hide Preview" : "Show Preview"}
                        </button>
                        <div className="relative">
                            <input
                                type="file"
                                id="ticker-upload"
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleImageUpload(e, 'ticker')}
                            />
                            <label
                                htmlFor="ticker-upload"
                                className="flex items-center gap-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-lg shadow-indigo-500/20"
                            >
                                <Upload className="w-4 h-4" /> Upload Images
                            </label>
                        </div>
                    </div>
                </div>

                {previewOpen && settings.tickerImages.length > 0 && (
                    <div className="mb-8 p-4 bg-black/20 rounded-xl border border-white/5 overflow-hidden">
                        <div className="flex gap-4 animate-scroll whitespace-nowrap">
                            {[...settings.tickerImages, ...settings.tickerImages].map((img, i) => (
                                <div key={i} className="relative w-64 h-40 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 bg-slate-950">
                                    <Image src={img.url} fill sizes="256px" className="object-cover" alt="Preview" unoptimized />
                                    {(img.title || img.subtitle) && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                            {img.title && <p className="text-white font-medium text-sm">{img.title}</p>}
                                            {img.subtitle && <p className="text-slate-300 text-xs">{img.subtitle}</p>}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <style jsx>{`
                            .animate-scroll {
                                animation: scroll 30s linear infinite;
                            }
                            @keyframes scroll {
                                0% { transform: translateX(0); }
                                100% { transform: translateX(-50%); }
                            }
                        `}</style>
                    </div>
                )}

                <div className="space-y-4">
                    {settings.tickerImages.map((img, index) => (
                        <motion.div
                            key={index}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4 p-4 rounded-xl bg-slate-950/30 border border-white/5 group"
                        >
                            <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 bg-slate-950">
                                {img.url ? (
                                    <Image
                                        src={img.url}
                                        alt="Carousel"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500 text-xs">No Image</div>
                                )}
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10 hover:bg-red-600"
                                    title="Remove Image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>

                            <div className="flex-1 grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-500">Image Title</label>
                                    <input
                                        type="text"
                                        value={img.title || ''}
                                        onChange={(e) => handleCarouselImageChange(index, 'title', e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/50"
                                        placeholder="e.g. Community Gathering"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-500">Image Subtitle</label>
                                    <input
                                        type="text"
                                        value={img.subtitle || ''}
                                        onChange={(e) => handleCarouselImageChange(index, 'subtitle', e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/50"
                                        placeholder="e.g. Monthly meetup for all members"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 self-center">
                                <button
                                    onClick={() => moveImage(index, 'up')}
                                    disabled={index === 0}
                                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded disabled:opacity-30 text-white"
                                >
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => moveImage(index, 'down')}
                                    disabled={index === settings.tickerImages.length - 1}
                                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded disabled:opacity-30 text-white"
                                >
                                    <ArrowDown className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {settings.tickerImages.length === 0 && (
                        <div className="text-center py-12 text-slate-500 italic bg-slate-950/20 rounded-xl border border-dashed border-white/10">
                            No carousel images uploaded. Click &quot;Upload Images&quot; to add photos.
                        </div>
                    )}
                </div>
            </section>

            {/* Community Gallery Section */}
            <section className={`glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl transition-all ${!settings.showCommunityGallery ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Community Gallery Section</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400">{settings.showCommunityGallery ? 'Visible' : 'Hidden'}</span>
                        <button
                            onClick={() => setSettings({ ...settings, showCommunityGallery: !settings.showCommunityGallery })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.showCommunityGallery ? 'bg-indigo-600' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.showCommunityGallery ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 mb-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Section Title</label>
                        <input
                            type="text"
                            value={settings.galleryTitle || ''}
                            onChange={(e) => setSettings({ ...settings, galleryTitle: e.target.value })}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                            placeholder="e.g. Community Gallery"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Section Subtitle</label>
                        <input
                            type="text"
                            value={settings.gallerySubtitle || ''}
                            onChange={(e) => setSettings({ ...settings, gallerySubtitle: e.target.value })}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                            placeholder="Subtitle text..."
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-white">Gallery Images</h3>
                    <div className="relative">
                        <input
                            type="file"
                            id="gallery-upload"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleImageUpload(e, 'gallery')}
                        />
                        <label
                            htmlFor="gallery-upload"
                            className="flex items-center gap-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            <Upload className="w-4 h-4" /> Upload Images
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {settings.galleryImages.map((img, index) => (
                        <motion.div
                            key={index}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative aspect-square bg-slate-950 rounded-lg overflow-hidden border border-white/10"
                        >
                            {img.url ? (
                                <Image
                                    src={img.url}
                                    alt="Gallery"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500 text-xs">No Image</div>
                            )}
                            <button
                                onClick={() => removeGalleryImage(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10 hover:bg-red-600"
                                title="Remove Image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </motion.div>
                    ))}
                </div>

                {settings.galleryImages.length === 0 && (
                    <div className="text-center py-12 text-slate-500 italic bg-slate-950/20 rounded-xl border border-dashed border-white/10">
                        No gallery images uploaded. Click &quot;Upload Images&quot; to add photos.
                    </div>
                )}
            </section>

            {/* Upcoming Events Section */}
            <section className={`glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl transition-all ${!settings.showUpcomingEvents ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Upcoming Events Section</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400">{settings.showUpcomingEvents ? 'Visible' : 'Hidden'}</span>
                        <button
                            onClick={() => setSettings({ ...settings, showUpcomingEvents: !settings.showUpcomingEvents })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.showUpcomingEvents ? 'bg-indigo-600' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.showUpcomingEvents ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Section Title</label>
                        <input
                            type="text"
                            value={settings.upcomingEventsTitle || ''}
                            onChange={(e) => setSettings({ ...settings, upcomingEventsTitle: e.target.value })}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                            placeholder="e.g. Upcoming Events"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Section Subtitle</label>
                        <input
                            type="text"
                            value={settings.upcomingEventsSubtitle || ''}
                            onChange={(e) => setSettings({ ...settings, upcomingEventsSubtitle: e.target.value })}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                            placeholder="Subtitle text..."
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-lg font-medium text-white mb-4">Default Events Preview</h3>
                    <p className="text-sm text-slate-400 mb-6">These events will show on the home page if no real events are added to the database.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(settings.defaultEvents || []).map((event, i) => (
                            <div key={i} className="bg-slate-950/30 border border-white/5 rounded-xl overflow-hidden group">
                                <div className="aspect-video relative">
                                    <Image
                                        src={event.image || '/event-placeholder.png'}
                                        alt={event.title}
                                        fill
                                        className="object-cover opacity-50"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-black/40" />
                                    <div className="absolute top-2 right-2 bg-indigo-600/50 text-[10px] text-white px-2 py-1 rounded-full backdrop-blur-sm">DEFAULT</div>
                                </div>
                                <div className="p-4">
                                    <h4 className="text-white font-bold text-sm line-clamp-1">{event.title}</h4>
                                    <p className="text-slate-400 text-xs mt-1 line-clamp-2">{event.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
