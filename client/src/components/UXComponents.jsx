import React from 'react';

export const TableSkeleton = ({ rows = 5, columns = 5 }) => {
    return (
        <div className="animate-pulse space-y-3">
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="flex gap-4">
                    {[...Array(columns)].map((_, j) => (
                        <div key={j} className="h-12 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
                    ))}
                </div>
            ))}
        </div>
    );
};

export const CardSkeleton = ({ count = 3 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                </div>
            ))}
        </div>
    );
};

export const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => {
    return (
        <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <Icon className="text-gray-400 dark:text-gray-500" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="bg-brand-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-700 transition-colors inline-flex items-center gap-2"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export const LoadingSpinner = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className="flex items-center justify-center py-12">
            <div className={`${sizeClasses[size]} border-4 border-gray-200 dark:border-gray-700 border-t-brand-600 rounded-full animate-spin`} />
        </div>
    );
};
