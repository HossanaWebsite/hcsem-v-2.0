'use client';

import React, { useState, useEffect } from 'react';

export default function LogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/logs?limit=50')
            .then(res => res.json())
            .then(data => {
                if (data.success) setLogs(data.data);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading logs...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Audit Logs</h2>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">Timestamp</th>
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">Action</th>
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">Details</th>
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No logs found.</td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                            {log.userId?.fullName || 'System/Guest'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={JSON.stringify(log.details)}>
                                            {JSON.stringify(log.details)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {log.ipAddress}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
