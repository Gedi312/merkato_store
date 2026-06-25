import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { initialCategories } from '../../utils/mockData';

const CategoryManagement = () => {
  const [categories, setCategories] = useState(initialCategories);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Organize your products into categories.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
        >
          <FiPlus />
          Add Category
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {categories.map((category) => (
          <motion.div 
            key={category.id} 
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col pt-8 relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-800">{category.name}</h3>
              <div className="flex items-center gap-2 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors">
                  <FiEdit2 />
                </button>
                <button 
                  onClick={() => handleDelete(category.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
            
            <p className="text-gray-500 text-sm flex-1">{category.description}</p>
            
            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Products</span>
              <span className="bg-blue-50 text-blue-700 py-1 px-3 rounded-full text-xs font-bold">
                {category.productCount} Items
              </span>
            </div>
            
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </motion.div>
        ))}
        
        {/* Placeholder for adding new category */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gray-50/50 rounded-2xl p-6 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors min-h-[200px]"
        >
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl mb-3">
            <FiPlus />
          </div>
          <h3 className="font-semibold text-gray-700">Create New Category</h3>
          <p className="text-sm text-gray-500 mt-1">Group similar products together</p>
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryManagement;
