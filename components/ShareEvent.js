'use client';

import { useState, useEffect } from 'react';
import { Share2, Facebook, MessageCircle, Send, Twitter, Link as LinkIcon, Check } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ShareEvent({ title, description }) {
    const [url, setUrl] = useState('');
    const [copied, setCopied] = useState(false);
    const [canNativeShare, setCanNativeShare] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setUrl(window.location.href);
            if (navigator && navigator.share) {
                setCanNativeShare(true);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: description,
                    url: url
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied to clipboard!", { position: 'bottom-center' });
        setTimeout(() => setCopied(false), 2000);
    };

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    if (!url) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-8 mt-6 border-t border-slate-200 dark:border-white/10 w-full">
            <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <Share2 size={18} /> Share Event:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" title="Share to Facebook" className="w-10 h-10 rounded-full bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-colors">
                    <Facebook size={18} />
                </a>
                <a href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" title="Share to Telegram" className="w-10 h-10 rounded-full bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc] hover:text-white flex items-center justify-center transition-colors">
                    <Send size={18} className="-ml-0.5" />
                </a>
                <a href={`https://wa.me/?text=${encodedTitle}%20-\%20${encodedUrl}`} target="_blank" rel="noopener noreferrer" title="Share to WhatsApp" className="w-10 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors">
                    <MessageCircle size={18} />
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" title="Share to X" className="w-10 h-10 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white flex items-center justify-center transition-colors">
                    <Twitter size={18} />
                </a>
                <button onClick={copyToClipboard} title="Copy Link" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-white/20 flex items-center justify-center transition-colors">
                    {copied ? <Check size={18} className="text-green-500" /> : <LinkIcon size={18} />}
                </button>
            </div>
            
            {canNativeShare && (
                <button onClick={handleNativeShare} className="sm:ml-2 sm:border-l sm:border-slate-300 dark:sm:border-white/10 sm:pl-6 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline hidden sm:flex items-center gap-2">
                    More Options...
                </button>
            )}
        </div>
    );
}
