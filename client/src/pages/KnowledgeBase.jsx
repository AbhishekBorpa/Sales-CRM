import React, { useEffect, useState } from 'react';
import { fetchArticles, createArticle } from '../services/api';
import { BookOpen, Search, Plus, FileText, ChevronRight } from 'lucide-react';
import Modal from '../components/Modal';
import { toast } from 'sonner';

const KnowledgeBase = () => {
    const [articles, setArticles] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newArticle, setNewArticle] = useState({ title: '', content: '', category: 'General' });
    const [selectedArticle, setSelectedArticle] = useState(null);

    useEffect(() => {
        fetchArticles().then(setArticles).catch(console.error);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const created = await createArticle(newArticle);
            setArticles([...articles, created]);
            setIsModalOpen(false);
            setNewArticle({ title: '', content: '', category: 'General' });
            toast.success('Article published');
        } catch (error) {
            toast.error('Failed to publish article');
        }
    };

    const filteredArticles = articles.filter(a =>
        a.title.toLowerCase().includes(filterText.toLowerCase()) ||
        a.content.toLowerCase().includes(filterText.toLowerCase())
    );

    const categories = ['General', 'Technical', 'Billing', 'Product'];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Knowledge Base</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 flex items-center gap-2"
                >
                    <Plus size={16} />
                    New Article
                </button>
            </div>

            {/* Search Hero */}
            <div className="bg-brand-900 rounded-xl p-8 text-center relative overflow-hidden">
                <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                    <h2 className="text-2xl font-bold text-white">How can we help you?</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-brand-500 shadow-lg text-gray-900"
                        />
                    </div>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BookOpen size={200} className="text-white" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Categories */}
                <div className="lg:col-span-1 space-y-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Categories</h3>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all text-left group"
                        >
                            <span className="text-gray-600 dark:text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 font-medium">{cat}</span>
                            <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-500" />
                        </button>
                    ))}
                </div>

                {/* Article Grid */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredArticles.map(article => (
                        <div
                            key={article._id}
                            onClick={() => setSelectedArticle(article)}
                            className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2 py-1 rounded-md">
                                    {article.category}
                                </span>
                                <span className="text-xs text-gray-400">{new Date(article.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-600 transition-colors">
                                {article.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                {article.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Article Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Publish Article">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                        <input
                            type="text"
                            required
                            value={newArticle.title}
                            onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <select
                            value={newArticle.category}
                            onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                        <textarea
                            required
                            value={newArticle.content}
                            onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                            rows={6}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="submit" className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700">
                            Publish
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default KnowledgeBase;
