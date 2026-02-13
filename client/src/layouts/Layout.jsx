import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Toaster } from 'sonner';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
            <Sidebar />
            <main className="ml-64">
                <Header />
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
            <Toaster position="top-right" richColors />
        </div>
    );
};

export default Layout;
