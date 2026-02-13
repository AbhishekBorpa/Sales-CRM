import React from 'react';

const QuotePDF = ({ quote, onClose }) => {
    // Mock company info
    const COMPANY_INFO = {
        name: 'Sales Cloud Inc.',
        address: '123 Market St, San Francisco, CA 94105',
        phone: '(415) 555-0123',
        email: 'sales@salescloud.com'
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
            <div className="bg-white w-full max-w-4xl min-h-[500px] shadow-2xl m-8 relative animate-in fade-in zoom-in-95 duration-200">
                {/* PDF Content - This is what will be printed */}
                <div id="printable-quote" className="p-16 bg-white text-gray-900 print:p-0">
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
                            <p className="text-gray-500">#{quote.name.split(' ')[0]}</p>
                        </div>
                        <div className="text-right">
                            <h2 className="font-bold text-xl mb-1">{COMPANY_INFO.name}</h2>
                            <p className="text-gray-500 text-sm whitespace-pre-line">{COMPANY_INFO.address}</p>
                            <p className="text-gray-500 text-sm mt-1">{COMPANY_INFO.phone}</p>
                            <p className="text-gray-500 text-sm">{COMPANY_INFO.email}</p>
                        </div>
                    </div>

                    <div className="border-t border-b border-gray-200 py-8 mb-12 grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To</h3>
                            <p className="font-semibold text-lg">{quote.name.split(' - ')[1] || 'Valued Customer'}</p>
                            <p className="text-gray-500">123 Business Rd</p>
                            <p className="text-gray-500">New York, NY 10001</p>
                        </div>
                        <div className="text-right">
                            <div className="inline-block text-left">
                                <div className="flex justify-between gap-8 mb-2">
                                    <span className="text-gray-500">Date:</span>
                                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between gap-8 mb-2">
                                    <span className="text-gray-500">Status:</span>
                                    <span className="font-medium bg-gray-100 px-2 rounded">{quote.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <table className="w-full mb-12">
                        <thead>
                            <tr className="border-b-2 border-gray-900">
                                <th className="text-left py-3 font-bold">Description</th>
                                <th className="text-right py-3 font-bold">Qty</th>
                                <th className="text-right py-3 font-bold">Unit Price</th>
                                <th className="text-right py-3 font-bold">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {/* Mock items based on total amount */}
                            <tr>
                                <td className="py-4 font-medium">Standard License</td>
                                <td className="py-4 text-right">1</td>
                                <td className="py-4 text-right">${quote.amount.toLocaleString()}</td>
                                <td className="py-4 text-right font-bold">${quote.amount.toLocaleString()}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" className="pt-8 text-right font-medium text-gray-500">Subtotal</td>
                                <td className="pt-8 text-right font-medium">${quote.amount.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td colSpan="3" className="py-2 text-right font-medium text-gray-500">Tax (10%)</td>
                                <td className="py-2 text-right font-medium">${(quote.amount * 0.1).toLocaleString()}</td>
                            </tr>
                            <tr className="text-2xl font-bold">
                                <td colSpan="3" className="pt-4 text-right">Total</td>
                                <td className="pt-4 text-right text-brand-600">${(quote.amount * 1.1).toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="border-t border-gray-200 pt-8 text-center text-gray-500 text-sm">
                        <p>Thank you for your business!</p>
                        <p className="mt-1">Please remit payment within 30 days.</p>
                    </div>
                </div>

                {/* Toolbar - Hidden when printing */}
                <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center rounded-b-xl print:hidden">
                    <button onClick={onClose} className="px-4 py-2 font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                        Close
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-6 py-2 font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print PDF
                    </button>
                </div>
            </div>

            {/* Global Print Styles */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #printable-quote, #printable-quote * {
                        visibility: visible;
                    }
                    #printable-quote {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 20px;
                    }
                }
            `}</style>
        </div>
    );
};

export default QuotePDF;
