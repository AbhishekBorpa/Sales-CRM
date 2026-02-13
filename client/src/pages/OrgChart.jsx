import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../services/api';
import { User, Shield, Briefcase, ChevronDown } from 'lucide-react';

const OrgChart = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers().then(data => {
            setUsers(data);
            setLoading(false);
        });
    }, []);

    // Simple hierarchy logic based on roles for demo purposes
    // In a real app, we'd have a 'reportsTo' field
    const admins = users.filter(u => u.role === 'Admin');
    const managers = users.filter(u => u.role === 'Manager');
    const staff = users.filter(u => u.role === 'User');

    if (loading) return <div>Loading...</div>;

    const UserCard = ({ user, roleColor }) => (
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 min-w-[200px] animate-fade-in relative z-10">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white mb-3 ${roleColor}`}>
                <User size={20} />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">{user.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{user.title}</p>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                {user.role}
            </span>
        </div>
    );

    return (
        <div className="space-y-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Organization Hierarchy</h1>

            <div className="inline-flex flex-col items-center relative">
                {/* Connecting Lines Layer */}
                <div className="absolute top-10 bottom-20 w-px bg-gray-300 dark:bg-gray-600 -z-0"></div>

                {/* Level 1: Admins */}
                <div className="flex gap-8 mb-16 relative z-10">
                    {admins.map(user => (
                        <UserCard key={user._id} user={user} roleColor="bg-purple-600" />
                    ))}
                    {admins.length === 0 && <div className="text-gray-400">No Admins</div>}
                </div>

                {/* Connector Horizontal for Managers */}
                {managers.length > 1 && <div className="w-1/2 h-px bg-gray-300 dark:bg-gray-600 mb-8 -mt-8 relative z-0"></div>}

                {/* Level 2: Managers */}
                <div className="flex flex-wrap justify-center gap-8 mb-16 relative z-10">
                    {managers.map(user => (
                        <div key={user._id} className="flex flex-col items-center">
                            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 -mt-8 mb-0"></div>
                            <UserCard user={user} roleColor="bg-blue-600" />
                        </div>
                    ))}
                    {managers.length === 0 && (
                        <div className="p-4 border border-dashed border-gray-300 rounded-lg text-gray-400 text-sm">
                            No Managers seeded
                        </div>
                    )}
                </div>

                {/* Level 3: Staff */}
                <div className="flex flex-wrap justify-center gap-6 relative z-10">
                    {staff.map(user => (
                        <div key={user._id} className="flex flex-col items-center">
                            {/* Only show connector if there are managers above, else connect to admin line roughly */}
                            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 -mt-8 mb-0"></div>
                            <UserCard user={user} roleColor="bg-green-600" />
                        </div>
                    ))}
                    {staff.length === 0 && (
                        <div className="p-4 border border-dashed border-gray-300 rounded-lg text-gray-400 text-sm">
                            No Staff seeded
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrgChart;
