import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Star, 
  TrendingUp, 
  Crown, 
  Leaf, 
  Award,
  Users,
  Calendar,
  Target,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  ShoppingCart,
  Recycle
} from 'lucide-react';

const BuyerLeaderboard = () => {
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Sample leaderboard data for buyers
  const leaderboardData = [
    {
      rank: 1,
      buyer: 'EcoTech Solutions',
      creditsRetired: 2840,
      change: 3,
      badge: 'Platinum',
      points: 28400,
      streak: 45,
      co2Offset: 1420,
      location: 'California, USA',
      avatar: '🌿',
      category: 'Technology'
    },
    {
      rank: 2,
      buyer: 'GreenCorp Industries',
      creditsRetired: 2650,
      change: 1,
      badge: 'Platinum',
      points: 26500,
      streak: 38,
      co2Offset: 1325,
      location: 'New York, USA',
      avatar: '🏢',
      category: 'Manufacturing'
    },
    {
      rank: 3,
      buyer: 'SustainableLogistics',
      creditsRetired: 2180,
      change: -1,
      badge: 'Gold',
      points: 21800,
      streak: 32,
      co2Offset: 1090,
      location: 'Texas, USA',
      avatar: '🚚',
      category: 'Logistics'
    },
    {
      rank: 4,
      buyer: 'CleanEnergy Motors',
      creditsRetired: 1950,
      change: 2,
      badge: 'Gold',
      points: 19500,
      streak: 28,
      co2Offset: 975,
      location: 'Michigan, USA',
      avatar: '🚗',
      category: 'Automotive'
    },
    {
      rank: 5,
      buyer: 'Azure Datacenters',
      creditsRetired: 1720,
      change: 0,
      badge: 'Silver',
      points: 17200,
      streak: 25,
      co2Offset: 860,
      location: 'Washington, USA',
      avatar: '💾',
      category: 'Technology'
    }
  ];

  const achievements = [
    {
      title: 'Carbon Neutral Hero',
      description: 'Offset 1000+ tons of CO₂',
      icon: '🌍',
      rarity: 'legendary',
      unlocked: true
    },
    {
      title: 'Sustainability Champion',
      description: 'Retire credits for 6 consecutive months',
      icon: '🏆',
      rarity: 'epic',
      unlocked: true
    },
    {
      title: 'Green Streak Master',
      description: 'Maintain 30-day buying streak',
      icon: '⚡',
      rarity: 'rare',
      unlocked: false
    },
    {
      title: 'Portfolio Diversifier',
      description: 'Purchase credits from 5+ energy sources',
      icon: '🔄',
      rarity: 'common',
      unlocked: false
    }
  ];

  const getBadgeColor = (badge) => {
    switch (badge.toLowerCase()) {
      case 'platinum': return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900';
      case 'silver': return 'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-900';
      case 'bronze': return 'bg-gradient-to-r from-orange-400 to-orange-500 text-orange-900';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-orange-500" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <ChevronUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <ChevronDown className="w-4 h-4 text-red-500" />;
    return <span className="w-4 h-4 text-gray-400">-</span>;
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-400';
      case 'epic': return 'border-purple-400';
      case 'legendary': return 'border-yellow-400';
      default: return 'border-gray-300';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Technology': return '💻';
      case 'Manufacturing': return '🏭';
      case 'Logistics': return '🚚';
      case 'Automotive': return '🚗';
      default: return '🏢';
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
          Sustainability Leaderboard
        </motion.h1>
        <p className="text-gray-600">
          Rankings based on carbon credits retired, environmental impact, and sustainability commitment.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Your Rank</h3>
            <Trophy className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">#3</p>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+1 position</span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Credits Retired</h3>
            <Recycle className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">2,180</p>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+240 this month</span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">CO₂ Offset</h3>
            <Leaf className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">1,090 tons</p>
          <p className="text-xs text-gray-500">Lifetime impact</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Sustainability Points</h3>
            <Star className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">21,800</p>
          <p className="text-xs text-gray-500">Total earned</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Leaderboard */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <h3 className="text-lg font-semibold text-gray-900">Top Sustainability Leaders</h3>
                <div className="flex space-x-4">
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="weekly">This Week</option>
                    <option value="monthly">This Month</option>
                    <option value="quarterly">This Quarter</option>
                    <option value="yearly">This Year</option>
                  </select>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Industries</option>
                    <option value="technology">Technology</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="logistics">Logistics</option>
                    <option value="automotive">Automotive</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {leaderboardData.map((buyer, index) => (
                <motion.div
                  key={buyer.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    buyer.rank === 3 ? 'bg-green-50 border-l-4 border-green-400' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(buyer.rank)}
                        {buyer.change !== 0 && getChangeIcon(buyer.change)}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                          {buyer.avatar}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">{buyer.buyer}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(buyer.badge)}`}>
                              {buyer.badge}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{buyer.location}</p>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs">{getCategoryIcon(buyer.category)}</span>
                            <span className="text-xs text-green-600">{buyer.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {buyer.creditsRetired.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Credits Retired</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {buyer.points.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Points</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center">
                            <Leaf className="w-4 h-4 text-emerald-500 mr-1" />
                            <span className="text-sm font-medium text-gray-900">{buyer.co2Offset}</span>
                          </div>
                          <div className="text-xs text-gray-500">CO₂ Tons</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center">
                            <Target className="w-4 h-4 text-orange-500 mr-1" />
                            <span className="text-sm font-medium text-gray-900">{buyer.streak}</span>
                          </div>
                          <div className="text-xs text-gray-500">Day Streak</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sustainability Achievements</h3>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    achievement.unlocked 
                      ? `${getRarityColor(achievement.rarity)} bg-gradient-to-r from-green-50 to-green-100`
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.unlocked && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Impact Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-900">Your Impact</h3>
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Trees Equivalent</span>
                <span className="font-medium text-green-900">54,500 trees</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Car Miles Offset</span>
                <span className="font-medium text-green-900">2.4M miles</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Goal Progress</span>
                <span className="font-medium text-green-900">87% complete</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
          </motion.div>

          {/* Monthly Challenge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-900">Monthly Challenge</h3>
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Carbon Neutral Goal</h4>
                <p className="text-sm text-blue-700">Retire 300 credits this month</p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">Progress</span>
                <span className="font-medium text-blue-900">240/300 credits</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
              <div className="text-sm text-blue-700">
                <strong>Reward:</strong> 2000 bonus points + Sustainability Badge
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BuyerLeaderboard;
