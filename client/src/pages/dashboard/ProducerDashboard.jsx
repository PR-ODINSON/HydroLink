import React from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Zap, 
  TrendingUp, 
  Award,
  Trophy,
  Target,
  Flame,
  Star
} from 'lucide-react';
import StatsGrid from '../../components/dashboard/StatsGrid';
import ChartsSection from '../../components/dashboard/ChartsSection';
import ActivityList from '../../components/dashboard/ActivityList';
import QuickActions from '../../components/dashboard/QuickActions';

const ProducerDashboard = () => {
  // Mock data for producer dashboard
  const stats = [
    {
      title: "Total Credits Minted",
      value: "12,580",
      icon: CreditCard,
      trend: "up",
      trendValue: "+15.2%",
      color: "green",
      subtitle: "This month"
    },
    {
      title: "Active Production",
      value: "2,840 MWh",
      icon: Zap,
      trend: "up", 
      trendValue: "+8.7%",
      color: "blue",
      subtitle: "Monthly output"
    },
    {
      title: "Efficiency Rating",
      value: "94.2%",
      icon: Target,
      trend: "up",
      trendValue: "+2.1%", 
      color: "purple",
      subtitle: "Above average"
    },
    {
      title: "Leaderboard Rank",
      value: "#3",
      icon: Trophy,
      trend: "up",
      trendValue: "+1 rank",
      color: "orange",
      subtitle: "Out of 1,240"
    }
  ];

  const charts = [
    {
      type: 'area',
      title: 'Production vs Credits Minted',
      data: [
        { name: 'Jan', production: 2100, credits: 2080 },
        { name: 'Feb', production: 2350, credits: 2340 },
        { name: 'Mar', production: 2200, credits: 2180 },
        { name: 'Apr', production: 2650, credits: 2620 },
        { name: 'May', production: 2840, credits: 2800 },
        { name: 'Jun', production: 2920, credits: 2900 }
      ],
      xKey: 'name',
      yKey: 'credits',
      color: '#10b981',
      gradient: true,
      height: 320
    },
    {
      type: 'bar',
      title: 'Monthly Efficiency',
      data: [
        { name: 'Jan', efficiency: 92.1 },
        { name: 'Feb', efficiency: 93.5 },
        { name: 'Mar', efficiency: 91.8 },
        { name: 'Apr', efficiency: 94.2 },
        { name: 'May', efficiency: 95.1 },
        { name: 'Jun', efficiency: 94.2 }
      ],
      xKey: 'name',
      yKey: 'efficiency',
      color: '#3b82f6',
      height: 320
    }
  ];

  const activities = [
    {
      id: 1,
      type: 'mint',
      description: 'Successfully minted 450 new hydrogen credits',
      amount: '450 credits',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'production',
      description: 'Production facility Delta reached 98% efficiency',
      amount: '2.1 MWh',
      time: '4 hours ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'achievement',
      description: 'Earned "Efficiency Expert" achievement',
      time: '1 day ago',
      status: 'completed'
    },
    {
      id: 4,
      type: 'verification',
      description: 'Credits pending verification by Authority #7',
      amount: '300 credits',
      time: '2 days ago',
      status: 'pending'
    }
  ];

  const quickActions = [
    {
      label: 'Mint New Credits',
      icon: CreditCard,
      color: 'green',
      onClick: () => console.log('Mint credits')
    },
    {
      label: 'View Production Data',
      icon: Zap,
      color: 'blue', 
      onClick: () => console.log('View production')
    },
    {
      label: 'Check Leaderboard',
      icon: Trophy,
      color: 'orange',
      onClick: () => console.log('View leaderboard')
    },
    {
      label: 'Track Achievements',
      icon: Award,
      color: 'purple',
      onClick: () => console.log('View achievements')
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'mint': return <CreditCard className="w-4 h-4" />;
      case 'production': return <Zap className="w-4 h-4" />;
      case 'achievement': return <Award className="w-4 h-4" />;
      case 'verification': return <Target className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'mint': return 'text-green-600 bg-green-100';
      case 'production': return 'text-blue-600 bg-blue-100';
      case 'achievement': return 'text-orange-600 bg-orange-100';
      case 'verification': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Producer Dashboard
        </h1>
        <p className="text-gray-600">
          Monitor your hydrogen production and manage credit minting.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <StatsGrid stats={stats} className="mb-8" />

      {/* Charts Section */}
      <ChartsSection charts={charts} className="mb-8" />

      {/* Activity and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity */}
        <ActivityList
          activities={activities}
          title="Recent Activity"
          getActivityIcon={getActivityIcon}
          getActivityColor={getActivityColor}
          className="lg:col-span-2"
        />

        {/* Quick Actions */}
        <QuickActions actions={quickActions} />
      </div>

      {/* Gamification Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl shadow-sm border border-orange-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Trophy className="w-5 h-5 text-orange-600 mr-2" />
            Achievements & Progress
          </h3>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Level 7 Producer</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Flame className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Efficiency Streak</p>
                <p className="text-sm text-gray-600">12 days above 90%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Credits Minted</p>
                <p className="text-sm text-gray-600">12,580 / 15,000</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Trophy className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Rank Progress</p>
                <p className="text-sm text-gray-600">#3 → Targeting #1</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProducerDashboard;
