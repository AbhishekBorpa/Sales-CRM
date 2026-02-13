import React, { useEffect, useState } from 'react';
import { Mail, Phone, Calendar, Plus } from 'lucide-react';

import { fetchActivities } from '../services/api';

const ActivityTimeline = ({ parentId = 1 }) => { // Default to ID 1 for MVP
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        fetchActivities(parentId)
            .then(setActivities)
            .catch(console.error);
    }, [parentId]);

    const getIcon = (type) => {
        switch (type) {
            case 'Email': return <Mail size={16} className="text-white" />;
            case 'Call': return <Phone size={16} className="text-white" />;
            default: return <Calendar size={16} className="text-white" />;
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'Email': return 'bg-blue-500';
            case 'Call': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Activity Timeline</h3>
                <div className="flex gap-2">
                    <button className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-600 dark:text-gray-300">
                        <Mail size={16} />
                    </button>
                    <button className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-600 dark:text-gray-300">
                        <Phone size={16} />
                    </button>
                    <button className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-600 dark:text-gray-300">
                        <Calendar size={16} />
                    </button>
                </div>
            </div>

            <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 space-y-8 pl-8 py-2">
                {activities.map((activity) => (
                    <div key={activity.id} className="relative">
                        <div className={`absolute -left-[41px] top-0 p-2 rounded-full ${getColor(activity.type)}`}>
                            {getIcon(activity.type)}
                        </div>
                        <div>
                            <div className="flex justify-between items-start">
                                <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{activity.subject}</h4>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{activity.date}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{activity.notes}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityTimeline;
