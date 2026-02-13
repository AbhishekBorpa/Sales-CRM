import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building, Globe, Phone, Mail, Edit2, Trash2, ArrowLeft, Briefcase, Users } from 'lucide-react';
import { toast } from 'sonner';
import { fetchAccount, updateAccount, deleteAccount, fetchOpportunities } from '../services/api';
import Modal from '../components/Modal';

const AccountDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [account, setAccount] = useState(null);
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const loadData = async () => {
            try {
                const accData = await fetchAccount(id);
                setAccount(accData);
                setFormData(accData);

                // Fetch related opportunities
                const allOpps = await fetchOpportunities();
                setOpportunities(allOpps.filter(opp => opp.accountId?._id === id || opp.accountId === id));
            } catch (error) {
                console.error(error);
                toast.error('Failed to load account details');
                navigate('/accounts');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Move this account to Recycle Bin?')) return;
        try {
            await deleteAccount(id);
            toast.success('Account moved to Recycle Bin');
            navigate('/accounts');
        } catch (error) {
            toast.error('Failed to delete account');
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const updated = await updateAccount(id, formData);
            setAccount(updated);
            setIsEditModalOpen(false);
            toast.success('Account updated successfully');
        } catch (error) {
            toast.error('Failed to update account');
        }
    };

    if (loading) return <div className="flex justify-center p-10">Loading...</div>;
    if (!account) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/accounts')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Building className="text-brand-500" size={24} />
                        {account.name}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs font-medium">
                            {account.industry || 'No Industry'}
                        </span>
                        {account.website && (
                            <a href={account.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-brand-600">
                                <Globe size={14} /> {account.website.replace(/^https?:\/\//, '')}
                            </a>
                        )}
                        {account.phone && (
                            <span className="flex items-center gap-1">
                                <Phone size={14} /> {account.phone}
                            </span>
                        )}
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Details & Related Lists */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Related Opportunities */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Briefcase size={18} />
                            Opportunities ({opportunities.length})
                        </h3>
                        {opportunities.length > 0 ? (
                            <div className="space-y-3">
                                {opportunities.map(opp => (
                                    <div
                                        key={opp._id}
                                        className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer border border-gray-100 dark:border-gray-600"
                                        onClick={() => navigate(`/opportunities/${opp._id}`)}
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{opp.title}</p>
                                            <p className="text-xs text-gray-500">Stage: {opp.stage}</p>
                                        </div>
                                        <div className="font-semibold text-brand-600">
                                            ${opp.value?.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic text-sm">No opportunities found for this account.</p>
                        )}
                    </div>
                </div>

                {/* Right Column: Info */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Account Info</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold">Created On</label>
                                <p className="text-sm text-gray-900 dark:text-gray-300">
                                    {new Date(account.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold">Total Deal Value</label>
                                <p className="text-lg font-bold text-green-600">
                                    ${opportunities.reduce((sum, opp) => sum + (opp.value || 0), 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Account"
            >
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Account Name"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                    />
                    <select
                        value={formData.industry || ''}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
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
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                    />
                    <input
                        type="url"
                        placeholder="Website"
                        value={formData.website || ''}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm text-white bg-brand-600 hover:bg-brand-700 rounded-lg"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AccountDetail;
