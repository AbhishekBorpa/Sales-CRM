import React, { useEffect, useState } from 'react';
import { fetchCases, createCase, updateCase, deleteCase } from '../services/api';
import { AlertCircle, CheckCircle, Clock, Plus, Filter, Pencil, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import Modal from '../components/Modal';
import { toast } from 'sonner';

const Cases = () => {
    const [cases, setCases] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCaseId, setEditingCaseId] = useState(null);
    const [newCase, setNewCase] = useState({ subject: '', description: '', priority: 'Medium', status: 'New' });

    useEffect(() => {
        loadCases();
    }, []);

    const loadCases = async () => {
        try {
            const data = await fetchCases();
            setCases(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCaseId) {
                await updateCase(editingCaseId, newCase);
                toast.success('Case updated');
            } else {
                await createCase(newCase);
                toast.success('Case created');
            }
            setIsModalOpen(false);
            setEditingCaseId(null);
            setNewCase({ subject: '', description: '', priority: 'Medium', status: 'New' });
            loadCases();
        } catch (error) {
            toast.error(editingCaseId ? 'Failed to update case' : 'Failed to create case');
        }
    };

    const handleEdit = (ticket) => {
        setEditingCaseId(ticket._id);
        setNewCase({
            subject: ticket.subject,
            description: ticket.description,
            priority: ticket.priority,
            status: ticket.status
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this case?')) return;
        try {
            await deleteCase(id);
            toast.success('Case deleted');
            loadCases();
        } catch (error) {
            toast.error('Failed to delete case');
        }
    };

    const handleOpenCreateModal = () => {
        setEditingCaseId(null);
        setNewCase({ subject: '', description: '', priority: 'Medium', status: 'New' });
        setIsModalOpen(true);
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'Critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
            case 'High': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400';
            default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    const getStatusIcon = (s) => {
        if (s === 'Closed') return <CheckCircle size={16} className="text-green-500" />;
        if (s === 'Escalated') return <AlertCircle size={16} className="text-red-500" />;
        return <Clock size={16} className="text-blue-500" />;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cases</h1>
                <button
                    onClick={handleOpenCreateModal}
                    className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 flex items-center gap-2"
                >
                    <Plus size={16} />
                    New Case
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Subject</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Priority</th>
                            <th className="px-6 py-4">Created</th>
                            <th className="px-6 py-4 w-24">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {cases.map((ticket) => (
                            <tr key={ticket._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 dark:text-white">{ticket.subject}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">{ticket.description}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(ticket.status)}
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{ticket.status}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={clsx("px-2 py-1 rounded-full text-xs font-medium", getPriorityColor(ticket.priority))}>
                                        {ticket.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(ticket)}
                                            className="text-gray-400 hover:text-blue-600 p-1 transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(ticket._id)}
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
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingCaseId(null);
                    setNewCase({ subject: '', description: '', priority: 'Medium', status: 'New' });
                }}
                title={editingCaseId ? "Edit Support Case" : "New Support Case"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                        <input
                            type="text"
                            required
                            value={newCase.subject}
                            onChange={e => setNewCase({ ...newCase, subject: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea
                            value={newCase.description}
                            onChange={e => setNewCase({ ...newCase, description: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                            rows={3}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                            <select
                                value={newCase.priority}
                                onChange={e => setNewCase({ ...newCase, priority: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                            <select
                                value={newCase.status}
                                onChange={e => setNewCase({ ...newCase, status: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                            >
                                <option value="New">New</option>
                                <option value="Working">Working</option>
                                <option value="Escalated">Escalated</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                setEditingCaseId(null);
                                setNewCase({ subject: '', description: '', priority: 'Medium', status: 'New' });
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700">
                            {editingCaseId ? 'Update Case' : 'Create Case'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Cases;
