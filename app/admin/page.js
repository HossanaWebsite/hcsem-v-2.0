'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Users, FileText, Calendar, MessageSquare } from 'lucide-react';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function DashboardPage() {
    const [stats, setStats] = useState({ users: 542, blogs: 24, events: 12, messages: 89 }); // Using mock values for visual demo if API fails
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/dashboard');
                const data = await res.json();
                if (data.success) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error("Failed to load stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Members', value: stats.users, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Published Blogs', value: stats.blogs, icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Upcoming Events', value: stats.events, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { label: 'Unread Messages', value: stats.messages, icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ];

    const chartOptions = {
        chart: {
            id: "visitor-growth",
            toolbar: { show: false },
            fontFamily: 'inherit',
            background: 'transparent',
            sparkline: { enabled: false },
        },
        stroke: {
            curve: 'smooth',
            width: 3,
            colors: ['#465fff']
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [20, 100, 100, 100]
            }
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: { show: false },
        grid: {
            borderColor: 'rgba(255,255,255,0.05)',
            strokeDashArray: 4,
        },
        theme: { mode: 'dark' }
    };

    const chartSeries = [{
        name: "Visitors",
        data: [31, 40, 28, 51, 42, 109, 100, 120, 150, 180, 210, 250]
    }];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
                <p className="text-gray-500 font-medium animate-pulse">Initializing Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="glass-card p-6 flex items-center justify-between group hover:border-brand-500/50 transition-all duration-300">
                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{stat.label}</p>
                            <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{stat.value.toLocaleString()}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <stat.icon size={22} strokeWidth={2.5} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Traffic Chart */}
                <div className="lg:col-span-2 glass-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Audience Growth</h3>
                            <p className="text-sm text-gray-500">+12.5% from last month</p>
                        </div>
                        <select className="bg-gray-100 dark:bg-gray-900 border-none rounded-lg text-sm font-medium px-3 py-2 outline-none cursor-pointer">
                            <option>Last 12 Months</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-[350px] w-full">
                        <Chart options={chartOptions} series={chartSeries} type="area" width="100%" height="100%" />
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="glass-card p-8 flex flex-col">
                    <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Recent Activity</h3>
                    <div className="space-y-6 flex-1">
                        {[
                            { user: 'Amanuel K.', action: 'published a new blog', time: '2 mins ago', icon: FileText, color: 'text-emerald-500' },
                            { user: 'Hadiya Admin', action: 'added Event 2024', time: '1 hour ago', icon: Calendar, color: 'text-purple-500' },
                            { user: 'System', action: 'backup completed', time: '5 hours ago', icon: Users, color: 'text-blue-500' },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <div className={`mt-1 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center ${item.color}`}>
                                    <item.icon size={14} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                                        <span className="font-bold">{item.user}</span> {item.action}
                                    </p>
                                    <span className="text-xs text-gray-500">{item.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="mt-8 w-full py-3 bg-gray-100 dark:bg-gray-900 rounded-xl text-sm font-bold hover:bg-brand-500 hover:text-white transition-all">
                        View Audit Logs
                    </button>
                </div>
            </div>
        </div>
    );
}
