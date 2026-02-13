import React, { useState } from 'react';
import { Search, Bell, User, Settings, LogOut, Moon, Sun, Plus, Menu } from 'lucide-react';
import clsx from 'clsx';

const Navbar = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const notifications = [
        { id: 1, type: 'lead', message: 'New lead assigned: John Doe', time: '5m ago', unread: true },
        { id: 2, type: 'task', message: 'Task due today: Follow up with client', time: '1h ago', unread: true },
        { id: 3, type: 'opportunity', message: 'Opportunity won: Enterprise Deal', time: '2h ago', unread: false },
        { id: 4, type: 'email', message: 'Email campaign completed', time: '3h ago', unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
            <div className="px-6 py-3">
                <div className="flex items-center justify-between">
                    {/* Left Section - Logo & Search */}
                    <div className="flex items-center gap-6 flex-1">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                S
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white hidden md:block">
                                Sales Cloud
                            </span>
                        </div>

                        {/* Global Search */}
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search leads, opportunities, accounts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-900 border-0 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Actions & User */}
                    <div className="flex items-center gap-3">
                        {/* Quick Add Button */}
                        <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium">
                            <Plus size={18} />
                            New
                        </button>

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Toggle dark mode"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowNotifications(!showNotifications);
                                    setShowUserMenu(false);
                                }}
                                className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2">
                                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className={clsx(
                                                    "px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors",
                                                    notif.unread && "bg-blue-50/50 dark:bg-blue-900/10"
                                                )}
                                            >
                                                <p className="text-sm text-gray-900 dark:text-white font-medium">
                                                    {notif.message}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {notif.time}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                                        <button className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 font-medium">
                                            View all notifications
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowUserMenu(!showUserMenu);
                                    setShowNotifications(false);
                                }}
                                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
                                    <User size={18} className="text-brand-600 dark:text-brand-400" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
                                    Demo Admin
                                </span>
                            </button>

                            {/* User Dropdown */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2">
                                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <p className="font-semibold text-gray-900 dark:text-white">Demo Admin</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">admin@salescloud.com</p>
                                    </div>
                                    <div className="py-2">
                                        <a
                                            href="/profile"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <User size={16} />
                                            Your Profile
                                        </a>
                                        <a
                                            href="/profile"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <Settings size={16} />
                                            Settings
                                        </a>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                                        <button
                                            onClick={() => console.log('Logout')}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full"
                                        >
                                            <LogOut size={16} />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
