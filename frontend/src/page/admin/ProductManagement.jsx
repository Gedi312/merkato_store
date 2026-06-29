import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { initialProducts } from '../../utils/mockData';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    category: '',
    stock: '',
    image: '',
    description: '',
    status: 'Active'
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data || []);
      setError(null);
    } catch (err) {
      console.warn("Backend API fetching failed, falling back to initialProducts:", err);
      // Fallback
      setProducts(initialProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Try local backend first
        await axios.get(`http://localhost:5000/api/products`); // Just verify connection
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        setProducts(products.filter(p => p.id !== id));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const productPayload = {
      title: newProduct.title,
      price: parseFloat(newProduct.price),
      category: newProduct.category || 'General',
      stock: parseInt(newProduct.stock, 10) || 10,
      images: newProduct.image ? [newProduct.image] : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
      description: newProduct.description,
      status: newProduct.status
    };

    try {
      // Post to backend
      const response = await axios.post('http://localhost:5000/api/products', productPayload);
      if (response.data) {
        alert('Product created successfully!');
        setIsModalOpen(false);
        setNewProduct({
          title: '',
          price: '',
          category: '',
          stock: '',
          image: '',
          description: '',
          status: 'Active'
        });
        fetchProducts(); // Refresh list
      }
    } catch (err) {
      console.warn("Backend post failed, adding to local memory state:", err);
      // Fallback to local memory state addition
      const mockNewItem = {
        id: Date.now(),
        name: productPayload.title, // Map to name for local mock
        title: productPayload.title,
        price: productPayload.price,
        category: productPayload.category,
        stock: productPayload.stock,
        status: productPayload.status,
        description: productPayload.description,
        images: productPayload.images
      };
      setProducts(prev => [mockNewItem, ...prev]);
      alert('Product added locally! (Backend server is offline/unavailable)');
      setIsModalOpen(false);
      setNewProduct({
        title: '',
        price: '',
        category: '',
        stock: '',
        image: '',
        description: '',
        status: 'Active'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const titleVal = (p.title || p.name || '').toLowerCase();
    const catVal = (typeof p.category === 'object' ? p.category.name : (p.category || '')).toLowerCase();
    return titleVal.includes(searchTerm.toLowerCase()) || catVal.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your store's inventory and product details.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
        >
          <FiPlus />
          Add Product
        </motion.button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-colors w-72">
            <FiSearch className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading products inventory…</div>
          ) : (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4 rounded-tl-2xl">Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right rounded-tr-2xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const displayName = product.title || product.name || 'Unnamed Product';
                    const displayCategory = typeof product.category === 'object' ? product.category.name : (product.category || 'General');
                    const displayPrice = typeof product.price === 'number' ? product.price : parseFloat(product.price || 0);
                    
                    return (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{displayName}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {displayCategory}
                          </span>
                        </td>
                        <td className="px-6 py-4">${displayPrice.toFixed(2)}</td>
                        <td className="px-6 py-4">{product.stock !== undefined ? product.stock : 10}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.status === 'Active' || product.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.status || (product.stock > 0 ? 'Active' : 'Out of Stock')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button className="text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                              <FiEdit2 className="text-lg" />
                            </button>
                            <button 
                              onClick={() => handleDelete(product.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors" 
                              title="Delete"
                            >
                              <FiTrash2 className="text-lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No products found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Product Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors"
                title="Close"
              >
                <FiX className="text-xl" />
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>
              
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={newProduct.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Vintage Leather Messenger Bag"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Price ($) *</label>
                    <input
                      type="number"
                      name="price"
                      required
                      step="0.01"
                      min="0.01"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      placeholder="99.99"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      name="stock"
                      min="0"
                      value={newProduct.stock}
                      onChange={handleInputChange}
                      placeholder="25"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={newProduct.category}
                      onChange={handleInputChange}
                      placeholder="e.g. Accessories"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={newProduct.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={newProduct.image}
                    onChange={handleInputChange}
                    placeholder="https://images.unsplash.com/... (optional)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    placeholder="Provide a detailed description of the product features..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? 'Creating...' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductManagement;
