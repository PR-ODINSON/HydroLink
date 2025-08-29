import React from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  TrendingUp, 
  Users, 
  Award,
  Activity,
  DollarSign,
  Zap,
  Shield
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import Chart from '../components/Chart';

const Dashboard = () => {
  // Sample data for charts
  const creditTrendData = [
    { name: 'Jan', value: 1200 },
    { name: 'Feb', value: 1900 },
    { name: 'Mar', value: 3200 },
    { name: 'Apr', value: 2800 },
    { name: 'May', value: 4100 },
    { name: 'Jun', value: 3600 },
    { name: 'Jul', value: 5200 }
  ];

  const marketShareData = [
    { name: 'Solar H2', value: 45, color: '#10b981' },
    { name: 'Wind H2', value: 35, color: '#3b82f6' },
    { name: 'Hydro H2', value: 15, color: '#8b5cf6' },
    { name: 'Other', value: 5, color: '#f59e0b' }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'mint',
      description: 'New credits minted by GreenTech Industries',
      amount: '1,250 credits',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'transfer',
      description: 'Credits transferred to EcoEnergy Corp',
      amount: '800 credits',
      time: '4 hours ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'retire',
      description: 'Credits retired by CleanPower Ltd',
      amount: '500 credits',
      time: '6 hours ago',
      status: 'completed'
    },
    {
      id: 4,
      type: 'verify',
      description: 'Credits verified by Authority #7',
      amount: '2,100 credits',
      time: '8 hours ago',
      status: 'pending'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'mint': return <CreditCard className="w-4 h-4" />;
      case 'transfer': return <TrendingUp className="w-4 h-4" />;
      case 'retire': return <Award className="w-4 h-4" />;
      case 'verify': return <Shield className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'mint': return 'text-green-600 bg-green-100';
      case 'transfer': return 'text-blue-600 bg-blue-100';
      case 'retire': return 'text-purple-600 bg-purple-100';
      case 'verify': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          Dashboard Overview
        </motion.h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your green hydrogen credits.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DashboardCard
            title="Total Credits Issued"
            value="24,580"
            icon={CreditCard}
            trend="up"
            trendValue="+12.5%"
            color="green"
            subtitle="This month"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DashboardCard
            title="Credits Verified"
            value="18,240"
            icon={Shield}
            trend="up"
            trendValue="+8.3%"
            color="blue"
            subtitle="Certified by authorities"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DashboardCard
            title="Active Producers"
            value="1,240"
            icon={Users}
            trend="up"
            trendValue="+15.2%"
            color="purple"
            subtitle="Registered users"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DashboardCard
            title="Market Volume"
            value="$2.4M"
            icon={DollarSign}
            trend="up"
            trendValue="+22.1%"
            color="orange"
            subtitle="Total trading volume"
          />
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Chart
            type="area"
            data={creditTrendData}
            xKey="name"
            yKey="value"
            color="#10b981"
            title="Credit Issuance Trend"
            gradient={true}
            height={300}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Chart
            type="pie"
            data={marketShareData}
            xKey="name"
            yKey="value"
            title="Market Share by Source"
            height={300}
          />
        </motion.div>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">{activity.amount}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activity.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg transition-all group">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-green-600 mr-3" />
                  <span className="font-medium text-green-700">Mint Credits</span>
                </div>
                <TrendingUp className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all group">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="font-medium text-blue-700">Verify Credits</span>
                </div>
                <TrendingUp className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg transition-all group">
                <div className="flex items-center">
                  <Zap className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="font-medium text-purple-700">Transfer Credits</span>
                </div>
                <TrendingUp className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-lg transition-all group">
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-orange-600 mr-3" />
                  <span className="font-medium text-orange-700">Retire Credits</span>
                </div>
                <TrendingUp className="w-4 h-4 text-orange-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
