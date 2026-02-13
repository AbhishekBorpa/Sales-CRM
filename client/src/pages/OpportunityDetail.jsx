import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatterFeed from '../components/ChatterFeed';
import {
    DollarSign, Briefcase, Calendar, TrendingUp, Edit2, ArrowLeft,
    MoreVertical, Trash2, CheckCircle, Package, FileText, Users, Activity
} from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { fetchOpportunity, deleteOpportunity, updateOpportunity } from '../services/api';

import OpportunityProducts from '../components/OpportunityProducts';
import ContactRoles from '../components/ContactRoles';
import ActivityTimeline from '../components/ActivityTimeline';
import Modal from '../components/Modal';
import Notes from '../components/Notes';

const STAGES = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

const OpportunityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const data = await fetchOpportunity(id);
            setOpportunity(data);
            setFormData(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load opportunity');
            navigate('/opportunities');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Move this deal to Recycle Bin?')) return;
        try {
            await deleteOpportunity(id);
            toast.success('Opportunity moved to Recycle Bin');
            navigate('/opportunities');
        } catch (error) {
            toast.error('Failed to delete opportunity');
        }
    };

    const handleStageChange = async (newStage) => {
        try {
            // Optimistic update
            setOpportunity(prev => ({ ...prev, stage: newStage }));
            await updateOpportunity(id, { stage: newStage });
            toast.success(`Stage updated to ${newStage}`);
        } catch (error) {
            toast.error('Failed to update stage');
            loadData(); // Revert on error
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const updated = await updateOpportunity(id, formData);
            setOpportunity(updated);
            setIsEditModalOpen(false);
            toast.success('Opportunity updated successfully');
        } catch (error) {
            toast.error('Failed to update opportunity');
        }
    };

    const QuickAction = ({ icon: Icon, label, onClick, colorClass }) => (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${colorClass}`}
        >
            <Icon size={16} />
            {label}
        </button>
    );

    if (loading) return <div className="flex justify-center p-10">Loading...</div>;
    if (!opportunity) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/opportunities')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Briefcase className="text-brand-500" size={24} />
                            {opportunity.title}
                        </h1>
                        <span className={clsx(
                            "px-3 py-1 rounded-full text-xs font-semibold border",
                            opportunity.stage === 'Closed Won' ? "bg-green-100 text-green-700 border-green-200" :
                                opportunity.stage === 'Closed Lost' ? "bg-red-100 text-red-700 border-red-200" :
                                    "bg-blue-100 text-blue-700 border-blue-200"
                        )}>
                            {opportunity.stage}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <Users size={14} />
                            {opportunity.account?.name || 'No Account'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            Close Date: {new Date(opportunity.closeDate).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 flex items-center gap-2"
                    >
                        <Edit2 size={16} /> Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2"
                    >
                        <Trash2 size={16} /> Delete
                    </button>
                </div>

                {/* Quick Actions Bar */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Actions:</span>
                        <QuickAction
                            icon={FileText}
                            label="New Task"
                            onClick={() => navigate('/tasks')}
                            colorClass="bg-purple-600 text-white hover:bg-purple-700"
                        />
                        <QuickAction
                            icon={Activity}
                            label="Log Call"
                            onClick={() => toast.success('Call logged')}
                            colorClass="bg-blue-600 text-white hover:bg-blue-700"
                        />
                        <QuickAction
                            icon={Package}
                            label="New Quote"
                            onClick={() => navigate('/quotes')}
                            colorClass="bg-orange-600 text-white hover:bg-orange-700"
                        />
                    </div>
                </div>
            </div>

            {/* Stage Progress Bar (Path) */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-x-auto">
                <div className="flex items-center min-w-max">
                    {STAGES.map((stage, index) => {
                        const isCurrent = opportunity.stage === stage;
                        const isPast = STAGES.indexOf(opportunity.stage) > index;
                        const isLost = opportunity.stage === 'Closed Lost';

                        return (
                            <button
                                key={stage}
                                onClick={() => handleStageChange(stage)}
                                disabled={isLost}
                                className={clsx(
                                    "flex items-center px-4 py-2 text-sm font-medium transition-colors relative group first:rounded-l-lg last:rounded-r-lg mr-1",
                                    isCurrent ? "bg-brand-600 text-white z-10" :
                                        isPast ? "bg-brand-100 text-brand-800 hover:bg-brand-200" :
                                            "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400"
                                )}
                                style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 10px 50%)', paddingLeft: index === 0 ? '1rem' : '1.5rem' }}
                            >
                                {stage}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Details & Related Lists */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Key Fields Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Deal Highlights</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold">Amount</label>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    ${opportunity.value?.toLocaleString()}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold">Probability</label>
                                <div className="text-xl font-semibold text-gray-900 dark:text-white mt-1">
                                    {opportunity.probability}%
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold">Expected Revenue</label>
                                <div className="text-xl font-semibold text-green-600 mt-1">
                                    ${((opportunity.value || 0) * (opportunity.probability || 0) / 100).toLocaleString()}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold">Owner</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-xs font-bold text-brand-600">
                                        AB
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Abhishek</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Lists */}
                    <OpportunityProducts opportunityId={id} />
                    <ContactRoles opportunityId={id} />

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <FileText size={18} />
                                Notes
                            </h3>
                        </div>
                        <Notes parentId={id} />
                    </div>
                </div>

                {/* Right Column: Activity & Chatter */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sticky top-6">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Activity size={18} />
                            Activity Timeline
                        </h3>
                        <ActivityTimeline parentId={id} />

                        <div className="mt-8 border-t pt-4 border-gray-200 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Chatter</h3>
                            <div className="max-h-[500px] overflow-y-auto">
                                <ChatterFeed recordId={id} model="Opportunity" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Opportunity"
            >
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input
                            type="text"
                            value={formData.title || ''}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ($)</label>
                        <input
                            type="number"
                            value={formData.value || ''}
                            onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Close Date</label>
                        <input
                            type="date"
                            value={formData.closeDate ? new Date(formData.closeDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stage</label>
                        <select
                            value={formData.stage || 'Prospecting'}
                            onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        >
                            {STAGES.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default OpportunityDetail;
