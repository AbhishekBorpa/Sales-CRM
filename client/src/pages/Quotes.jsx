import React, { useEffect, useState } from 'react';
import { FileText, Printer, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import QuotePDF from '../components/QuotePDF';

import Modal from '../components/Modal';
import { fetchQuotes, createQuote, updateQuote, deleteQuote } from '../services/api';

const Quotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuoteId, setEditingQuoteId] = useState(null);
    const [newQuote, setNewQuote] = useState({ name: '', amount: 0, status: 'Draft' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        fetchQuotes()
            .then(setQuotes)
            .catch(console.error);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingQuoteId) {
                await updateQuote(editingQuoteId, newQuote);
                toast.success('Quote updated successfully');
            } else {
                await createQuote(newQuote);
                toast.success('Quote created successfully');
            }
            setIsModalOpen(false);
            setEditingQuoteId(null);
            setNewQuote({ name: '', amount: 0, status: 'Draft' });
            loadData();
        } catch (error) {
            toast.error(error.message || (editingQuoteId ? 'Failed to update quote' : 'Failed to create quote'));
        }
    };

    const handleEdit = (quote) => {
        setEditingQuoteId(quote._id || quote.id);
        setNewQuote({
            name: quote.name,
            amount: quote.amount || 0,
            status: quote.status || 'Draft'
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this quote?')) return;
        try {
            await deleteQuote(id);
            toast.success('Quote deleted');
            loadData();
        } catch (error) {
            toast.error('Failed to delete quote');
        }
    };

    const handleOpenCreateModal = () => {
        setEditingQuoteId(null);
        setNewQuote({ name: '', amount: 0, status: 'Draft' });
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quotes</h1>
                <button
                    onClick={handleOpenCreateModal}
                    className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
                >
                    New Quote
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Quote Name</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {quotes.map((quote) => (
                            <tr key={quote.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                                    <FileText size={16} className="text-gray-400" />
                                    {quote.name}
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">${quote.amount.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                        {quote.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setSelectedQuote(quote)}
                                            className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1"
                                            title="View PDF"
                                        >
                                            <Printer size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(quote)}
                                            className="text-gray-400 hover:text-blue-600 transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(quote._id || quote.id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
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

            {selectedQuote && (
                <QuotePDF quote={selectedQuote} onClose={() => setSelectedQuote(null)} />
            )}

            {/* Create/Edit Quote Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingQuoteId(null);
                    setNewQuote({ name: '', amount: 0, status: 'Draft' });
                }}
                title={editingQuoteId ? "Edit Quote" : "Create New Quote"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Quote Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={newQuote.name}
                            onChange={(e) => setNewQuote({ ...newQuote, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                            placeholder="Quote for Enterprise Client"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Amount *
                        </label>
                        <input
                            type="number"
                            required
                            value={newQuote.amount}
                            onChange={(e) => setNewQuote({ ...newQuote, amount: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Status
                        </label>
                        <select
                            value={newQuote.status}
                            onChange={(e) => setNewQuote({ ...newQuote, status: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                        >
                            <option value="Draft">Draft</option>
                            <option value="Presented">Presented</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                setEditingQuoteId(null);
                                setNewQuote({ name: '', amount: 0, status: 'Draft' });
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg"
                        >
                            {editingQuoteId ? "Update Quote" : "Create Quote"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Quotes;
