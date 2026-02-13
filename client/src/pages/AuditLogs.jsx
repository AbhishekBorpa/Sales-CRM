import React, { useEffect, useState } from 'react';
import { fetchAuditLogs, fetchUsers } from '../services/api';
import { Shield, Clock, Search, Filter } from 'lucide-react';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            const data = await fetchAuditLogs();
            setLogs(data);
        } catch (error) {
            console.error(error);
        }
    };

    const filteredLogs = logs.filter(log =>
        log.entity.toLowerCase().includes(filter.toLowerCase()) ||
        log.details.toLowerCase().includes(filter.toLowerCase()) ||
        log.changedBy.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="text-brand-600" />
                Audit Trail
            </h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-brand-500"
                        />
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Action</th>
                            <th className="px-6 py-4">Entity</th>
                            <th className="px-6 py-4">Details</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredLogs.map((log) => (
                            <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="px-6 py-4">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${log.action === 'Create' ? 'bg-green-100 text-green-700' :
                                            log.action === 'Delete' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                        }`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                    {log.entity}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    {log.details}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                    {log.changedBy}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-2">
                                    <Clock size={14} />
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredLogs.length === 0 && (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        No logs found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditLogs;
