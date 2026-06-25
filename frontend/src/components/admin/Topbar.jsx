import { FiSearch, FiBell, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Topbar = () => {
  return (
    <div className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center bg-gray-100/80 px-4 py-2.5 rounded-2xl w-96 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all duration-300 shadow-inner">
        <FiSearch className="text-gray-400 text-lg mr-3" />
        <input 
          type="text" 
          placeholder="Search everywhere..." 
          className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400 font-medium"
        />
      </div>

      <div className="flex items-center gap-5">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
        >
          <FiBell className="text-xl" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </motion.button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-gray-800">Admin User</span>
            <span className="text-xs text-gray-500 font-medium">Store Manager</span>
          </div>
          <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white text-lg shadow-lg shadow-blue-500/30">
            <FiUser />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
