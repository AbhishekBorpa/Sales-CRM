import React, { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { fetchOpportunityProducts } from '../services/api';

const OpportunityProducts = ({ opportunityId }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (opportunityId) {
            fetchOpportunityProducts(opportunityId).then(setProducts).catch(console.error);
        }
    }, [opportunityId]);

    const totalAmount = products.reduce((sum, p) => sum + p.totalPrice, 0);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Package size={18} className="text-gray-400" />
                    Products
                </h3>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Total: ${totalAmount.toLocaleString()}
                </span>
            </div>

            <table className="w-full text-left text-sm">
                <thead className="text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700">
                    <tr>
                        <th className="pb-2">Product</th>
                        <th className="pb-2">Qty</th>
                        <th className="pb-2 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {products.map(item => (
                        <tr key={item.id}>
                            <td className="py-2 text-gray-900 dark:text-white">{item.productName}</td>
                            <td className="py-2 text-gray-600 dark:text-gray-400">{item.quantity}</td>
                            <td className="py-2 text-right text-gray-900 dark:text-white">${item.totalPrice.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OpportunityProducts;
