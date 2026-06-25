import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiBox, FiList, FiSettings, FiLogOut } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <FiGrid /> },
    { name: 'Products', path: '/admin/products', icon: <FiBox /> },
    { name: 'Categories', path: '/admin/categories', icon: <FiList /> },
    { name: 'Settings', path: '/admin/settings', icon: <FiSettings /> },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col transition-all duration-300 shadow-2xl">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-500 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xl">M</div>
        <h1 className="text-2xl font-bold tracking-wider">Admin<span className="text-blue-400">Pro</span></h1>
      </div>
      
      <div className="mt-8 flex-1 px-4">
        <p className="text-xs text-gray-500 font-semibold uppercase mb-4 px-2 tracking-wider">Main Menu</p>
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            
            return (
              <li key={item.name}>
                <Link to={item.path}>
                  <motion.div 
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-600 shadow-lg shadow-blue-500/30 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-800">
        <motion.button 
          whileHover={{ x: 4 }}
          className="flex items-center gap-3 text-gray-400 hover:text-red-400 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 transition-colors"
        >
          <FiLogOut className="text-xl" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar;
