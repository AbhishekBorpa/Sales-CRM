import React, { useEffect, useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Search, Filter, Trash2, Download, Globe, Users as UsersIcon, Phone, Award, DollarSign, TrendingUp, Mail, MoreVertical, UserPlus, Workflow as WorkflowIcon } from 'lucide-react';
import Modal from '../components/Modal';
import { toast } from 'sonner';
import clsx from 'clsx';
import { fetchLeads, createLead, convertLead, deleteLead } from '../services/api';

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filterText, setFilterText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [newLead, setNewLead] = useState({ name: '', company: '', value: 0, status: 'New' });
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [sourceFilter, setSourceFilter] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchLeads().then(setLeads).catch(console.error);
    }, []);

    // Analytics calculations
    const analytics = useMemo(() => {
        const total = leads.length;
        const newCount = leads.filter(l => l.status === 'New').length;
        const qualified = leads.filter(l => l.status === 'Qualified').length;
        const converted = leads.filter(l => l.status === 'Converted').length;
        const totalValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);
        const avgValue = total > 0 ? totalValue / total : 0;
        const convRate = total > 0 ? ((converted / total) * 100).toFixed(1) : 0;

        return { total, newCount, qualified, converted, totalValue, avgValue, convRate };
    }, [leads]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleConvert = async (e, id) => {
        e.stopPropagation();
        try {
            await convertLead(id);
            toast.success('Lead converted successfully!');
            const updatedLeads = await fetchLeads();
            setLeads(updatedLeads);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm('Move this lead to Recycle Bin?')) return;
        try {
            await deleteLead(id);
            setLeads(leads.filter(l => l._id !== id));
            toast.success('Lead moved to Recycle Bin');
        } catch (error) {
            toast.error('Failed to delete lead');
        }
    };

    const handleRowClick = (lead) => {
        window.location.href = `/leads/${lead._id}`;
    };

    const toggleLeadSelection = (leadId) => {
        setSelectedLeads(prev =>
            prev.includes(leadId)
                ? prev.filter(id => id !== leadId)
                : [...prev, leadId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedLeads.length === sortedAndFilteredLeads.length) {
            setSelectedLeads([]);
        } else {
            setSelectedLeads(sortedAndFilteredLeads.map(l => l._id));
        }
    };

    const handleBulkAssign = () => {
        if (selectedLeads.length === 0) return toast.error('Please select leads first');
        toast.info(`Assignment feature coming soon for ${selectedLeads.length} leads`);
    };

    const handleBulkEmail = () => {
        if (selectedLeads.length === 0) return toast.error('Please select leads first');
        toast.success(`Opening email templates for ${selectedLeads.length} leads...`);
        // Navigate to email templates with selected leads
        setTimeout(() => window.location.href = '/email-templates', 500);
    };

    const handleBulkWorkflow = () => {
        if (selectedLeads.length === 0) return toast.error('Please select leads first');
        toast.info(`Workflow automation coming soon for ${selectedLeads.length} leads`);
    };

    const exportToCSV = () => {
        const headers = ['Name', 'Company', 'Email', 'Phone', 'Status', 'Value', 'Source', 'Score'];
        const data = sortedAndFilteredLeads.map(l => [
            l.name, l.company, l.email, l.phone, l.status, l.value, l.source || '', l.score || 0
        ]);

        const csvContent = [headers, ...data]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast.success(`Exported ${sortedAndFilteredLeads.length} leads to CSV`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const created = await createLead(newLead);
            setLeads([...leads, created]);
            setIsModalOpen(false);
            setNewLead({ name: '', company: '', value: 0, status: 'New' });
            toast.success('Lead created successfully');
        } catch (error) {
            toast.error('Failed to create lead');
            console.error(error);
        }
    };

    const sortedAndFilteredLeads = useMemo(() => {
        let items = [...leads];

        // Filter by text
        if (filterText) {
            const lower = filterText.toLowerCase();
            items = items.filter(item =>
                item.name.toLowerCase().includes(lower) ||
                item.company.toLowerCase().includes(lower) ||
                (item.email && item.email.toLowerCase().includes(lower))
            );
        }

        // Filter by status
        if (statusFilter !== 'All') {
            items = items.filter(item => item.status === statusFilter);
        }

        // Filter by source
        if (sourceFilter !== 'All') {
            items = items.filter(item => item.source === sourceFilter);
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
    }, [leads, sortConfig, filterText, statusFilter, sourceFilter]);

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return <ChevronDown size={14} className="text-gray-300" />;
        return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-brand-600" /> : <ChevronDown size={14} className="text-brand-600" />;
    };

    const getSourceIcon = (source) => {
        const icons = {
            Website: <Globe size={14} />,
            Referral: <UsersIcon size={14} />,
            'Cold Call': <Phone size={14} />,
            Event: <Award size={14} />,
            Other: <MoreVertical size={14} />
        };
        return icons[source] || icons.Other;
    };

    const getLeadScoreColor = (score) => {
        if (score >= 70) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        if (score >= 40) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    };

    return (
        <div className="space-y-6">
            {/* Analytics Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Leads</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{analytics.total}</p>
                        </div>
                        <div className="bg-brand-50 dark:bg-brand-900/30 p-3 rounded-lg">
                            <UsersIcon className="text-brand-600 dark:text-brand-400" size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{analytics.newCount} new this month</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Qualified</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{analytics.qualified}</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                            <Award className="text-green-600 dark:text-green-400" size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Ready for conversion</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${(analytics.totalValue / 1000).toFixed(0)}K</p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg">
                            <DollarSign className="text-purple-600 dark:text-purple-400" size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Avg: ${(analytics.avgValue / 1000).toFixed(1)}K</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{analytics.convRate}%</p>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/30 p-3 rounded-lg">
                            <TrendingUp className="text-orange-600 dark:text-orange-400" size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{analytics.converted} converted</p>
                </div>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search leads..."
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
                        onClick={() => setIsModalOpen(true)}
                        className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors flex items-center gap-2"
                    >
                        <UserPlus size={16} />
                        Add Lead
                    </button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white text-sm"
                            >
                                <option value="All">All Statuses</option>
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Converted">Converted</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Source</label>
                            <select
                                value={sourceFilter}
                                onChange={(e) => setSourceFilter(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white text-sm"
                            >
                                <option value="All">All Sources</option>
                                <option value="Website">Website</option>
                                <option value="Referral">Referral</option>
                                <option value="Cold Call">Cold Call</option>
                                <option value="Event">Event</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Automation Toolbar */}
            {selectedLeads.length > 0 && (
                <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-lg p-4 flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-brand-900 dark:text-brand-100">
                            {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
                        </span>
                        <button
                            onClick={() => setSelectedLeads([])}
                            className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400"
                        >
                            Clear
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleBulkAssign}
                            className="px-3 py-1.5 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                            <UserPlus size={14} />
                            Assign
                        </button>
                        <button
                            onClick={handleBulkEmail}
                            className="px-3 py-1.5 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                            <Mail size={14} />
                            Email
                        </button>
                        <button
                            onClick={handleBulkWorkflow}
                            className="px-3 py-1.5 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                            <WorkflowIcon size={14} />
                            Workflow
                        </button>
                        <button
                            onClick={exportToCSV}
                            className="px-3 py-1.5 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                            <Download size={14} />
                            Export Selected
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-4 py-4">
                                <input
                                    type="checkbox"
                                    checked={selectedLeads.length === sortedAndFilteredLeads.length && sortedAndFilteredLeads.length > 0}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                                />
                            </th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleSort('name')}>
                                <div className="flex items-center gap-2">Name <SortIcon column="name" /></div>
                            </th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleSort('company')}>
                                <div className="flex items-center gap-2">Company <SortIcon column="company" /></div>
                            </th>
                            <th className="px-6 py-4">Source</th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleSort('status')}>
                                <div className="flex items-center gap-2">Status <SortIcon column="status" /></div>
                            </th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleSort('value')}>
                                <div className="flex items-center gap-2">Value <SortIcon column="value" /></div>
                            </th>
                            <th className="px-6 py-4">Score</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {sortedAndFilteredLeads.map((lead) => (
                            <tr
                                key={lead._id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                <td className="px-4 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedLeads.includes(lead._id)}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            toggleLeadSelection(lead._id);
                                        }}
                                        className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                                    />
                                </td>
                                <td
                                    className="px-6 py-4 font-medium text-gray-900 dark:text-white cursor-pointer"
                                    onClick={() => handleRowClick(lead)}
                                >
                                    <div>
                                        <div>{lead.name}</div>
                                        {lead.email && <div className="text-xs text-gray-500">{lead.email}</div>}
                                    </div>
                                </td>
                                <td
                                    className="px-6 py-4 text-gray-600 dark:text-gray-400 cursor-pointer"
                                    onClick={() => handleRowClick(lead)}
                                >
                                    {lead.company}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        {getSourceIcon(lead.source)}
                                        <span className="text-sm">{lead.source || 'Other'}</span>
                                    </div>
                                </td>
                                <td
                                    className="px-6 py-4 cursor-pointer"
                                    onClick={() => handleRowClick(lead)}
                                >
                                    <span className={clsx(
                                        "px-2 py-1 rounded-full text-xs font-medium",
                                        lead.status === 'New' ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                                            lead.status === 'Contacted' ? "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" :
                                                lead.status === 'Qualified' ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                                                    lead.status === 'Converted' ? "bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300" :
                                                        "bg-gray-100 text-gray-700"
                                    )}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td
                                    className="px-6 py-4 font-semibold text-gray-900 dark:text-white cursor-pointer"
                                    onClick={() => handleRowClick(lead)}
                                >
                                    ${lead.value?.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={clsx(
                                        "px-2 py-1 rounded-full text-xs font-bold",
                                        getLeadScoreColor(lead.score || 0)
                                    )}>
                                        {lead.score || 0}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        {lead.status !== 'Converted' && (
                                            <button
                                                onClick={(e) => handleConvert(e, lead._id)}
                                                className="text-xs bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 text-brand-700 dark:text-brand-400 px-3 py-1 rounded border border-brand-200 dark:border-brand-800 transition-colors"
                                            >
                                                Convert
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => handleDelete(e, lead._id)}
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

                {sortedAndFilteredLeads.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No leads found. Try adjusting your filters.
                    </div>
                )}
            </div>

            {/* Create Lead Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Lead"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={newLead.name}
                        onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                    />
                    <input
                        type="text"
                        placeholder="Company"
                        value={newLead.company}
                        onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                    />
                    <input
                        type="number"
                        placeholder="Value"
                        value={newLead.value}
                        onChange={(e) => setNewLead({ ...newLead, value: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                    />
                    <select
                        value={newLead.status}
                        onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                    >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                    </select>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm text-white bg-brand-600 hover:bg-brand-700 rounded-lg"
                        >
                            Create Lead
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Leads;
