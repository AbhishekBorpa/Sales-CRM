import React, { useState } from 'react';
import { Code, Copy, ExternalLink, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const WebToLeadSettings = () => {
    const [copied, setCopied] = useState(false);

    const formUrl = `${window.location.origin}/web-to-lead`;
    const embedCode = `<iframe src="${formUrl}" width="100%" height="800" frameborder="0"></iframe>`;

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Web-to-Lead Form</h1>
                <p className="text-gray-600 dark:text-gray-400">Generate and embed a public lead capture form on your website.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <ExternalLink size={20} />
                        Direct Link
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Share this URL directly with prospects or use it in email campaigns.
                    </p>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            readOnly
                            value={formUrl}
                            className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-mono text-gray-900 dark:text-white"
                        />
                        <button
                            onClick={() => handleCopy(formUrl)}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                        >
                            {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                        <a
                            href={formUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <ExternalLink size={20} />
                        </a>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Code size={20} />
                        Embed Code
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Copy this HTML snippet and paste it into your website to embed the form.
                    </p>
                    <div className="relative">
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                            {embedCode}
                        </pre>
                        <button
                            onClick={() => handleCopy(embedCode)}
                            className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
                        >
                            {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">How it works</h3>
                <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
                    <li>Prospects fill out the form with their contact information</li>
                    <li>Submissions are automatically created as new leads in your CRM</li>
                    <li>Leads are scored and ready for your sales team to follow up</li>
                </ul>
            </div>
        </div>
    );
};

export default WebToLeadSettings;
