import React, { useEffect, useState } from 'react';
import { CheckSquare, Calendar, Flag, Pencil, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import Modal from '../components/Modal';
import { toast } from 'sonner';

import { fetchTasks, createTask, updateTask, deleteTask } from '../services/api';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [newTask, setNewTask] = useState({ title: '', dueDate: '', priority: 'Normal', status: 'Open' });

    const loadData = () => {
        fetchTasks()
            .then(setTasks)
            .catch(console.error);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTaskId) {
                await updateTask(editingTaskId, newTask);
                toast.success('Task updated');
            } else {
                await createTask(newTask);
                toast.success('Task created');
            }
            setIsModalOpen(false);
            setEditingTaskId(null);
            setNewTask({ title: '', dueDate: '', priority: 'Normal', status: 'Open' });
            loadData();
        } catch (error) {
            console.error(error);
            toast.error(editingTaskId ? 'Failed to update task' : 'Failed to create task');
        }
    };

    const handleEdit = (task) => {
        setEditingTaskId(task._id);
        setNewTask({
            title: task.title,
            dueDate: task.dueDate,
            priority: task.priority,
            status: task.status
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await deleteTask(id);
            toast.success('Task deleted');
            loadData();
        } catch (error) {
            toast.error('Failed to delete task');
        }
    };

    const toggleTaskStatus = async (task) => {
        try {
            const newStatus = task.status === 'Completed' ? 'Open' : 'Completed';
            await updateTask(task._id, { status: newStatus });
            toast.success(`Task marked as ${newStatus}`);
            loadData();
        } catch (error) {
            toast.error('Failed to update task status');
        }
    };

    const handleOpenCreateModal = () => {
        setEditingTaskId(null);
        setNewTask({ title: '', dueDate: '', priority: 'Normal', status: 'Open' });
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Tasks</h1>
                <button
                    onClick={handleOpenCreateModal}
                    className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
                >
                    New Task
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {tasks.map(task => (
                        <div key={task._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center justify-between group text-sm">
                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    <input
                                        type="checkbox"
                                        checked={task.status === 'Completed'}
                                        onChange={() => toggleTaskStatus(task)}
                                        className="rounded text-brand-600 focus:ring-brand-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 h-5 w-5 cursor-pointer"
                                    />
                                </div>
                                <div className="cursor-pointer" onClick={() => handleEdit(task)}>
                                    <h3 className={clsx(
                                        "font-medium group-hover:text-brand-600 transition-colors",
                                        task.status === 'Completed' ? "text-gray-400 line-through" : "text-gray-900 dark:text-white"
                                    )}>
                                        {task.title}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {task.dueDate}
                                        </div>
                                        {task.relatedTo && (
                                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                                                {task.relatedTo}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <span className={clsx(
                                        "px-2 py-1 rounded text-xs font-medium border",
                                        task.priority === 'High' ? "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/30" :
                                            task.priority === 'Low' ? "bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-900/40 dark:text-gray-400 dark:border-gray-800" :
                                                "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/30"
                                    )}>
                                        {task.priority}
                                    </span>
                                    <span className={clsx(
                                        "text-xs font-semibold px-2 py-1 rounded",
                                        task.status === 'Completed' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    )}>
                                        {task.status}
                                    </span>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(task)}
                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Edit"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(task._id)}
                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingTaskId(null);
                    setNewTask({ title: '', dueDate: '', priority: 'Normal', status: 'Open' });
                }}
                title={editingTaskId ? "Edit Task" : "New Task"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                        <input
                            type="text"
                            required
                            value={newTask.title}
                            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                            <input
                                type="date"
                                required
                                value={newTask.dueDate}
                                onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                            <select
                                value={newTask.priority}
                                onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="Normal">Normal</option>
                                <option value="High">High</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                        <select
                            value={newTask.status}
                            onChange={e => setNewTask({ ...newTask, status: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500"
                        >
                            <option value="Open">Open</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg"
                        >
                            {editingTaskId ? "Update Task" : "Create Task"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Tasks;
