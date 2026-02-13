import React, { useEffect, useState } from 'react';
import { Package } from 'lucide-react';

import { fetchProducts } from '../services/api';

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts()
            .then(setProducts)
            .catch(console.error);
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
                <button className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors">
                    Add Product
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map(product => (
                    <div key={product.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-start gap-4">
                        <div className="p-3 bg-brand-50 dark:bg-brand-900/30 rounded-lg">
                            <Package className="text-brand-600 dark:text-brand-400" size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{product.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Code: {product.code}</p>
                            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                ${product.price.toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;
