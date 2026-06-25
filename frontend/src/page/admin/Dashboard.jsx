import { FiTrendingUp, FiShoppingBag, FiBox, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { initialStats } from '../../utils/mockData';

const Dashboard = () => {
  const statCards = [
    {
      title: 'Total Sales',
      value: `$${initialStats.totalSales.toLocaleString()}`,
      trend: '+12.5%',
      trendUp: true,
      icon: <FiDollarSign />,
      color: 'blue'
    },
    {
      title: 'Total Orders',
      value: initialStats.totalOrders.toLocaleString(),
      trend: '+8.2%',
      trendUp: true,
      icon: <FiShoppingBag />,
      color: 'purple'
    },
    {
      title: 'Total Products',
      value: initialStats.totalProducts.toLocaleString(),
      trend: '-2.4%',
      trendUp: false,
      icon: <FiBox />,
      color: 'orange'
    },
    {
      title: 'Active Users',
      value: '2,845',
      trend: '+18.7%',
      trendUp: true,
      icon: <FiTrendingUp />,
      color: 'emerald'
    }
  ];

  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back, here's what's happening with your store today.</p>
        </div>
        <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-50 transition-colors">
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${colorStyles[stat.color]}`}>
              {stat.icon}
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
              <span className={`text-sm font-semibold ${stat.trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.trend}
              </span>
            </div>
            {/* Decorative background element */}
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${colorStyles[stat.color].split(' ')[0]}`}></div>
          </motion.div>
        ))}
      </div>

      {/* Mock Section for extra visual weight */}
      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <FiTrendingUp className="text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Activity chart will be displayed here.</p>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default Dashboard;
