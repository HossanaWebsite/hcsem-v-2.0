'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, Loader2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function EventsContentPage() {
    const defaults = {
        eventsPageTitle: "Events",
        eventsPageSubtitle: "Join us in our upcoming gatherings and celebrations",
        eventsPageImage: "",
        eventsVideoTitle: "Experience Our Events",
        eventsVideoSubtitle: "Watch how we celebrate culture, unity, and community together",
        eventsGalleryTitle: "Event Gallery",
        eventsGallerySubtitle: "Moments captured from our community events and celebrations",
        eventsGalleryImages: [
            { url: "/folder/2.jpg" },
            { url: "/folder/3.jpg" },
            { url: "/folder/9.jpg" },
            { url: "/folder/10.jpg" },
            { url: "/folder/13.jpg" },
            { url: "/folder/16.jpg" }
        ],
        eventsVideoUrl: "/folder/1.mp4",
        walkthroughTitle: "Explore Our Community",
        walkthroughSubtitle: "Take a journey through our community spaces and discover what we offer",
        walkthroughItems: [
            {
                name: "Welcome Hall",
                title: "Community Gathering Space",
                description: "Our main gathering area where members connect and celebrate together.",
                image: "/folder/2.jpg",
                iconName: "Home",
                features: ["Monthly meetups", "Cultural celebrations", "Networking events"],
                order: 0
            },
            {
                name: "Events Room",
                title: "Event Planning Center",
                description: "Where we organize and coordinate all our community events and activities.",
                image: "/folder/3.jpg",
                iconName: "Calendar",
                features: ["Festival planning", "Workshop coordination", "Event management"],
                order: 1
            },
            {
                name: "Community Hub",
                title: "Member Services",
                description: "Support and resources for all community members.",
                image: "/folder/9.jpg",
                iconName: "Users",
                features: ["New member orientation", "Resource sharing", "Community support"],
                order: 2
            },
            {
                name: "Cultural Center",
                title: "Heritage Preservation",
                description: "Dedicated to preserving and celebrating our rich Ethiopian culture.",
                image: "/folder/10.jpg",
                iconName: "Heart",
                features: ["Language classes", "Traditional arts", "Cultural education"],
                order: 3
            },
            {
                name: "Youth Wing",
                title: "Next Generation Programs",
                description: "Empowering our youth through education and mentorship.",
                image: "/folder/13.jpg",
                iconName: "Sparkles",
                features: ["Mentorship programs", "Educational workshops", "Youth leadership"],
                order: 4
            },
            {
                name: "Achievement Hall",
                title: "Success Stories",
                description: "Celebrating the accomplishments of our community members.",
                image: "/folder/16.jpg",
                iconName: "Award",
                features: ["Member achievements", "Community impact", "Recognition programs"],
                order: 5
            }
        ]
    };

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        eventsPageTitle: defaults.eventsPageTitle,
        eventsPageSubtitle: defaults.eventsPageSubtitle,
        eventsPageImage: defaults.eventsPageImage,
        eventsVideoTitle: defaults.eventsVideoTitle,
        eventsVideoSubtitle: defaults.eventsVideoSubtitle,
        eventsGalleryTitle: defaults.eventsGalleryTitle,
        eventsGallerySubtitle: defaults.eventsGallerySubtitle,
        eventsGalleryImages: defaults.eventsGalleryImages,
        eventsVideoUrl: defaults.eventsVideoUrl,
        walkthroughTitle: defaults.walkthroughTitle,
        walkthroughSubtitle: defaults.walkthroughSubtitle,
        walkthroughItems: defaults.walkthroughItems,
        showEventsHeader: true,
        showEventsVideo: true,
        showEventsGallery: true,
        showWalkthrough: true
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
                    ...data,
                    eventsPageTitle: data.eventsPageTitle || defaults.eventsPageTitle,
                    eventsPageSubtitle: data.eventsPageSubtitle || defaults.eventsPageSubtitle,
                    eventsPageImage: data.eventsPageImage || defaults.eventsPageImage,
                    eventsVideoTitle: data.eventsVideoTitle || defaults.eventsVideoTitle,
                    eventsVideoSubtitle: data.eventsVideoSubtitle || defaults.eventsVideoSubtitle,
                    eventsGalleryTitle: data.eventsGalleryTitle || defaults.eventsGalleryTitle,
                    eventsGallerySubtitle: data.eventsGallerySubtitle || defaults.eventsGallerySubtitle,
                    eventsGalleryImages: (data.eventsGalleryImages && data.eventsGalleryImages.length > 0) ? data.eventsGalleryImages : defaults.eventsGalleryImages,
                    eventsVideoUrl: data.eventsVideoUrl || defaults.eventsVideoUrl,
                    walkthroughTitle: data.walkthroughTitle || defaults.walkthroughTitle,
                    walkthroughSubtitle: data.walkthroughSubtitle || defaults.walkthroughSubtitle,
                    walkthroughItems: (data.walkthroughItems && data.walkthroughItems.length > 0) ? data.walkthroughItems : defaults.walkthroughItems,
                    showEventsHeader: data.showEventsHeader !== undefined ? data.showEventsHeader : true,
                    showEventsVideo: data.showEventsVideo !== undefined ? data.showEventsVideo : true,
                    showEventsGallery: data.showEventsGallery !== undefined ? data.showEventsGallery : true,
                    showWalkthrough: data.showWalkthrough !== undefined ? data.showWalkthrough : true
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
                toast.success('Events page settings saved successfully');
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

    const handleImageUpload = async (e, type = 'gallery') => {
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
                    const data = await res.json();
                    if (type === 'header') {
                        setSettings(prev => ({ ...prev, eventsPageImage: data.url }));
                        successCount++;
                        break; // Only one header image
                    } else if (type === 'gallery') {
                        setSettings(prev => ({
                            ...prev,
                            eventsGalleryImages: [
                                ...prev.eventsGalleryImages,
                                { url: data.url, order: prev.eventsGalleryImages.length }
                            ]
                        }));
                        successCount++;
                    } else if (type.startsWith('walkthrough-')) {
                        const index = parseInt(type.split('-')[1]);
                        const newItems = [...settings.walkthroughItems];
                        newItems[index].image = data.url;
                        setSettings(prev => ({ ...prev, walkthroughItems: newItems }));
                        successCount++;
                        break;
                    }
                }
            }

            if (successCount > 0) {
                toast.update(toastId, { render: `${successCount} image(s) uploaded!`, type: "success", isLoading: false, autoClose: 3000 });
            } else {
                toast.update(toastId, { render: "Upload failed", type: "error", isLoading: false, autoClose: 3000 });
            }

        } catch (error) {
            console.error(error);
            toast.update(toastId, { render: "Error uploading", type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    const removeGalleryImage = (index) => {
        const newImages = settings.eventsGalleryImages.filter((_, i) => i !== index);
        setSettings({ ...settings, eventsGalleryImages: newImages });
    };

    const handleWalkthroughChange = (index, field, value) => {
        const newItems = [...settings.walkthroughItems];
        newItems[index][field] = value;
        setSettings({ ...settings, walkthroughItems: newItems });
    };

    const handleWalkthroughFeatureChange = (roomIndex, featureIndex, value) => {
        const newItems = [...settings.walkthroughItems];
        newItems[roomIndex].features[featureIndex] = value;
        setSettings({ ...settings, walkthroughItems: newItems });
    };

    const addWalkthroughFeature = (roomIndex) => {
        const newItems = [...settings.walkthroughItems];
        newItems[roomIndex].features.push('');
        setSettings({ ...settings, walkthroughItems: newItems });
    };

    const removeWalkthroughFeature = (roomIndex, featureIndex) => {
        const newItems = [...settings.walkthroughItems];
        newItems[roomIndex].features = newItems[roomIndex].features.filter((_, i) => i !== featureIndex);
        setSettings({ ...settings, walkthroughItems: newItems });
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
                    <h1 className="text-3xl font-bold font-heading text-white">Events Page Content</h1>
                    <p className="text-slate-400">Manage events page appearance</p>
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

            {/* Page Header Section */}
            <section className={`glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl transition-all ${!settings.showEventsHeader ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Page Header</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400">{settings.showEventsHeader ? 'Visible' : 'Hidden'}</span>
                        <button
                            onClick={() => setSettings({ ...settings, showEventsHeader: !settings.showEventsHeader })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.showEventsHeader ? 'bg-indigo-600' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.showEventsHeader ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Page Title</label>
                            <input
                                type="text"
                                value={settings.eventsPageTitle}
                                onChange={(e) => setSettings({ ...settings, eventsPageTitle: e.target.value })}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                                placeholder="e.g. Events"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Page Subtitle</label>
                            <textarea
                                value={settings.eventsPageSubtitle}
                                onChange={(e) => setSettings({ ...settings, eventsPageSubtitle: e.target.value })}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all h-[80px] min-h-[50px] resize-y"
                                placeholder="Subtitle text..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Header Background Image</label>
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-slate-950 group">
                            {settings.eventsPageImage && settings.eventsPageImage.trim() !== '' ? (
                                <>
                                    <Image src={settings.eventsPageImage} alt="Events Header" fill className="object-cover" />
                                    <button
                                        onClick={() => setSettings({ ...settings, eventsPageImage: '' })}
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
                            <div className={`absolute inset-0 bg-black/50 transition-opacity flex items-center justify-center ${settings.eventsPageImage ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                                <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors border border-white/10 flex items-center gap-2">
                                    <Upload className="w-4 h-4" /> {settings.eventsPageImage ? 'Change Image' : 'Upload Image'}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'header')} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience Our Events Section */}
            <section className={`glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl transition-all ${!settings.showEventsVideo ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Experience Our Events Section</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400">{settings.showEventsVideo ? 'Visible' : 'Hidden'}</span>
                        <button
                            onClick={() => setSettings({ ...settings, showEventsVideo: !settings.showEventsVideo })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.showEventsVideo ? 'bg-indigo-600' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.showEventsVideo ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Section Title</label>
                        <input
                            type="text"
                            value={settings.eventsVideoTitle || ''}
                            onChange={(e) => setSettings({ ...settings, eventsVideoTitle: e.target.value })}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                            placeholder="e.g. Experience Our Events"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Section Subtitle</label>
                        <input
                            type="text"
                            value={settings.eventsVideoSubtitle || ''}
                            onChange={(e) => setSettings({ ...settings, eventsVideoSubtitle: e.target.value })}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                            placeholder="Subtitle text..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Video URL (MP4 or YouTube/Vimeo Link)</label>
                        <input
                            type="text"
                            value={settings.eventsVideoUrl || ''}
                            onChange={(e) => setSettings({ ...settings, eventsVideoUrl: e.target.value })}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all font-mono text-sm"
                            placeholder="/folder/1.mp4"
                        />
                        <p className="text-xs text-slate-500">You can use a local path like /folder/1.mp4 or a full URL.</p>
                    </div>
                </div>

                <div className="space-y-2 mt-6">
                    <label className="text-sm font-medium text-slate-300">Video Preview</label>
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-slate-950 flex items-center justify-center">
                        {settings.eventsVideoUrl ? (
                            <video
                                key={settings.eventsVideoUrl}
                                src={settings.eventsVideoUrl}
                                className="w-full h-full object-cover"
                                controls
                                muted
                            />
                        ) : (
                            <div className="text-slate-600 flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 opacity-20" />
                                <span className="text-sm">No video source</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Event Gallery Section */}
            <section className={`glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl transition-all ${!settings.showEventsGallery ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Event Gallery Section</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400">{settings.showEventsGallery ? 'Visible' : 'Hidden'}</span>
                        <button
                            onClick={() => setSettings({ ...settings, showEventsGallery: !settings.showEventsGallery })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.showEventsGallery ? 'bg-indigo-600' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.showEventsGallery ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Section Title</label>
                        <input
                            type="text"
                            value={settings.eventsGalleryTitle || ''}
                            onChange={(e) => setSettings({ ...settings, eventsGalleryTitle: e.target.value })}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                            placeholder="e.g. Event Gallery"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Section Subtitle</label>
                        <input
                            type="text"
                            value={settings.eventsGallerySubtitle || ''}
                            onChange={(e) => setSettings({ ...settings, eventsGallerySubtitle: e.target.value })}
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
                            id="events-gallery-upload"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleImageUpload(e, 'gallery')}
                        />
                        <label
                            htmlFor="events-gallery-upload"
                            className="flex items-center gap-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            <Upload className="w-4 h-4" /> Upload Images
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {settings.eventsGalleryImages.map((img, index) => (
                        <motion.div
                            key={index}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative aspect-square bg-slate-950 rounded-lg overflow-hidden border border-white/10"
                        >
                            <Image
                                src={img.url}
                                alt="Gallery"
                                fill
                                className="object-cover"
                            />
                            <button
                                onClick={() => removeGalleryImage(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10 hover:bg-red-600"
                                title="Remove Image"
                            >
                                <X className="w-3 h-3" strokeWidth={3} />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {settings.eventsGalleryImages.length === 0 && (
                    <div className="text-center py-12 text-slate-500 italic bg-slate-950/20 rounded-xl border border-dashed border-white/10">
                        No gallery images uploaded. Click "Upload Images" to add photos.
                    </div>
                )}
            </section>

            {/* Explore Our Community (Room Walkthrough) Section */}
            <section className={`glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl transition-all ${!settings.showWalkthrough ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Explore Our Community Section</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400">{settings.showWalkthrough ? 'Visible' : 'Hidden'}</span>
                        <button
                            onClick={() => setSettings({ ...settings, showWalkthrough: !settings.showWalkthrough })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.showWalkthrough ? 'bg-indigo-600' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.showWalkthrough ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Section Title</label>
                        <input
                            type="text"
                            value={settings.walkthroughTitle || ''}
                            onChange={(e) => setSettings({ ...settings, walkthroughTitle: e.target.value })}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                            placeholder="e.g. Explore Our Community"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Section Subtitle</label>
                        <input
                            type="text"
                            value={settings.walkthroughSubtitle || ''}
                            onChange={(e) => setSettings({ ...settings, walkthroughSubtitle: e.target.value })}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                            placeholder="Subtitle text..."
                        />
                    </div>
                </div>

                <div className="space-y-8">
                    <h3 className="text-lg font-medium text-white border-b border-white/5 pb-2">Walkthrough Rooms</h3>
                    {settings.walkthroughItems.map((room, roomIdx) => (
                        <div key={roomIdx} className="bg-slate-950/30 rounded-xl p-6 border border-white/5 space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-indigo-400 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs text-indigo-300">{roomIdx + 1}</span>
                                    {room.name || `Room ${roomIdx + 1}`}
                                </h4>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Room Image */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Room Image</label>
                                    <div className="relative aspect-video rounded-lg overflow-hidden border border-white/5 bg-slate-900 group">
                                        {room.image ? (
                                            <Image src={room.image} alt={room.name} fill className="object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-1">
                                                <Upload className="w-6 h-6 opacity-20" />
                                                <span className="text-xs">No Image</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg backdrop-blur-sm text-xs border border-white/10 flex items-center gap-2">
                                                <Upload className="w-3 h-3" /> Change
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, `walkthrough-${roomIdx}`)} />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Room Details */}
                                <div className="lg:col-span-2 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Tab Name</label>
                                            <input
                                                type="text"
                                                value={room.name}
                                                onChange={(e) => handleWalkthroughChange(roomIdx, 'name', e.target.value)}
                                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Icon Name (Lucide)</label>
                                            <input
                                                type="text"
                                                value={room.iconName}
                                                onChange={(e) => handleWalkthroughChange(roomIdx, 'iconName', e.target.value)}
                                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 font-mono"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Card Title</label>
                                        <input
                                            type="text"
                                            value={room.title}
                                            onChange={(e) => handleWalkthroughChange(roomIdx, 'title', e.target.value)}
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Description</label>
                                        <textarea
                                            value={room.description}
                                            onChange={(e) => handleWalkthroughChange(roomIdx, 'description', e.target.value)}
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 h-20 resize-none"
                                        />
                                    </div>

                                    {/* Features / Tags */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Features / Tags</label>
                                            <button
                                                onClick={() => addWalkthroughFeature(roomIdx)}
                                                className="text-indigo-400 hover:text-indigo-300 text-xs font-bold"
                                            >
                                                + Add Tag
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {room.features.map((feature, featureIdx) => (
                                                <div key={featureIdx} className="flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1">
                                                    <input
                                                        type="text"
                                                        value={feature}
                                                        onChange={(e) => handleWalkthroughFeatureChange(roomIdx, featureIdx, e.target.value)}
                                                        className="bg-transparent border-none text-xs text-indigo-100 focus:outline-none w-24"
                                                    />
                                                    <button
                                                        onClick={() => removeWalkthroughFeature(roomIdx, featureIdx)}
                                                        className="text-indigo-400 hover:text-red-400"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
