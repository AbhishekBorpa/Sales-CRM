import React, { useState } from 'react';
import Modal from './Modal';
import ChatterFeed from './ChatterFeed';
import { Building2, Mail, Phone, DollarSign, Briefcase, Calendar, Globe, User, Clock, TrendingUp, Award, Edit2, Check, X, MoreVertical } from 'lucide-react';
import clsx from 'clsx';

const LeadDetailsModal = ({ lead, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedLead, setEditedLead] = useState(lead);

    if (!lead) return null;

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

    const scoreInfo = getScoreLabel(lead.score || 0);

    return (
        <Modal isOpen={true} onClose={onClose} title={lead.name} maxWidth="max-w-5xl">
            <div className="flex flex-col h-[calc(100vh-200px)]">
                {/* Header Section */}
                <div className="flex items-start justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{lead.name}</h2>
                            <span className={clsx(
                                "px-3 py-1 rounded-full text-xs font-semibold",
                                lead.status === 'New' ? "bg-blue-100 text-blue-700" :
                                    lead.status === 'Contacted' ? "bg-purple-100 text-purple-700" :
                                        lead.status === 'Qualified' ? "bg-green-100 text-green-700" :
                                            "bg-gray-100 text-gray-700"
                            )}>
                                {lead.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Briefcase size={16} />
                            <span>{lead.title || 'Position Not Specified'} at {lead.company}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="p-2 text-gray-400 hover:text-brand-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <Edit2 size={18} />
                    </button>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-3 gap-6 flex-1 overflow-y-auto py-6">
                    {/* Left Column - Primary Info */}
                    <div className="col-span-2 space-y-6">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">Lead Score</span>
                                    <TrendingUp size={16} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{lead.score || 0}</div>
                                <span className={`text-xs font-medium ${scoreInfo.color}`}>{scoreInfo.label}</span>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Potential Value</span>
                                    <DollarSign size={16} className="text-green-600 dark:text-green-400" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">${(lead.value / 1000).toFixed(0)}K</div>
                                <span className="text-xs text-gray-600 dark:text-gray-400">${lead.value?.toLocaleString()}</span>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">Source</span>
                                    <div className="text-purple-600 dark:text-purple-400">
                                        {getSourceIcon(lead.source)}
                                    </div>
                                </div>
                                <div className="text-lg font-bold text-gray-900 dark:text-white">{lead.source || 'Other'}</div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="px-5 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Contact Information</h3>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail size={18} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {lead.email || 'No email provided'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Phone size={18} className="text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {lead.phone || 'No phone provided'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Building2 size={18} className="text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Company</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {lead.company}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="px-5 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Timeline</h3>
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Calendar size={14} className="text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Created</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Clock size={14} className="text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Last Updated</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {lead.updatedAt ? new Date(lead.updatedAt).toLocaleString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Activity Feed */}
                    <div className="col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 h-full overflow-hidden flex flex-col">
                            <div className="px-5 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Activity</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <ChatterFeed recordId={lead._id} model="Lead" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default LeadDetailsModal;
