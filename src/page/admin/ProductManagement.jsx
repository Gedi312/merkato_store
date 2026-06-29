import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiUpload } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { initialProducts } from '../../utils/mockData';

// Helper to generate unique ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

// Initial products with placeholder images (add image field)
const productsWithImages = initialProducts.map(p => ({
  ...p,
  image: p.image || 'https://via.placeholder.com/150?text=Product',
  deleted: false, // soft delete flag
}));

const ProductManagement = () => {
  const [products, setProducts] = useState(() => {
    // Load from localStorage or use default
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : productsWithImages;
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = add mode
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    status: 'Active',
    image: '',
  });
  const [imageFile, setImageFile] = useState(null); // for file upload

  // Persist to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // Filter out deleted products from UI
  const activeProducts = products.filter(p => !p.deleted);

  const filteredProducts = activeProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modal handlers
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: '',
      price: '',
      stock: '',
      status: 'Active',
      image: '',
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      status: product.status,
      image: product.image || '',
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setImageFile(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save product (add or update)
  const handleSave = () => {
    // Basic validation
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      alert('Please fill in all required fields.');
      return;
    }

    const priceNum = parseFloat(formData.price);
    const stockNum = parseInt(formData.stock);
    if (isNaN(priceNum) || priceNum < 0) {
      alert('Price must be a valid positive number.');
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      alert('Stock must be a valid non-negative integer.');
      return;
    }

    const productData = {
      name: formData.name,
      category: formData.category,
      price: priceNum,
      stock: stockNum,
      status: formData.status,
      image: formData.image || 'https://via.placeholder.com/150?text=Product',
    };

    if (editingProduct) {
      // Update existing product
      setProducts(prev =>
        prev.map(p =>
          p.id === editingProduct.id
            ? { ...p, ...productData }
            : p
        )
      );
    } else {
      // Add new product
      const newProduct = {
        id: generateId(),
        ...productData,
        deleted: false,
      };
      setProducts(prev => [...prev, newProduct]);
    }
    closeModal();
  };

  // Soft delete: mark as deleted
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev =>
        prev.map(p =>
          p.id === id ? { ...p, deleted: true } : p
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your store's inventory and product details.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
        >
          <FiPlus />
          Add Product
        </motion.button>
      </div>

      {/* Table Card */}
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
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4 rounded-tl-2xl">Image</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">{product.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => openEditModal(product)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
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
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <FiX className="text-2xl" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <div className="flex items-center gap-4">
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="w-16 h-16 object-cover rounded-lg border" />
                  )}
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <FiUpload />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {formData.image && (
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">Upload an image or enter a URL below.</p>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Or paste image URL"
                  className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Price and Stock side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30"
              >
                {editingProduct ? 'Update' : 'Add'} Product
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;