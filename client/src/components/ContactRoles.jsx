import React, { useEffect, useState } from 'react';
import { Users, Star } from 'lucide-react';
import { fetchContactRoles } from '../services/api';

const ContactRoles = ({ opportunityId }) => {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        if (opportunityId) {
            fetchContactRoles(opportunityId).then(setRoles).catch(console.error);
        }
    }, [opportunityId]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <Users size={18} className="text-gray-400" />
                Contact Roles
            </h3>

            <div className="space-y-3">
                {roles.map(role => (
                    <div key={role.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{role.contactName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{role.role}</p>
                        </div>
                        {role.isPrimary && (
                            <span className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <Star size={10} fill="currentColor" /> Primary
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContactRoles;
