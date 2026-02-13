import React, { useEffect, useState } from 'react';
import { Package, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import Modal from '../components/Modal';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../services/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [newProduct, setNewProduct] = useState({ name: '', code: '', price: 0, description: '', isActive: true });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        fetchProducts()
            .then(setProducts)
            .catch(console.error);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProductId) {
                await updateProduct(editingProductId, newProduct);
                toast.success('Product updated successfully');
            } else {
                await createProduct(newProduct);
                toast.success('Product created successfully');
            }
            setIsModalOpen(false);
            setEditingProductId(null);
            setNewProduct({ name: '', code: '', price: 0, description: '', isActive: true });
            loadData();
        } catch (error) {
            toast.error(error.message || (editingProductId ? 'Failed to update product' : 'Failed to create product'));
        }
    };

    const handleEdit = (product) => {
        setEditingProductId(product._id || product.id);
        setNewProduct({
            name: product.name,
            code: product.code || '',
            price: product.price || 0,
            description: product.description || '',
            isActive: product.isActive ?? true
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await deleteProduct(id);
            toast.success('Product deleted');
            loadData();
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const handleOpenCreateModal = () => {
        setEditingProductId(null);
        setNewProduct({ name: '', code: '', price: 0, description: '', isActive: true });
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
                <button
                    onClick={handleOpenCreateModal}
                    className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
                >
                    Add Product
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map(product => (
                    <div key={product._id || product.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-start justify-between group">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-brand-50 dark:bg-brand-900/30 rounded-lg">
                                <Package className="text-brand-600 dark:text-brand-400" size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-brand-600 transition-colors">{product.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Code: {product.code || '-'}</p>
                                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                    ${(product.price || 0).toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(product)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Edit"
                            >
                                <Pencil size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(product._id || product.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Product Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingProductId(null);
                    setNewProduct({ name: '', code: '', price: 0, description: '', isActive: true });
                }}
                title={editingProductId ? "Edit Product" : "Add New Product"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                            placeholder="Professional Services"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Product Code
                            </label>
                            <input
                                type="text"
                                value={newProduct.code}
                                onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                                placeholder="PRO-001"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Price *
                            </label>
                            <input
                                type="number"
                                required
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                            rows="3"
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                setEditingProductId(null);
                                setNewProduct({ name: '', code: '', price: 0, description: '', isActive: true });
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg"
                        >
                            {editingProductId ? "Update Product" : "Add Product"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Products;
