import React, { useEffect, useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Search, Filter, Trash2, Download, Globe, Phone, Building, MoreVertical, Plus, Pencil } from 'lucide-react';
import Modal from '../components/Modal';
import { toast } from 'sonner';
import clsx from 'clsx';
import { fetchAccounts, createAccount, updateAccount, deleteAccount } from '../services/api';

const Accounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filterText, setFilterText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAccount, setNewAccount] = useState({ name: '', industry: '', website: '', phone: '' });
    const [selectedAccounts, setSelectedAccounts] = useState([]);
    const [industryFilter, setIndustryFilter] = useState('All');
    const [showFilters, setShowFilters] = useState(false);
    const [editingAccountId, setEditingAccountId] = useState(null);

    useEffect(() => {
        fetchAccounts().then(setAccounts).catch(console.error);
    }, []);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm('Move this account to Recycle Bin?')) return;
        try {
            await deleteAccount(id);
            setAccounts(accounts.filter(a => a._id !== id));
            toast.success('Account moved to Recycle Bin');
        } catch (error) {
            toast.error('Failed to delete account');
        }
    };

    const handleRowClick = (account) => {
        // Navigate to account detail (to be implemented)
        window.location.href = `/accounts/${account._id}`;
    };

    const toggleAccountSelection = (id) => {
        setSelectedAccounts(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedAccounts.length === sortedAndFilteredAccounts.length) {
            setSelectedAccounts([]);
        } else {
            setSelectedAccounts(sortedAndFilteredAccounts.map(a => a._id));
        }
    };

    const exportToCSV = () => {
        const headers = ['Name', 'Industry', 'Website', 'Phone'];
        const data = sortedAndFilteredAccounts.map(a => [
            a.name, a.industry || '', a.website || '', a.phone || ''
        ]);

        const csvContent = [headers, ...data]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accounts-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast.success(`Exported ${sortedAndFilteredAccounts.length} accounts to CSV`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAccountId) {
                const updated = await updateAccount(editingAccountId, newAccount);
                setAccounts(accounts.map(a => a._id === editingAccountId ? updated : a));
                toast.success('Account updated successfully');
            } else {
                const created = await createAccount(newAccount);
                setAccounts([created, ...accounts]);
                toast.success('Account created successfully');
            }
            setIsModalOpen(false);
            setEditingAccountId(null);
            setNewAccount({ name: '', industry: '', website: '', phone: '' });
        } catch (error) {
            toast.error(editingAccountId ? 'Failed to update account' : 'Failed to create account');
        }
    };

    const handleEdit = (e, account) => {
        e.stopPropagation();
        setEditingAccountId(account._id);
        setNewAccount({
            name: account.name,
            industry: account.industry || '',
            website: account.website || '',
            phone: account.phone || ''
        });
        setIsModalOpen(true);
    };

    const handleOpenCreateModal = () => {
        setEditingAccountId(null);
        setNewAccount({ name: '', industry: '', website: '', phone: '' });
        setIsModalOpen(true);
    };

    const sortedAndFilteredAccounts = useMemo(() => {
        let items = [...accounts];

        // Filter by text
        if (filterText) {
            const lower = filterText.toLowerCase();
            items = items.filter(item =>
                item.name.toLowerCase().includes(lower) ||
                (item.industry && item.industry.toLowerCase().includes(lower)) ||
                (item.website && item.website.toLowerCase().includes(lower))
            );
        }

        // Filter by industry
        if (industryFilter !== 'All') {
            items = items.filter(item => item.industry === industryFilter);
        }

        // Sort
        if (sortConfig.key) {
            items.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return items;
    }, [accounts, sortConfig, filterText, industryFilter]);

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return <ChevronDown size={14} className="text-gray-300" />;
        return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-brand-600" /> : <ChevronDown size={14} className="text-brand-600" />;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Accounts</h1>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search accounts..."
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-brand-500 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        <Filter size={16} />
                        Filters
                    </button>
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        <Download size={16} />
                        Export
                    </button>
                    <button
                        onClick={handleOpenCreateModal}
                        className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        New Account
                    </button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="max-w-xs">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Industry</label>
                        <select
                            value={industryFilter}
                            onChange={(e) => setIndustryFilter(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white text-sm"
                        >
                            <option value="All">All Industries</option>
                            <option value="Technology">Technology</option>
                            <option value="Finance">Finance</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Retail">Retail</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-4 py-4 w-12">
                                <input
                                    type="checkbox"
                                    checked={selectedAccounts.length === sortedAndFilteredAccounts.length && sortedAndFilteredAccounts.length > 0}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                                />
                            </th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleSort('name')}>
                                <div className="flex items-center gap-2">Name <SortIcon column="name" /></div>
                            </th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleSort('industry')}>
                                <div className="flex items-center gap-2">Industry <SortIcon column="industry" /></div>
                            </th>
                            <th className="px-6 py-4">Phone</th>
                            <th className="px-6 py-4">Website</th>
                            <th className="px-6 py-4 w-20">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {sortedAndFilteredAccounts.map((account) => (
                            <tr
                                key={account._id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                                onClick={() => handleRowClick(account)}
                            >
                                <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="checkbox"
                                        checked={selectedAccounts.includes(account._id)}
                                        onChange={() => toggleAccountSelection(account._id)}
                                        className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                                    />
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                    <div className="flex items-center gap-2">
                                        <Building size={16} className="text-gray-400" />
                                        {account.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                    {account.industry || '-'}
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                                    {account.phone ? (
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} />
                                            {account.phone}
                                        </div>
                                    ) : '-'}
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                                    {account.website ? (
                                        <a
                                            href={account.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-brand-600 hover:text-brand-700 hover:underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Globe size={14} />
                                            {account.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    ) : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => handleEdit(e, account)}
                                            className="text-gray-400 hover:text-blue-600 p-1 transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(e, account._id)}
                                            className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {sortedAndFilteredAccounts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No accounts found. Create one to get started.
                    </div>
                )}
            </div>

            {/* Create Account Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingAccountId(null);
                    setNewAccount({ name: '', industry: '', website: '', phone: '' });
                }}
                title={editingAccountId ? 'Edit Account' : 'Create New Account'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Account Name"
                        value={newAccount.name}
                        onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                    />
                    <select
                        value={newAccount.industry}
                        onChange={(e) => setNewAccount({ ...newAccount, industry: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                    >
                        <option value="">Select Industry</option>
                        <option value="Technology">Technology</option>
                        <option value="Finance">Finance</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Retail">Retail</option>
                        <option value="Other">Other</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Phone"
                        value={newAccount.phone}
                        onChange={(e) => setNewAccount({ ...newAccount, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                    />
                    <input
                        type="url"
                        placeholder="Website (https://...)"
                        value={newAccount.website}
                        onChange={(e) => setNewAccount({ ...newAccount, website: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                setEditingAccountId(null);
                                setNewAccount({ name: '', industry: '', website: '', phone: '' });
                            }}
                            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm text-white bg-brand-600 hover:bg-brand-700 rounded-lg"
                        >
                            {editingAccountId ? 'Update Account' : 'Create Account'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Accounts;
