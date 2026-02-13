import React, { useState } from 'react';
import { Search, Bell, User } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 h-16 px-8 flex items-center justify-between sticky top-0 z-10">
            <div className="flex-1 max-w-xl relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search Leads, Opportunities, Accounts..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-gray-100 placeholder-gray-500"
                />
            </div>

            <div className="flex items-center gap-4 ml-4">
                <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                    <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-700 dark:text-brand-300 font-semibold">
                        JD
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">John Doe</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
