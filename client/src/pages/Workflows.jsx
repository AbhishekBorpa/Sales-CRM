import React, { useEffect, useState } from 'react';
import { Workflow as WorkflowIcon, Plus, Play, Pause, Trash2, Settings } from 'lucide-react';
import Modal from '../components/Modal';
import { toast } from 'sonner';
import { LoadingSpinner, EmptyState } from '../components/UXComponents';

const API_URL = 'http://localhost:5001/api';

const Workflows = () => {
    const [workflows, setWorkflows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWorkflow, setSelectedWorkflow] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        entity: 'Lead',
        triggerType: 'onCreate',
        triggerConditions: {},
        actions: [],
        isActive: true
    });

    useEffect(() => {
        fetchWorkflows();
    }, []);

    const fetchWorkflows = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/workflows`);
            const data = await response.json();
            setWorkflows(data);
        } catch (error) {
            toast.error('Failed to load workflows');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = selectedWorkflow
                ? `${API_URL}/workflows/${selectedWorkflow._id}`
                : `${API_URL}/workflows`;

            const response = await fetch(url, {
                method: selectedWorkflow ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast.success(selectedWorkflow ? 'Workflow updated' : 'Workflow created');
                fetchWorkflows();
                closeModal();
            }
        } catch (error) {
            toast.error('Failed to save workflow');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this workflow?')) return;
        try {
            await fetch(`${API_URL}/workflows/${id}`, { method: 'DELETE' });
            toast.success('Workflow deleted');
            fetchWorkflows();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const toggleActive = async (workflow) => {
        try {
            const response = await fetch(`${API_URL}/workflows/${workflow._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !workflow.isActive })
            });
            if (response.ok) {
                toast.success(workflow.isActive ? 'Workflow paused' : 'Workflow activated');
                fetchWorkflows();
            }
        } catch (error) {
            toast.error('Failed to update');
        }
    };

    const handleEdit = (workflow) => {
        setSelectedWorkflow(workflow);
        setFormData({
            name: workflow.name,
            description: workflow.description || '',
            entity: workflow.entity,
            triggerType: workflow.triggerType,
            triggerConditions: workflow.triggerConditions || {},
            actions: workflow.actions || [],
            isActive: workflow.isActive
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedWorkflow(null);
        setFormData({
            name: '',
            description: '',
            entity: 'Lead',
            triggerType: 'onCreate',
            triggerConditions: {},
            actions: [],
            isActive: true
        });
    };

    const addAction = () => {
        setFormData({
            ...formData,
            actions: [...formData.actions, { type: 'createTask', config: {} }]
        });
    };

    const updateAction = (index, field, value) => {
        const newActions = [...formData.actions];
        if (field === 'type') {
            newActions[index].type = value;
            newActions[index].config = {};
        } else {
            newActions[index].config[field] = value;
        }
        setFormData({ ...formData, actions: newActions });
    };

    const removeAction = (index) => {
        setFormData({
            ...formData,
            actions: formData.actions.filter((_, i) => i !== index)
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workflow Automation</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Automate business processes with triggers and actions</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 flex items-center gap-2"
                >
                    <Plus size={16} />
                    New Workflow
                </button>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : workflows.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {workflows.map((workflow) => (
                        <div
                            key={workflow._id}
                            className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3 flex-1">
                                    <WorkflowIcon className="text-brand-600 mt-1" size={20} />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-gray-900 dark:text-white">{workflow.name}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${workflow.isActive
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                                                }`}>
                                                {workflow.isActive ? 'Active' : 'Paused'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            {workflow.description || 'No description'}
                                        </p>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                                                {workflow.entity}
                                            </span>
                                            <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded">
                                                {workflow.triggerType.replace('on', 'On ')}
                                            </span>
                                            <span className="bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-1 rounded">
                                                {workflow.actions.length} action{workflow.actions.length !== 1 ? 's' : ''}
                                            </span>
                                            {workflow.executionCount > 0 && (
                                                <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 px-2 py-1 rounded">
                                                    Executed {workflow.executionCount}x
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleActive(workflow)}
                                        className={`p-2 rounded transition-colors ${workflow.isActive
                                            ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                            : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        title={workflow.isActive ? 'Pause' : 'Activate'}
                                    >
                                        {workflow.isActive ? <Pause size={16} /> : <Play size={16} />}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(workflow)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                        title="Edit"
                                    >
                                        <Settings size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(workflow._id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={WorkflowIcon}
                    title="No workflows yet"
                    description="Create automated workflows to streamline your business processes"
                    actionLabel="Create Workflow"
                    onAction={() => setIsModalOpen(true)}
                />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={selectedWorkflow ? 'Edit Workflow' : 'New Workflow'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Workflow Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                            placeholder="e.g., Auto-assign hot leads"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                            rows={2}
                            placeholder="What does this workflow do?"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Entity
                            </label>
                            <select
                                value={formData.entity}
                                onChange={(e) => setFormData({ ...formData, entity: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                            >
                                <option value="Lead">Lead</option>
                                <option value="Opportunity">Opportunity</option>
                                <option value="Account">Account</option>
                                <option value="Case">Case</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Trigger
                            </label>
                            <select
                                value={formData.triggerType}
                                onChange={(e) => setFormData({ ...formData, triggerType: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                            >
                                <option value="onCreate">On Create</option>
                                <option value="onUpdate">On Update</option>
                                <option value="onStatusChange">On Status Change</option>
                                <option value="onFieldChange">On Field Change</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Actions
                        </label>
                        <div className="space-y-3">
                            {formData.actions.map((action, index) => (
                                <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <div className="flex items-start gap-2 mb-2">
                                        <select
                                            value={action.type}
                                            onChange={(e) => updateAction(index, 'type', e.target.value)}
                                            className="flex-1 px-2 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                                        >
                                            <option value="createTask">Create Task</option>
                                            <option value="updateField">Update Field</option>
                                            <option value="sendEmail">Send Email</option>
                                            <option value="assignTo">Assign To</option>
                                            <option value="sendNotification">Send Notification</option>
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => removeAction(index)}
                                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    {action.type === 'createTask' && (
                                        <input
                                            type="text"
                                            placeholder="Task title"
                                            value={action.config.title || ''}
                                            onChange={(e) => updateAction(index, 'title', e.target.value)}
                                            className="w-full px-2 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                                        />
                                    )}

                                    {action.type === 'updateField' && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                placeholder="Field name"
                                                value={action.config.field || ''}
                                                onChange={(e) => updateAction(index, 'field', e.target.value)}
                                                className="px-2 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                                            />
                                            <input
                                                type="text"
                                                placeholder="New value"
                                                value={action.config.value || ''}
                                                onChange={(e) => updateAction(index, 'value', e.target.value)}
                                                className="px-2 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                                            />
                                        </div>
                                    )}

                                    {action.type === 'sendNotification' && (
                                        <input
                                            type="text"
                                            placeholder="Notification message"
                                            value={action.config.message || ''}
                                            onChange={(e) => updateAction(index, 'message', e.target.value)}
                                            className="w-full px-2 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addAction}
                            className="mt-2 text-sm text-brand-600 hover:text-brand-700 font-medium"
                        >
                            + Add Action
                        </button>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg"
                        >
                            {selectedWorkflow ? 'Update' : 'Create'} Workflow
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Workflows;
