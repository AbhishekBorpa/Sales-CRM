import React from 'react';
import { LayoutDashboard, Users, Briefcase, Building2, Settings, Package, FileText, CheckSquare, BarChart2, LifeBuoy, BookOpen, Link, Mail, Workflow, Copy, GitBranch } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const navSections = [
    {
        title: 'Core CRM',
        items: [
            { name: 'Dashboard', path: '/', icon: LayoutDashboard },
            { name: 'Leads', path: '/leads', icon: Users },
            { name: 'Opportunities', path: '/opportunities', icon: Briefcase },
            { name: 'Accounts', path: '/accounts', icon: Building2 },
        ]
    },
    {
        title: 'Sales & Tasks',
        items: [
            { name: 'Tasks', path: '/tasks', icon: CheckSquare },
            { name: 'Products', path: '/products', icon: Package },
            { name: 'Quotes', path: '/quotes', icon: FileText },
        ]
    },
    {
        title: 'Automation',
        items: [
            { name: 'Email Templates', path: '/email-templates', icon: Mail },
            { name: 'Workflows', path: '/workflows', icon: Workflow },
            { name: 'Web-to-Lead', path: '/web-to-lead-settings', icon: Link },
            { name: 'Assignment Rules', path: '/assignment-rules', icon: GitBranch },
            { name: 'Duplicate Check', path: '/duplicates', icon: Copy },
        ]
    },
    {
        title: 'Service & Analytics',
        items: [
            { name: 'Cases', path: '/cases', icon: LifeBuoy },
            { name: 'Knowledge Base', path: '/knowledge', icon: BookOpen },
            { name: 'Reports', path: '/reports', icon: BarChart2 },
        ]
    },
];

const Sidebar = () => {
    return (
        <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0 overflow-y-auto">
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        S
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">Sales Cloud</span>
                </div>
            </div>

            {/* Navigation Sections */}
            <nav className="p-4 pb-24 space-y-6">
                {navSections.map((section) => (
                    <div key={section.title}>
                        <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {section.title}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === '/'}
                                    className={({ isActive }) =>
                                        clsx(
                                            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                                            isActive
                                                ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        )
                                    }
                                >
                                    <item.icon size={18} />
                                    <span>{item.name}</span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer - Profile Link */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        clsx(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                            isActive
                                ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        )
                    }
                >
                    <Settings size={18} />
                    <span>Profile & Settings</span>
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;
