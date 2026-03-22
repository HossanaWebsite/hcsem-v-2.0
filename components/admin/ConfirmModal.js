import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', isDanger = true }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10 bg-slate-900 shadow-2xl relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
                
                <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-xl ${isDanger ? 'bg-red-500/10 text-red-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                        <AlertTriangle size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                </div>
                
                <p className="text-slate-300 mb-8 leading-relaxed">
                    {message}
                </p>
                
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-5 py-2.5 rounded-xl font-medium text-white shadow-lg transition-all ${
                            isDanger 
                            ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' 
                            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
