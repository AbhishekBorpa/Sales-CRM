import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Shield, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = 'http://localhost:5001/api';

const AssignmentRules = () => {
    const [rules, setRules] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        priority: 1,
        criteriaField: 'source',
        criteriaOperator: 'equals',
        criteriaValue: '',
        assignedTo: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [rulesRes, usersRes] = await Promise.all([
                fetch(`${API_URL}/assignment-rules`),
                fetch(`${API_URL}/users`) // Assuming we have a users endpoint, otherwise mock/hardcode
            ]);

            // Mock users if endpoint doesn't exist
            if (!usersRes.ok) {
                setUsers([
                    { _id: '678f24b8d77c220f1883344a', name: 'Demo Admin' }, // Replace with real ID
                    { _id: '1', name: 'Sales Rep 1' },
                    { _id: '2', name: 'Sales Rep 2' }
                ]);
            } else {
                const usersData = await usersRes.json();
                setUsers(usersData);
            }

            const rulesData = await rulesRes.json();
            setRules(rulesData);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load rules');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingRule
                ? `${API_URL}/assignment-rules/${editingRule._id}`
                : `${API_URL}/assignment-rules`;

            const method = editingRule ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to save rule');

            toast.success(editingRule ? 'Rule updated' : 'Rule created');
            setShowModal(false);
            setEditingRule(null);
            fetchData();
            resetForm();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this rule?')) return;
        try {
            await fetch(`${API_URL}/assignment-rules/${id}`, { method: 'DELETE' });
            toast.success('Rule deleted');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete rule');
        }
    };

    const handleEdit = (rule) => {
        setEditingRule(rule);
        setFormData({
            name: rule.name,
            priority: rule.priority,
            criteriaField: rule.criteriaField,
            criteriaOperator: rule.criteriaOperator,
            criteriaValue: rule.criteriaValue,
            assignedTo: rule.assignedTo?._id || rule.assignedTo
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            priority: 1,
            criteriaField: 'source',
            criteriaOperator: 'equals',
            criteriaValue: '',
            assignedTo: ''
        });
        setEditingRule(null);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Assignment Rules</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Automatically assign new leads based on rules.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                >
                    <Plus size={18} />
                    New Rule
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rule Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Criteria</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned To</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {rules.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    No rules defined. Leads will be manually assigned.
                                </td>
                            </tr>
                        ) : (
                            rules.map((rule) => (
                                <tr key={rule._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">#{rule.priority}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{rule.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                        <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">{rule.criteriaField}</span>
                                        <span className="mx-2 text-gray-400">{rule.criteriaOperator}</span>
                                        <span className="font-semibold">{rule.criteriaValue}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-xs text-brand-700 font-medium">
                                                {rule.assignedTo?.name?.charAt(0) || 'U'}
                                            </div>
                                            {rule.assignedTo?.name || 'Unknown User'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(rule)}
                                                className="p-1 text-gray-500 hover:text-brand-600 transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(rule._id)}
                                                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6 shadow-xl animate-scale-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingRule ? 'Edit Rule' : 'New Assignment Rule'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rule Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="e.g. US West Leads"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 border p-3 rounded-lg border-gray-100 dark:border-gray-700">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Criteria</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <select
                                        value={formData.criteriaField}
                                        onChange={(e) => setFormData({ ...formData, criteriaField: e.target.value })}
                                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="source">Lead Source</option>
                                        <option value="industry">Industry</option>
                                        <option value="status">Status</option>
                                        <option value="company">Company</option>
                                    </select>
                                    <select
                                        value={formData.criteriaOperator}
                                        onChange={(e) => setFormData({ ...formData, criteriaOperator: e.target.value })}
                                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="equals">Equals</option>
                                        <option value="contains">Contains</option>
                                        <option value="starts_with">Starts With</option>
                                    </select>
                                    <input
                                        type="text"
                                        required
                                        value={formData.criteriaValue}
                                        onChange={(e) => setFormData({ ...formData, criteriaValue: e.target.value })}
                                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Value..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign To User</label>
                                <select
                                    required
                                    value={formData.assignedTo}
                                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="">Select a user...</option>
                                    {users.map(user => (
                                        <option key={user._id} value={user._id}>{user.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 text-sm font-medium"
                                >
                                    Save Rule
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignmentRules;
