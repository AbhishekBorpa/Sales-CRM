import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import clsx from 'clsx';
import { Trash2, DollarSign, Briefcase, TrendingUp, Plus, Calendar, User, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { fetchOpportunities, createOpportunity, deleteOpportunity, updateOpportunity } from '../services/api';

import Modal from '../components/Modal';
import ActivityTimeline from '../components/ActivityTimeline';
import Notes from '../components/Notes';
import ContactRoles from '../components/ContactRoles';
import OpportunityProducts from '../components/OpportunityProducts';

const STAGES = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'];

const PipelineStat = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-4 shadow-sm">
        <div className={`p-3 rounded-lg ${color} text-white`}>
            <Icon size={20} />
        </div>
        <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const Opportunities = () => {
    const navigate = useNavigate();
    const [opportunities, setOpportunities] = useState([]);
    const [columns, setColumns] = useState({});
    const [selectedOpp, setSelectedOpp] = useState(null);
    const [stats, setStats] = useState({ totalValue: 0, count: 0, avgValue: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newOpp, setNewOpp] = useState({ title: '', value: 0, stage: 'Prospecting', closeDate: '' });
    const [page, setPage] = useState(1);
    const [limit] = useState(20); // Higher limit for Kanban
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [editingOppId, setEditingOppId] = useState(null);

    useEffect(() => {
        loadData();
    }, [page, search]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (page !== 1) setPage(1);
            else loadData();
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const loadData = () => {
        fetchOpportunities({ page, limit, search }).then(data => {
            const opps = data.opportunities || [];
            setOpportunities(opps);
            setTotalPages(data.totalPages || 1);
            setTotalOpps(data.totalOpportunities || 0);

            // Group by stage
            const cols = STAGES.reduce((acc, stage) => {
                acc[stage] = opps.filter(o => o.stage === stage);
                return acc;
            }, {});
            setColumns(cols);

            // Calculate Stats (only for current page/view)
            const totalValue = opps.reduce((sum, o) => sum + (o.value || 0), 0);
            setStats({
                totalValue,
                count: opps.length,
                avgValue: opps.length ? Math.round(totalValue / opps.length) : 0
            });

        }).catch(console.error);
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm('Move this opportunity to Recycle Bin?')) return;
        try {
            await deleteOpportunity(id);
            // Update local state
            const newCols = { ...columns };
            Object.keys(newCols).forEach(stage => {
                newCols[stage] = newCols[stage].filter(o => o._id !== id);
            });
            setColumns(newCols);
            toast.success('Opportunity moved to Recycle Bin');
            loadData(); // Re-fetch to update stats correctly
        } catch (error) {
            toast.error('Failed to delete opportunity');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingOppId) {
                await updateOpportunity(editingOppId, newOpp);
                toast.success('Opportunity updated successfully');
            } else {
                await createOpportunity(newOpp);
                toast.success('Opportunity created successfully');
            }
            setIsModalOpen(false);
            setEditingOppId(null);
            setNewOpp({ title: '', value: 0, stage: 'Prospecting', closeDate: '' });
            loadData();
        } catch (error) {
            toast.error(error.message || (editingOppId ? 'Failed to update opportunity' : 'Failed to create opportunity'));
            console.error(error);
        }
    };

    const handleEdit = (e, opp) => {
        e.stopPropagation();
        setEditingOppId(opp._id);
        setNewOpp({
            title: opp.title,
            value: opp.value || 0,
            stage: opp.stage,
            closeDate: opp.closeDate ? new Date(opp.closeDate).toISOString().split('T')[0] : ''
        });
        setIsModalOpen(true);
    };

    const handleOpenCreateModal = () => {
        setEditingOppId(null);
        setNewOpp({ title: '', value: 0, stage: 'Prospecting', closeDate: '' });
        setIsModalOpen(true);
    };


    const onDragEnd = async (result) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceCol = columns[source.droppableId];
            const destCol = columns[destination.droppableId];
            const sourceItems = [...sourceCol];
            const destItems = [...destCol];
            const [removed] = sourceItems.splice(source.index, 1);

            // Optimistic update: Update stage locally
            removed.stage = destination.droppableId;
            destItems.splice(destination.index, 0, removed);

            setColumns({
                ...columns,
                [source.droppableId]: sourceItems,
                [destination.droppableId]: destItems
            });

            // Call API to update stage
            try {
                await updateOpportunity(removed._id || removed.id, { stage: destination.droppableId });
                toast.success(`Moved to ${destination.droppableId}`);
                loadData(); // Re-fetch to ensure sync and update stats
            } catch (error) {
                console.error('Drag update failed:', error);
                toast.error('Failed to update stage');
            }
        } else {
            const col = columns[source.droppableId];
            const items = [...col];
            const [removed] = items.splice(source.index, 1);
            items.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: items
            });
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pipeline</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your active deals and track progress.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search deals..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-3 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-brand-500 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={handleOpenCreateModal}
                        className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={18} />
                        New Deal
                    </button>
                </div>
            </div>

            {/* Pipeline Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PipelineStat
                    label="Total Pipeline Value"
                    value={`$${stats.totalValue.toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-green-500"
                />
                <PipelineStat
                    label="Active Deals"
                    value={stats.count}
                    icon={Briefcase}
                    color="bg-blue-500"
                />
                <PipelineStat
                    label="Avg. Deal Size"
                    value={`$${stats.avgValue.toLocaleString()}`}
                    icon={TrendingUp}
                    color="bg-purple-500"
                />
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 overflow-x-auto pb-4 h-full items-start">
                    {STAGES.map((stage, sIdx) => {
                        const items = columns[stage] || [];
                        const stageValue = items.reduce((sum, i) => sum + (i.value || 0), 0);

                        return (
                            <Droppable key={stage} droppableId={stage}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={clsx(
                                            "min-w-[320px] bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex flex-col max-h-[calc(100vh-16rem)] border border-gray-200 dark:border-gray-700",
                                            snapshot.isDraggingOver && "bg-gray-100 dark:bg-gray-700 ring-2 ring-brand-200"
                                        )}
                                    >
                                        <div className="mb-4 px-1 sticky top-0 bg-gray-50 dark:bg-gray-800/50 z-10 backdrop-blur-sm pb-2 border-b border-gray-200 dark:border-gray-700/50">
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm">{stage}</h3>
                                                <span className="bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-600">
                                                    {items.length}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 font-medium">
                                                ${stageValue.toLocaleString()}
                                            </p>
                                            {/* Progress bar for visualization */}
                                            <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${sIdx === 4 ? 'bg-green-500' : 'bg-brand-500'}`}
                                                    style={{ width: '100%' }} // Could be percentage relative to total pipeline
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3 overflow-y-auto flex-1 px-1 custom-scrollbar">
                                            {items.map((opp, index) => (
                                                <Draggable key={opp._id} draggableId={String(opp._id)} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={() => navigate(`/opportunities/${opp._id}`)}
                                                            className={clsx(
                                                                "bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing hover:border-brand-300 dark:hover:border-brand-600 transition-all group relative",
                                                                snapshot.isDragging ? "shadow-xl rotate-2 ring-2 ring-brand-500 z-50" : "shadow-sm hover:shadow-md"
                                                            )}
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-600 text-sm leading-tight line-clamp-2">
                                                                    {opp.title}
                                                                </h4>
                                                            </div>

                                                            <div className="flex items-center gap-2 mb-3">
                                                                <div className="text-xs text-gray-500 flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 px-1.5 py-0.5 rounded">
                                                                    <User size={10} />
                                                                    {opp.account?.name || 'No Account'}
                                                                </div>
                                                            </div>

                                                            <div className="flex justify-between items-end pt-2 border-t border-gray-50 dark:border-gray-700/50">
                                                                <div>
                                                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                                        ${(opp.value || 0).toLocaleString()}
                                                                    </p>
                                                                </div>
                                                                <div className="text-xs text-gray-400 flex items-center gap-1" title={`Close date: ${opp.closeDate}`}>
                                                                    <Calendar size={12} />
                                                                    {new Date(opp.closeDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                                </div>
                                                            </div>

                                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1">
                                                                <button
                                                                    onClick={(e) => handleEdit(e, opp)}
                                                                    className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-all"
                                                                    title="Edit"
                                                                >
                                                                    <Pencil size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => handleDelete(e, opp._id)}
                                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        );
                    })}
                </div>
            </DragDropContext>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-4 pb-6">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {selectedOpp && (
                <Modal isOpen={!!selectedOpp} onClose={() => setSelectedOpp(null)} title={selectedOpp.title}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto pr-2">
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Value</label>
                                    <p className="text-lg font-medium dark:text-white">${selectedOpp.value?.toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Stage</label>
                                    <span className="inline-block mt-1 px-2 py-1 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 text-sm font-medium rounded-md">
                                        {selectedOpp.stage}
                                    </span>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Account</label>
                                    <p className="text-base font-medium dark:text-white">{selectedOpp.account?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Close Date</label>
                                    <p className="text-base font-medium dark:text-white">{new Date(selectedOpp.closeDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <OpportunityProducts opportunityId={selectedOpp._id} />
                            <ContactRoles opportunityId={selectedOpp._id} />
                        </div>
                        <div className="space-y-6">
                            <ActivityTimeline parentId={selectedOpp._id} />
                            <Notes parentId={selectedOpp._id} />
                        </div>
                    </div>
                </Modal>
            )}

            {/* Create/Edit Opportunity Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingOppId(null);
                    setNewOpp({ title: '', value: 0, stage: 'Prospecting', closeDate: '' });
                }}
                title={editingOppId ? "Edit Opportunity" : "Create New Opportunity"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deal Name *</label>
                        <input
                            type="text"
                            required
                            value={newOpp.title}
                            onChange={(e) => setNewOpp({ ...newOpp, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                            placeholder="Enterprise Software Deal"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value *</label>
                            <input
                                type="number"
                                required
                                value={newOpp.value}
                                onChange={(e) => setNewOpp({ ...newOpp, value: parseFloat(e.target.value) || 0 })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                                placeholder="50000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stage</label>
                            <select
                                value={newOpp.stage}
                                onChange={(e) => setNewOpp({ ...newOpp, stage: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                            >
                                {STAGES.map(stage => (
                                    <option key={stage} value={stage}>{stage}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Close Date *</label>
                        <input
                            type="date"
                            required
                            value={newOpp.closeDate}
                            onChange={(e) => setNewOpp({ ...newOpp, closeDate: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                setEditingOppId(null);
                                setNewOpp({ title: '', value: 0, stage: 'Prospecting', closeDate: '' });
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg"
                        >
                            {editingOppId ? 'Update Opportunity' : 'Create Opportunity'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Opportunities;
