import React, { useEffect, useState } from 'react';
import { Users, Search, MoreVertical, Pencil, Trash2, Mail, Phone, Building2, UserPlus } from 'lucide-react';
import Modal from '../components/Modal';
import { toast } from 'sonner';
import { fetchContacts, createContact, updateContact, deleteContact, fetchAccounts } from '../services/api';

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContactId, setEditingContactId] = useState(null);
    const [newContact, setNewContact] = useState({
        name: '',
        email: '',
        phone: '',
        title: '',
        accountId: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [contactsData, accountsData] = await Promise.all([
                fetchContacts(),
                fetchAccounts()
            ]);
            setContacts(contactsData);
            setAccounts(accountsData);
        } catch (error) {
            console.error('Failed to load data:', error);
            toast.error('Failed to load contacts');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingContactId) {
                await updateContact(editingContactId, newContact);
                toast.success('Contact updated successfully');
            } else {
                await createContact(newContact);
                toast.success('Contact created successfully');
            }
            setIsModalOpen(false);
            resetForm();
            loadData();
        } catch (error) {
            toast.error(error.message || 'Error saving contact');
        }
    };

    const handleEdit = (contact) => {
        setEditingContactId(contact._id || contact.id);
        setNewContact({
            name: contact.name,
            email: contact.email || '',
            phone: contact.phone || '',
            title: contact.title || '',
            accountId: contact.accountId?._id || contact.accountId || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this contact?')) return;
        try {
            await deleteContact(id);
            toast.success('Contact deleted');
            loadData();
        } catch (error) {
            toast.error('Failed to delete contact');
        }
    };

    const resetForm = () => {
        setEditingContactId(null);
        setNewContact({ name: '', email: '', phone: '', title: '', accountId: '' });
    };

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contacts</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your business contacts and relationships</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors flex items-center gap-2"
                >
                    <UserPlus size={18} />
                    New Contact
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search contacts by name, email, or title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Contacts Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Account</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact Info</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredContacts.map(contact => (
                            <tr key={contact._id || contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                                            {contact.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{contact.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{contact.title || 'No Title'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <Building2 size={14} className="text-gray-400" />
                                        {contact.accountId?.name || contact.accountName || 'No Account'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                            <Mail size={12} />
                                            {contact.email || '-'}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                            <Phone size={12} />
                                            {contact.phone || '-'}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(contact)}
                                            className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded-lg transition-colors"
                                            title="Edit Contact"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(contact._id || contact.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                            title="Delete Contact"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredContacts.length === 0 && (
                    <div className="p-12 text-center">
                        <Users className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No contacts found</h3>
                        <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or add a new contact.</p>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); resetForm(); }}
                title={editingContactId ? 'Edit Contact' : 'Create New Contact'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                            <input
                                type="text"
                                required
                                value={newContact.name}
                                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                            <input
                                type="text"
                                value={newContact.title}
                                onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                                placeholder="Marketing Manager"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account</label>
                            <select
                                value={newContact.accountId}
                                onChange={(e) => setNewContact({ ...newContact, accountId: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                            >
                                <option value="">Select Account</option>
                                {accounts.map(acc => (
                                    <option key={acc._id} value={acc._id}>{acc.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                value={newContact.email}
                                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                            <input
                                type="text"
                                value={newContact.phone}
                                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                                placeholder="+1 234 567 890"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => { setIsModalOpen(false); resetForm(); }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
                        >
                            {editingContactId ? 'Update Contact' : 'Create Contact'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Contacts;
