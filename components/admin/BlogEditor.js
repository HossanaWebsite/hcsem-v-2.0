'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Image as ImageIcon, Type, Columns, Save, ArrowUp, ArrowDown, Grid3x3, Columns3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlogEditor({ initialData = {}, onSave }) {
    const [title, setTitle] = useState(initialData.title || '');
    const [slug, setSlug] = useState(initialData.slug || '');
    const [summary, setSummary] = useState(initialData.summary || '');
    const [coverImage, setCoverImage] = useState(initialData.coverImage || '');
    const [blocks, setBlocks] = useState(initialData.blocks || []);
    const [isSaving, setIsSaving] = useState(false);

    const addBlock = (type) => {
        const newBlock = {
            type,
            content: getDefaultContent(type),
            id: Date.now(),
        };
        setBlocks([...blocks, newBlock]);
    };

    const getDefaultContent = (type) => {
        switch (type) {
            case 'text':
                return '';
            case 'image':
                return '';
            case 'split':
                return { text: '', image: '' };
            case 'parallel-text':
                return { left: '', right: '' };
            case 'parallel-images':
                return { left: '', right: '' };
            case 'triple':
                return { left: '', center: '', right: '' };
            default:
                return '';
        }
    };

    const updateBlock = (index, content) => {
        const newBlocks = [...blocks];
        newBlocks[index].content = content;
        setBlocks(newBlocks);
    };

    const removeBlock = (index) => {
        setBlocks(blocks.filter((_, i) => i !== index));
    };

    const moveBlock = (index, direction) => {
        if (direction === 'up' && index > 0) {
            const newBlocks = [...blocks];
            [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
            setBlocks(newBlocks);
        } else if (direction === 'down' && index < blocks.length - 1) {
            const newBlocks = [...blocks];
            [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
            setBlocks(newBlocks);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave({ title, slug, summary, coverImage, blocks });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-12 max-w-6xl mx-auto pb-32">
            {/* Blog Details */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 space-y-6"
            >
                <h2 className="text-2xl font-heading font-bold">Blog Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-background/50 border border-border rounded-lg p-3"
                            placeholder="Blog Title"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Slug</label>
                        <input
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full bg-background/50 border border-border rounded-lg p-3"
                            placeholder="blog-title-slug"
                        />
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-sm font-medium">Summary</label>
                    <textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-lg p-3 h-24"
                        placeholder="Brief summary..."
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-sm font-medium">Cover Image URL</label>
                    <input
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-lg p-3"
                        placeholder="https://..."
                    />
                </div>
            </motion.div>

            {/* Content Blocks */}
            <div className="space-y-6">
                <h2 className="text-2xl font-heading font-bold">Content Blocks</h2>
                <AnimatePresence>
                    {blocks.map((block, index) => (
                        <motion.div
                            key={block.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-card p-6 relative group"
                        >
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button onClick={() => moveBlock(index, 'up')} className="p-2 hover:bg-muted rounded-lg"><ArrowUp className="w-4 h-4" /></button>
                                <button onClick={() => moveBlock(index, 'down')} className="p-2 hover:bg-muted rounded-lg"><ArrowDown className="w-4 h-4" /></button>
                                <button onClick={() => removeBlock(index)} className="p-2 hover:bg-destructive/20 text-destructive rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </div>

                            <div className="mb-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">{block.type.replace('-', ' ')} Block</div>

                            {/* Single Text */}
                            {block.type === 'text' && (
                                <textarea
                                    value={block.content}
                                    onChange={(e) => updateBlock(index, e.target.value)}
                                    className="w-full bg-background/50 border border-border rounded-lg p-4 min-h-[180px]"
                                    placeholder="Write your paragraph here..."
                                />
                            )}

                            {/* Single Image */}
                            {block.type === 'image' && (
                                <div className="space-y-3">
                                    <input
                                        value={block.content}
                                        onChange={(e) => updateBlock(index, e.target.value)}
                                        className="w-full bg-background/50 border border-border rounded-lg p-3"
                                        placeholder="Image URL"
                                    />
                                    {block.content && (
                                        <div className="relative aspect-video rounded-lg overflow-hidden">
                                            <Image src={block.content} alt="Preview" fill sizes="(max-width: 1536px) 100vw, 1536px" className="object-cover" />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Text + Image Split */}
                            {block.type === 'split' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <textarea
                                        value={block.content.text}
                                        onChange={(e) => updateBlock(index, { ...block.content, text: e.target.value })}
                                        className="w-full bg-background/50 border border-border rounded-lg p-4 min-h-[200px]"
                                        placeholder="Text content..."
                                    />
                                    <div className="space-y-3">
                                        <input
                                            value={block.content.image}
                                            onChange={(e) => updateBlock(index, { ...block.content, image: e.target.value })}
                                            className="w-full bg-background/50 border border-border rounded-lg p-3"
                                            placeholder="Image URL"
                                        />
                                        {block.content.image && (
                                            <div className="relative h-48 rounded-lg overflow-hidden">
                                                <Image src={block.content.image} alt="Preview" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Parallel Text */}
                            {block.type === 'parallel-text' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs text-muted-foreground">Left Column</label>
                                        <textarea
                                            value={block.content.left}
                                            onChange={(e) => updateBlock(index, { ...block.content, left: e.target.value })}
                                            className="w-full bg-background/50 border border-border rounded-lg p-4 min-h-[180px]"
                                            placeholder="Left paragraph..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-muted-foreground">Right Column</label>
                                        <textarea
                                            value={block.content.right}
                                            onChange={(e) => updateBlock(index, { ...block.content, right: e.target.value })}
                                            className="w-full bg-background/50 border border-border rounded-lg p-4 min-h-[180px]"
                                            placeholder="Right paragraph..."
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Parallel Images */}
                            {block.type === 'parallel-images' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs text-muted-foreground">Left Image</label>
                                        <input
                                            value={block.content.left}
                                            onChange={(e) => updateBlock(index, { ...block.content, left: e.target.value })}
                                            className="w-full bg-background/50 border border-border rounded-lg p-3"
                                            placeholder="Left image URL"
                                        />
                                        {block.content.left && (
                                            <div className="relative h-48 rounded-lg overflow-hidden">
                                                <Image src={block.content.left} alt="Left" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs text-muted-foreground">Right Image</label>
                                        <input
                                            value={block.content.right}
                                            onChange={(e) => updateBlock(index, { ...block.content, right: e.target.value })}
                                            className="w-full bg-background/50 border border-border rounded-lg p-3"
                                            placeholder="Right image URL"
                                        />
                                        {block.content.right && (
                                            <div className="relative h-48 rounded-lg overflow-hidden">
                                                <Image src={block.content.right} alt="Right" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Triple Column */}
                            {block.type === 'triple' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <textarea
                                        value={block.content.left}
                                        onChange={(e) => updateBlock(index, { ...block.content, left: e.target.value })}
                                        className="w-full bg-background/50 border border-border rounded-lg p-4 min-h-[150px]"
                                        placeholder="Left..."
                                    />
                                    <textarea
                                        value={block.content.center}
                                        onChange={(e) => updateBlock(index, { ...block.content, center: e.target.value })}
                                        className="w-full bg-background/50 border border-border rounded-lg p-4 min-h-[150px]"
                                        placeholder="Center..."
                                    />
                                    <textarea
                                        value={block.content.right}
                                        onChange={(e) => updateBlock(index, { ...block.content, right: e.target.value })}
                                        className="w-full bg-background/50 border border-border rounded-lg p-4 min-h-[150px]"
                                        placeholder="Right..."
                                    />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Add Block Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-8 border-2 border-dashed border-border rounded-xl">
                    <button onClick={() => addBlock('text')} className="flex flex-col items-center gap-3 p-6 hover:bg-muted rounded-xl transition-colors">
                        <Type className="w-7 h-7" />
                        <span className="text-sm font-medium">Text</span>
                    </button>
                    <button onClick={() => addBlock('image')} className="flex flex-col items-center gap-3 p-6 hover:bg-muted rounded-xl transition-colors">
                        <ImageIcon className="w-7 h-7" />
                        <span className="text-sm font-medium">Image</span>
                    </button>
                    <button onClick={() => addBlock('split')} className="flex flex-col items-center gap-3 p-6 hover:bg-muted rounded-xl transition-colors">
                        <Columns className="w-7 h-7" />
                        <span className="text-sm font-medium">Text + Image</span>
                    </button>
                    <button onClick={() => addBlock('parallel-text')} className="flex flex-col items-center gap-3 p-6 hover:bg-muted rounded-xl transition-colors">
                        <Columns className="w-7 h-7" />
                        <span className="text-sm font-medium">2 Texts</span>
                    </button>
                    <button onClick={() => addBlock('parallel-images')} className="flex flex-col items-center gap-3 p-6 hover:bg-muted rounded-xl transition-colors">
                        <Grid3x3 className="w-7 h-7" />
                        <span className="text-sm font-medium">2 Images</span>
                    </button>
                    <button onClick={() => addBlock('triple')} className="flex flex-col items-center gap-3 p-6 hover:bg-muted rounded-xl transition-colors">
                        <Columns3 className="w-7 h-7" />
                        <span className="text-sm font-medium">3 Columns</span>
                    </button>
                </div>
            </div>

            {/* Save Button */}
            <motion.div
                className="fixed bottom-8 right-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-primary text-primary-foreground px-8 py-4 rounded-full shadow-2xl hover:shadow-primary/25 transition-all flex items-center gap-3 font-bold text-lg"
                >
                    <Save className="w-6 h-6" />
                    {isSaving ? 'Saving...' : 'Save Blog'}
                </button>
            </motion.div>
        </div>
    );
}
