import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Award, 
  Leaf, 
  TrendingUp,
  DollarSign,
  Target,
  Zap,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Recycle
} from 'lucide-react';
import StatsGrid from '../../components/dashboard/StatsGrid';
import ChartsSection from '../../components/dashboard/ChartsSection';
import ActivityList from '../../components/dashboard/ActivityList';
import QuickActions from '../../components/dashboard/QuickActions';

const BuyerDashboard = () => {
  // Mock data for buyer dashboard
  const stats = [
    {
      title: "Credit Balance",
      value: "3,420",
      icon: Wallet,
      trend: "up",
      trendValue: "+280",
      color: "green",
      subtitle: "Available credits"
    },
    {
      title: "Monthly Spending",
      value: "$12,450",
      icon: DollarSign,
      trend: "down",
      trendValue: "-8.2%",
      color: "blue",
      subtitle: "This month"
    },
    {
      title: "CO₂ Offset",
      value: "84.2 tons",
      icon: Leaf,
      trend: "up",
      trendValue: "+15.7%",
      color: "green",
      subtitle: "Total impact"
    },
    {
      title: "Credits Retired",
      value: "1,280",
      icon: Award,
      trend: "up",
      trendValue: "+12.3%",
      color: "purple",
      subtitle: "Permanently retired"
    }
  ];

  const charts = [
    {
      type: 'area',
      title: 'Carbon Offset Progress',
      data: [
        { name: 'Jan', offset: 12.5, target: 15.0 },
        { name: 'Feb', offset: 18.2, target: 15.0 },
        { name: 'Mar', offset: 22.8, target: 15.0 },
        { name: 'Apr', offset: 35.4, target: 15.0 },
        { name: 'May', offset: 48.7, target: 15.0 },
        { name: 'Jun', offset: 84.2, target: 15.0 }
      ],
      xKey: 'name',
      yKey: 'offset',
      color: '#10b981',
      gradient: true,
      height: 320
    },
    {
      type: 'bar',
      title: 'Credit Portfolio Value',
      data: [
        { name: 'Solar', value: 1420, cost: 64800 },
        { name: 'Wind', value: 980, cost: 42160 },
        { name: 'Hydro', value: 680, cost: 33150 },
        { name: 'Nuclear', value: 340, cost: 18700 }
      ],
      xKey: 'name',
      yKey: 'value',
      color: '#3b82f6',
      height: 320
    }
  ];

  const activities = [
    {
      id: 1,
      type: 'purchase',
      description: 'Purchased 150 credits from GreenTech Industries',
      amount: '150 credits',
      time: '1 hour ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'retire',
      description: 'Retired 80 credits for Q1 sustainability goals',
      amount: '80 credits',
      time: '3 hours ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'transfer',
      description: 'Transferred 50 credits to subsidiary company',
      amount: '50 credits',
      time: '1 day ago',
      status: 'completed'
    },
    {
      id: 4,
      type: 'purchase',
      description: 'Order pending for 200 credits from EcoEnergy',
      amount: '200 credits',
      time: '2 days ago',
      status: 'pending'
    }
  ];

  const availableCredits = [
    {
      id: 'HC-2025-015',
      producer: 'GreenTech Industries',
      amount: 450,
      price: 47.50,
      source: 'Solar',
      certification: 'Gold Standard',
      co2Reduction: 2.3
    },
    {
      id: 'HC-2025-016',
      producer: 'EcoEnergy Corp',
      amount: 320,
      source: 'Wind',
      price: 44.00,
      certification: 'Verified',
      co2Reduction: 1.8
    },
    {
      id: 'HC-2025-017',
      producer: 'SolarMax Energy',
      amount: 680,
      price: 49.25,
      source: 'Solar',
      certification: 'Premium',
      co2Reduction: 3.1
    }
  ];

  const quickActions = [
    {
      label: 'Buy Credits',
      icon: ShoppingCart,
      color: 'green',
      onClick: () => console.log('Buy credits')
    },
    {
      label: 'Transfer Credits',
      icon: ArrowUpRight,
      color: 'blue',
      onClick: () => console.log('Transfer credits')
    },
    {
      label: 'Retire Credits',
      icon: Award,
      color: 'purple',
      onClick: () => console.log('Retire credits')
    },
    {
      label: 'View Marketplace',
      icon: BarChart3,
      color: 'orange',
      onClick: () => console.log('View marketplace')
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'purchase': return <ShoppingCart className="w-4 h-4" />;
      case 'retire': return <Award className="w-4 h-4" />;
      case 'transfer': return <ArrowUpRight className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'purchase': return 'text-green-600 bg-green-100';
      case 'retire': return 'text-purple-600 bg-purple-100';
      case 'transfer': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handlePurchase = (creditId) => {
    console.log('Purchasing credit:', creditId);
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
          Buyer Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your credit portfolio and track sustainability impact.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <StatsGrid stats={stats} className="mb-8" />

      {/* Sustainability Impact Widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-sm border border-green-200 p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Leaf className="w-5 h-5 text-green-600 mr-2" />
            Environmental Impact
          </h3>
          <div className="text-right">
            <p className="text-sm text-gray-600">Equivalent to</p>
            <p className="text-lg font-bold text-green-600">42 trees planted</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">CO₂ Reduced</p>
                <p className="text-xl font-bold text-gray-900">84.2</p>
                <p className="text-xs text-gray-500">tons this year</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Leaf className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Energy Clean</p>
                <p className="text-xl font-bold text-gray-900">3,420</p>
                <p className="text-xs text-gray-500">MWh equivalent</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Goal Progress</p>
                <p className="text-xl font-bold text-gray-900">84%</p>
                <p className="text-xs text-gray-500">annual target</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Investment</p>
                <p className="text-xl font-bold text-gray-900">$158K</p>
                <p className="text-xs text-gray-500">total spent</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Available Credits Marketplace */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Available Credits</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View Marketplace
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableCredits.map((credit) => (
            <div key={credit.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-900">{credit.id}</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {credit.source}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{credit.producer}</p>
              <p className="text-lg font-bold text-gray-900 mb-1">{credit.amount} credits</p>
              <p className="text-sm text-green-600 font-medium mb-3">${credit.price} per credit</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{credit.certification}</span>
                <span>{credit.co2Reduction} tons CO₂</span>
              </div>
              
              <button
                onClick={() => handlePurchase(credit.id)}
                className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Purchase
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Charts Section */}
      <ChartsSection charts={charts} className="mb-8" />

      {/* Activity and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <ActivityList
          activities={activities}
          title="Recent Transactions"
          getActivityIcon={getActivityIcon}
          getActivityColor={getActivityColor}
          className="lg:col-span-2"
        />

        {/* Quick Actions */}
        <QuickActions actions={quickActions} title="Trading Actions" />
      </div>
    </div>
  );
};

export default BuyerDashboard;
