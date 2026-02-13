import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatterFeed from '../components/ChatterFeed';
import { Building2, Mail, Phone, DollarSign, Briefcase, Calendar, Globe, User, Clock, TrendingUp, Award, Edit2, ArrowLeft, MoreVertical, CheckCircle, Trash2, UserPlus, FileText } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';

const API_URL = 'http://localhost:5001/api';

const LeadDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLead();
    }, [id]);

    const fetchLead = async () => {
        try {
            const response = await fetch(`${API_URL}/leads/${id}`);
            const data = await response.json();
            setLead(data);
        } catch (error) {
            toast.error('Failed to load lead');
            navigate('/leads');
        } finally {
            setLoading(false);
        }
    };

    const getSourceIcon = (source) => {
        const icons = {
            Website: Globe,
            Referral: User,
            'Cold Call': Phone,
            Event: Award,
        };
        const IconComponent = icons[source] || MoreVertical;
        return <IconComponent size={16} />;
    };

    const getScoreLabel = (score) => {
        if (score >= 70) return { label: 'Hot Lead', color: 'text-red-600', bg: 'bg-red-50' };
        if (score >= 40) return { label: 'Warm Lead', color: 'text-orange-600', bg: 'bg-orange-50' };
        return { label: 'Cold Lead', color: 'text-blue-600', bg: 'bg-blue-50' };
    };

    const handleConvert = async () => {
        if (!window.confirm('Convert this lead to an Opportunity?')) return;
        try {
            const response = await fetch(`${API_URL}/leads/${id}/convert`, { method: 'POST' });
            const data = await response.json();
            toast.success('Lead converted successfully!');
            setTimeout(() => navigate('/opportunities'), 1500);
        } catch (error) {
            toast.error('Failed to convert lead');
        }
    };

    const handleSendEmail = () => {
        toast.success('Opening email templates...');
        setTimeout(() => navigate('/email-templates'), 500);
    };

    const handleCreateTask = () => {
        toast.success('Opening task creation...');
        setTimeout(() => navigate('/tasks'), 500);
    };

    const handleAddToWorkflow = () => {
        toast.success('Opening workflow automation...');
        setTimeout(() => navigate('/workflows'), 500);
    };

    const handleDelete = async () => {
        if (!window.confirm('Move this lead to Recycle Bin?')) return;
        try {
            await fetch(`${API_URL}/leads/${id}`, { method: 'DELETE' });
            toast.success('Lead moved to Recycle Bin');
            navigate('/leads');
        } catch (error) {
            toast.error('Failed to delete lead');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading lead details...</div>
            </div>
        );
    }

    if (!lead) return null;

    const scoreInfo = getScoreLabel(lead.score || 0);

    return (
        <div className="space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/leads')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lead.name}</h1>
                        <span className={clsx(
                            "px-3 py-1 rounded-full text-xs font-semibold",
                            lead.status === 'New' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                                lead.status === 'Contacted' ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" :
                                    lead.status === 'Qualified' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                                        "bg-gray-100 text-gray-700"
                        )}>
                            {lead.status}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                        <Briefcase size={16} />
                        <span>{lead.title || 'Position Not Specified'} at {lead.company}</span>
                    </div>
                </div>
                <button className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors flex items-center gap-2">
                    <Edit2 size={16} />
                    Edit
                </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Actions:</span>

                    {lead.status !== 'Converted' && (
                        <button
                            onClick={handleConvert}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
                        >
                            <CheckCircle size={16} />
                            Convert to Opportunity
                        </button>
                    )}

                    <button
                        onClick={handleSendEmail}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        <Mail size={16} />
                        Send Email
                    </button>

                    <button
                        onClick={handleCreateTask}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                        <FileText size={16} />
                        Create Task
                    </button>

                    <button
                        onClick={handleAddToWorkflow}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                        <TrendingUp size={16} />
                        Add to Workflow
                    </button>

                    <div className="flex-1"></div>

                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                        <Trash2 size={16} />
                        Delete Lead
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-3 gap-6">
                {/* Left Column - Primary Info */}
                <div className="col-span-2 space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">Lead Score</span>
                                <TrendingUp size={18} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{lead.score || 0}</div>
                            <span className={`text-sm font-medium ${scoreInfo.color}`}>{scoreInfo.label}</span>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Potential Value</span>
                                <DollarSign size={18} className="text-green-600 dark:text-green-400" />
                            </div>
                            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">${(lead.value / 1000).toFixed(0)}K</div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">${lead.value?.toLocaleString()}</span>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">Source</span>
                                <div className="text-purple-600 dark:text-purple-400">
                                    {getSourceIcon(lead.source)}
                                </div>
                            </div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">{lead.source || 'Other'}</div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Contact Information</h3>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Mail size={20} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Email Address</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {lead.email || 'No email provided'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Phone size={20} className="text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Phone Number</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {lead.phone || 'No phone provided'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Building2 size={20} className="text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Company</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {lead.company}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Timeline</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Calendar size={16} className="text-gray-600 dark:text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Lead Created</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Clock size={16} className="text-gray-600 dark:text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Last Updated</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {lead.updatedAt ? new Date(lead.updatedAt).toLocaleString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Activity Feed */}
                <div className="col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 sticky top-6">
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Activity Feed</h3>
                        </div>
                        <div className="h-[600px] overflow-y-auto">
                            <ChatterFeed recordId={lead._id} model="Lead" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadDetail;
