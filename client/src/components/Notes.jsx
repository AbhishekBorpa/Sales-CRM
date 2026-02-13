import React, { useEffect, useState } from 'react';
import { StickyNote, Plus } from 'lucide-react';
import { fetchNotes, createNote } from '../services/api';
import { toast } from 'sonner';

const Notes = ({ parentId }) => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (parentId) {
            fetchNotes(parentId).then(setNotes).catch(console.error);
        }
    }, [parentId]);

    const handleAddNote = async (e) => {
        e.preventDefault();
        try {
            const created = await createNote({ parentId, text: newNote });
            setNotes([...notes, created]);
            setNewNote('');
            setIsAdding(false);
            toast.success('Note added');
        } catch (error) {
            toast.error('Failed to add note');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <StickyNote size={18} className="text-gray-400" />
                    Notes & Attachments
                </h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                    <Plus size={18} className="text-gray-500" />
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAddNote} className="mb-4">
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Write a note..."
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 text-sm mb-2"
                        rows="3"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="text-xs bg-brand-600 text-white px-3 py-1.5 rounded hover:bg-brand-700"
                        >
                            Save Note
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-3">
                {notes.map((note, index) => (
                    <div key={note._id || index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{note.text}</p>
                        <span className="text-xs text-gray-400">{note.createdAt}</span>
                    </div>
                ))}
                {notes.length === 0 && !isAdding && (
                    <p className="text-sm text-gray-400 italic">No notes yet.</p>
                )}
            </div>
        </div>
    );
};

export default Notes;
