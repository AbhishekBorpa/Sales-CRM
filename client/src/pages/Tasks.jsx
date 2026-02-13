import React, { useEffect, useState } from 'react';
import { CheckSquare, Calendar, Flag } from 'lucide-react';
import clsx from 'clsx';
import Modal from '../components/Modal';
import { toast } from 'sonner';

import { fetchTasks, createTask } from '../services/api';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', dueDate: '', priority: 'Normal', status: 'Open' });

    useEffect(() => {
        fetchTasks()
            .then(setTasks)
            .catch(console.error);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const created = await createTask(newTask);
            setTasks([...tasks, created]);
            setIsModalOpen(false);
            setNewTask({ title: '', dueDate: '', priority: 'Normal', status: 'Open' });
            toast.success('Task created');
        } catch (error) {
            console.error(error);
            toast.error('Failed to create task');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Tasks</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
                >
                    New Task
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {tasks.map(task => (
                        <div key={task.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center justify-between group">
                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    <input type="checkbox" className="rounded text-brand-600 focus:ring-brand-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-brand-600 transition-colors cursor-pointer">{task.title}</h3>
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
                            <div className="flex items-center gap-3">
                                <span className={clsx(
                                    "px-2 py-1 rounded text-xs font-medium border",
                                    task.priority === 'High' ? "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/30" :
                                        "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/30"
                                )}>
                                    {task.priority}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                    {task.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Task">
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
                            </select>
                        </div>
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
                            Create Task
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Tasks;
