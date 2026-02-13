import React, { useEffect, useState } from 'react';
import { AlertTriangle, Merge, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { LoadingSpinner, EmptyState } from '../components/UXComponents';

const API_URL = 'http://localhost:5001/api';

const DuplicateDetection = () => {
    const [duplicates, setDuplicates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [entityType, setEntityType] = useState('Lead');
    const [threshold, setThreshold] = useState(70);
    const [selectedPair, setSelectedPair] = useState(null);
    const [fieldSelections, setFieldSelections] = useState({});

    const scanForDuplicates = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/duplicates?entityType=${entityType}&threshold=${threshold}`);
            const data = await response.json();
            setDuplicates(data.duplicates || []);
            toast.success(`Found ${data.total} potential duplicate${data.total !== 1 ? 's' : ''}`);
        } catch (error) {
            toast.error('Failed to scan for duplicates');
        } finally {
            setLoading(false);
        }
    };

    const handleMerge = async () => {
        if (!selectedPair) return;

        const [record1, record2] = selectedPair.records;
        const primaryId = fieldSelections._primary || record1._id;
        const duplicateIds = [record1._id, record2._id].filter(id => id !== primaryId);

        try {
            const response = await fetch(`${API_URL}/duplicates/merge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    primaryId,
                    duplicateIds,
                    entityType,
                    fieldSelections
                })
            });

            if (response.ok) {
                toast.success('Records merged successfully');
                setDuplicates(duplicates.filter(d => d !== selectedPair));
                setSelectedPair(null);
                setFieldSelections({});
            }
        } catch (error) {
            toast.error('Failed to merge records');
        }
    };

    const openMergeWizard = (pair) => {
        setSelectedPair(pair);
        const [record1] = pair.records;
        setFieldSelections({ _primary: record1._id });
    };

    const selectField = (field, recordId) => {
        setFieldSelections({ ...fieldSelections, [field]: recordId });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Duplicate Detection</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Find and merge duplicate records</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Entity Type
                        </label>
                        <select
                            value={entityType}
                            onChange={(e) => setEntityType(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                        >
                            <option value="Lead">Leads</option>
                            <option value="Opportunity">Opportunities</option>
                            <option value="Account">Accounts</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Match Threshold: {threshold}%
                        </label>
                        <input
                            type="range"
                            min="50"
                            max="100"
                            value={threshold}
                            onChange={(e) => setThreshold(parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>
                    <button
                        onClick={scanForDuplicates}
                        disabled={loading}
                        className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50"
                    >
                        {loading ? 'Scanning...' : 'Scan for Duplicates'}
                    </button>
                </div>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : duplicates.length > 0 ? (
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Potential Duplicates ({duplicates.length})
                    </h2>
                    {duplicates.map((dup, index) => {
                        const [record1, record2] = dup.records;
                        return (
                            <div
                                key={index}
                                className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="text-yellow-600 mt-1" size={20} />
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-sm font-bold text-yellow-900 dark:text-yellow-200">
                                                    {dup.score}% Match
                                                </span>
                                                {dup.matchedFields.name && (
                                                    <span className="text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-200 px-2 py-0.5 rounded">
                                                        Name
                                                    </span>
                                                )}
                                                {dup.matchedFields.email && (
                                                    <span className="text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-200 px-2 py-0.5 rounded">
                                                        Email
                                                    </span>
                                                )}
                                                {dup.matchedFields.company && (
                                                    <span className="text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-200 px-2 py-0.5 rounded">
                                                        Company
                                                    </span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {record1.name || record1.title}
                                                    </p>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        {record1.company || record1.email || 'No additional info'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {record2.name || record2.title}
                                                    </p>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        {record2.company || record2.email || 'No additional info'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => openMergeWizard(dup)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700"
                                    >
                                        <Merge size={14} />
                                        Merge
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={AlertTriangle}
                    title="No duplicates found"
                    description="Click 'Scan for Duplicates' to find potential duplicate records in your database"
                    actionLabel="Scan Now"
                    onAction={scanForDuplicates}
                />
            )}

            {/* Merge Wizard Modal */}
            {selectedPair && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Merge Records</h2>
                            <button
                                onClick={() => setSelectedPair(null)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Select which values to keep for each field. The selected record will be kept as primary.
                        </p>

                        <div className="space-y-3">
                            {['name', 'title', 'company', 'email', 'phone', 'status', 'value'].map((field) => {
                                const [record1, record2] = selectedPair.records;
                                const val1 = record1[field];
                                const val2 = record2[field];

                                if (!val1 && !val2) return null;

                                return (
                                    <div key={field} className="border dark:border-gray-700 rounded-lg p-3">
                                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                                            {field}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => selectField(field, record1._id)}
                                                className={`p-2 text-left rounded border-2 transition-colors ${fieldSelections[field] === record1._id || (!fieldSelections[field] && fieldSelections._primary === record1._id)
                                                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                                                    : 'border-gray-200 dark:border-gray-700'
                                                    }`}
                                            >
                                                {val1 ? (
                                                    <span className="text-sm text-gray-900 dark:text-white">{val1}</span>
                                                ) : (
                                                    <span className="text-sm text-gray-400">Empty</span>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => selectField(field, record2._id)}
                                                className={`p-2 text-left rounded border-2 transition-colors ${fieldSelections[field] === record2._id || (!fieldSelections[field] && fieldSelections._primary === record2._id)
                                                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                                                    : 'border-gray-200 dark:border-gray-700'
                                                    }`}
                                            >
                                                {val2 ? (
                                                    <span className="text-sm text-gray-900 dark:text-white">{val2}</span>
                                                ) : (
                                                    <span className="text-sm text-gray-400">Empty</span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setSelectedPair(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleMerge}
                                className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg flex items-center gap-2"
                            >
                                <Check size={16} />
                                Merge Records
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DuplicateDetection;
