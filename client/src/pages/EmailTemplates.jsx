import React, { useEffect, useState } from 'react';
import { Mail, Plus, Pencil, Trash2, Eye, Copy } from 'lucide-react';
import Modal from '../components/Modal';
import { toast } from 'sonner';
import { CardSkeleton, EmptyState } from '../components/UXComponents';

const API_URL = 'http://localhost:5001/api';

const EmailTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        body: '',
        category: 'Prospecting'
    });

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/email-templates`);
            const data = await response.json();
            setTemplates(data);
        } catch (error) {
            toast.error('Failed to load templates');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = selectedTemplate
                ? `${API_URL}/email-templates/${selectedTemplate._id}`
                : `${API_URL}/email-templates`;

            const response = await fetch(url, {
                method: selectedTemplate ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast.success(selectedTemplate ? 'Template updated' : 'Template created');
                fetchTemplates();
                closeModal();
            }
        } catch (error) {
            toast.error('Failed to save template');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this template?')) return;
        try {
            await fetch(`${API_URL}/email-templates/${id}`, { method: 'DELETE' });
            toast.success('Template deleted');
            fetchTemplates();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const handleEdit = (template) => {
        setSelectedTemplate(template);
        setFormData({
            name: template.name,
            subject: template.subject,
            body: template.body,
            category: template.category
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTemplate(null);
        setFormData({ name: '', subject: '', body: '', category: 'Prospecting' });
    };

    const categories = ['Prospecting', 'Follow-up', 'Thank You', 'Meeting', 'Closing', 'Other'];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Templates</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Pre-built templates for sales outreach</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 flex items-center gap-2"
                >
                    <Plus size={16} />
                    New Template
                </button>
            </div>

            {loading ? (
                <CardSkeleton count={6} />
            ) : templates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.map((template) => (
                        <div
                            key={template._id}
                            className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <Mail className="text-brand-600" size={20} />
                                    <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2 py-1 rounded">
                                        {template.category}
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleEdit(template)}
                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Edit"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(template._id)}
                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{template.name}</h3>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Subject: {template.subject}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                                {template.body.substring(0, 120)}...
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Mail}
                    title="No email templates yet"
                    description="Create your first email template to streamline your outreach"
                    actionLabel="Create Template"
                    onAction={() => setIsModalOpen(true)}
                />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={selectedTemplate ? 'Edit Template' : 'New Email Template'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Template Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                            placeholder="e.g., Cold Outreach V1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Subject Line
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                            placeholder="Quick question about {{lead.company}}"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email Body
                        </label>
                        <textarea
                            required
                            value={formData.body}
                            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                            rows={8}
                            placeholder="Hi {{lead.name}},&#10;&#10;I noticed {{lead.company}} is..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Use merge fields: {'{'}{'{'} lead.name {'}'}{'}'}, {'{'}{'{'} lead.company {'}'}{'}'}, {'{'}{'{'} lead.email {'}'}{'}'}
                        </p>
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
                            {selectedTemplate ? 'Update' : 'Create'} Template
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default EmailTemplates;
