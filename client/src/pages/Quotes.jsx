import React, { useEffect, useState } from 'react';
import { FileText, Printer } from 'lucide-react';
import QuotePDF from '../components/QuotePDF';

import { fetchQuotes } from '../services/api';

const Quotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [selectedQuote, setSelectedQuote] = useState(null);

    useEffect(() => {
        fetchQuotes()
            .then(setQuotes)
            .catch(console.error);
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quotes</h1>
                <button className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors">
                    New Quote
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Quote Name</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {quotes.map((quote) => (
                            <tr key={quote.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                                    <FileText size={16} className="text-gray-400" />
                                    {quote.name}
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">${quote.amount.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                        {quote.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => setSelectedQuote(quote)}
                                        className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1"
                                    >
                                        <Printer size={14} /> View PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedQuote && (
                <QuotePDF quote={selectedQuote} onClose={() => setSelectedQuote(null)} />
            )}
        </div>
    );
};

export default Quotes;
