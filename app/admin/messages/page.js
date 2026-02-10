'use client';

import { useState, useEffect } from 'react';
import { Mail, Trash2, Eye } from 'lucide-react';

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Messages</h1>

            {messages.length === 0 ? (
                <div className="glass-card p-12 text-center text-muted-foreground">
                    <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No messages yet</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {messages.map(msg => (
                        <div key={msg._id} className="glass-card p-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold">{msg.subject}</h3>
                                <p className="text-sm text-muted-foreground">{msg.email}</p>
                            </div>
                            <button className="p-2 hover:bg-muted rounded-lg">
                                <Eye className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
