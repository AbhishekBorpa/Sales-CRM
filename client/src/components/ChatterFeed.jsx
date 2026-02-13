import React, { useEffect, useState } from 'react';
import { fetchFeed, createPost, deletePost } from '../services/api';
import { MessageSquare, Send, User, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const ChatterFeed = ({ recordId, model }) => {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');

    useEffect(() => {
        if (recordId) loadFeed();
    }, [recordId]);

    const loadFeed = async () => {
        try {
            const data = await fetchFeed(recordId);
            setPosts(data);
        } catch (error) {
            console.error('Failed to load feed:', error);
        }
    };

    const handlePost = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            const newPost = await createPost({
                content,
                relatedRecordId: recordId,
                relatedModel: model,
                type: 'Post'
            });
            setPosts([newPost, ...posts]);
            setContent('');
            toast.success('Posted to Chatter');
        } catch (error) {
            toast.error('Failed to post');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deletePost(id);
            setPosts(posts.filter(p => p._id !== id));
            toast.success('Post deleted');
        } catch (error) {
            toast.error('Failed to delete post');
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700 h-full flex flex-col">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <MessageSquare size={18} />
                Chatter Feed
            </h3>

            {/* Post Creation */}
            <form onSubmit={handlePost} className="mb-6 relative">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share an update, poll, or question..."
                    className="w-full pl-4 pr-12 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-brand-500 resize-none shadow-sm"
                    rows={2}
                />
                <button
                    type="submit"
                    disabled={!content.trim()}
                    className="absolute right-2 bottom-2.5 p-1.5 bg-brand-600 text-white rounded-md hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send size={14} />
                </button>
            </form>

            {/* Feed List */}
            <div className="flex-1 overflow-y-auto space-y-4 max-h-[400px] pr-2 custom-scrollbar">
                {posts.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-4">No posts yet. Be the first!</p>
                )}

                {posts.map((post) => (
                    <div key={post._id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 group">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 text-xs font-bold">
                                    <User size={12} />
                                </div>
                                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{post.author}</span>
                                <span className="text-xs text-gray-400">• {new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                            <button
                                onClick={() => handleDelete(post._id)}
                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {post.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatterFeed;
