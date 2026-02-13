import React, { useEffect, useState } from 'react';
import { fetchRecycleBin, restoreRecord, permanentDelete } from '../services/api';
import { Trash2, RefreshCw, Trash, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const RecycleBin = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            const data = await fetchRecycleBin();
            setItems(data);
        } catch (error) {
            toast.error('Failed to load deleted items');
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (id, type) => {
        try {
            await restoreRecord(id, type);
            setItems(items.filter(i => i._id !== id));
            toast.success(`${type} restored`);
        } catch (error) {
            toast.error('Restore failed');
        }
    };

    const handlePermanentDelete = async (id, type) => {
        if (!window.confirm('Are you sure? This cannot be undone.')) return;
        try {
            await permanentDelete(id, type);
            setItems(items.filter(i => i._id !== id));
            toast.success('Permanently deleted');
        } catch (error) {
            toast.error('Deletion failed');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Trash2 className="text-red-500" />
                    Recycle Bin
                </h1>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-100 dark:border-yellow-900/30 flex items-center gap-3">
                    <AlertTriangle className="text-yellow-600" size={20} />
                    <p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
                        Items in the recycle bin will be permanently deleted after 30 days (simulation).
                    </p>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Name/Title</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Deleted Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {items.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                    {item.name || item.title}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-[10px] font-bold uppercase">
                                        {item.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleRestore(item._id, item.type)}
                                        className="p-1 px-3 text-xs font-semibold text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded transition-colors inline-flex items-center gap-1"
                                    >
                                        <RefreshCw size={12} />
                                        Restore
                                    </button>
                                    <button
                                        onClick={() => handlePermanentDelete(item._id, item.type)}
                                        className="p-1 px-3 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors inline-flex items-center gap-1"
                                    >
                                        <Trash size={12} />
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {items.length === 0 && (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                        The recycle bin is empty.
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecycleBin;
