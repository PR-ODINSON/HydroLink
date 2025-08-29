import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Star, 
  TrendingUp, 
  Crown, 
  Zap, 
  Award,
  Users,
  Calendar,
  Target,
  Flame,
  ChevronUp,
  ChevronDown,
  CheckCircle
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';

const Leaderboard = () => {
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Sample leaderboard data
  const leaderboardData = [
    {
      rank: 1,
      producer: 'GreenTech Industries',
      credits: 15240,
      change: 5,
      badge: 'Platinum',
      points: 45720,
      streak: 12,
      efficiency: 98.5,
      location: 'California, USA',
      avatar: '🏭'
    },
    {
      rank: 2,
      producer: 'EcoEnergy Corp',
      credits: 12180,
      change: 2,
      badge: 'Gold',
      points: 36540,
      streak: 8,
      efficiency: 96.2,
      location: 'Texas, USA',
      avatar: '⚡'
    },
    {
      rank: 3,
      producer: 'SolarMax Energy',
      credits: 10950,
      change: -1,
      badge: 'Gold',
      points: 32850,
      streak: 15,
      efficiency: 94.8,
      location: 'Nevada, USA',
      avatar: '☀️'
    },
    {
      rank: 4,
      producer: 'WindPower Corp',
      credits: 9870,
      change: 3,
      badge: 'Silver',
      points: 29610,
      streak: 6,
      efficiency: 92.1,
      location: 'Kansas, USA',
      avatar: '💨'
    },
    {
      rank: 5,
      producer: 'HydroGen Solutions',
      credits: 8650,
      change: 0,
      badge: 'Silver',
      points: 25950,
      streak: 10,
      efficiency: 89.7,
      location: 'Oregon, USA',
      avatar: '💧'
    },
    {
      rank: 6,
      producer: 'CleanPower Ltd',
      credits: 7420,
      change: -2,
      badge: 'Bronze',
      points: 22260,
      streak: 4,
      efficiency: 87.3,
      location: 'Washington, USA',
      avatar: '🌱'
    },
    {
      rank: 7,
      producer: 'GreenHydro Inc',
      credits: 6890,
      change: 1,
      badge: 'Bronze',
      points: 20670,
      streak: 7,
      efficiency: 85.9,
      location: 'Colorado, USA',
      avatar: '🏔️'
    },
    {
      rank: 8,
      producer: 'EcoHydrogen',
      credits: 5960,
      change: -1,
      badge: 'Bronze',
      points: 17880,
      streak: 3,
      efficiency: 83.4,
      location: 'Arizona, USA',
      avatar: '🌵'
    }
  ];

  const achievements = [
    {
      title: 'Green Pioneer',
      description: 'First 1000 credits produced',
      icon: '🌟',
      rarity: 'common',
      unlocked: true
    },
    {
      title: 'Solar Champion',
      description: '10,000 solar-powered credits',
      icon: '☀️',
      rarity: 'rare',
      unlocked: true
    },
    {
      title: 'Efficiency Master',
      description: 'Maintain 95%+ efficiency for 6 months',
      icon: '⚡',
      rarity: 'epic',
      unlocked: false
    },
    {
      title: 'Carbon Crusher',
      description: 'Offset 100 tonnes of CO₂',
      icon: '🌍',
      rarity: 'legendary',
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          Producer Leaderboard
        </motion.h1>
        <p className="text-gray-600">
          Compete with other producers and earn achievements for sustainable hydrogen production.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DashboardCard
            title="Your Rank"
            value="#7"
            icon={Trophy}
            trend="up"
            trendValue="+3 positions"
            color="purple"
            subtitle="This month"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DashboardCard
            title="Your Points"
            value="18,420"
            icon={Star}
            trend="up"
            trendValue="+1,240"
            color="yellow"
            subtitle="Total earned"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DashboardCard
            title="Current Streak"
            value="5 days"
            icon={Flame}
            color="orange"
            subtitle="Keep it up!"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DashboardCard
            title="Next Goal"
            value="2,580"
            icon={Target}
            color="green"
            subtitle="Credits to rank #6"
          />
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
                <h3 className="text-lg font-semibold text-gray-900">Top Producers</h3>
                <div className="flex space-x-4">
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="weekly">This Week</option>
                    <option value="monthly">This Month</option>
                    <option value="quarterly">This Quarter</option>
                    <option value="yearly">This Year</option>
                  </select>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Sources</option>
                    <option value="solar">Solar</option>
                    <option value="wind">Wind</option>
                    <option value="hydro">Hydro</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {leaderboardData.map((producer, index) => (
                <motion.div
                  key={producer.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    producer.rank === 7 ? 'bg-blue-50 border-l-4 border-blue-400' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(producer.rank)}
                        {producer.change !== 0 && getChangeIcon(producer.change)}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                          {producer.avatar}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">{producer.producer}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(producer.badge)}`}>
                              {producer.badge}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{producer.location}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {producer.credits.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Credits</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">
                            {producer.points.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Points</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center">
                            <Flame className="w-4 h-4 text-orange-500 mr-1" />
                            <span className="text-sm font-medium text-gray-900">{producer.streak}</span>
                          </div>
                          <div className="text-xs text-gray-500">Streak</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-green-600">
                            {producer.efficiency}%
                          </div>
                          <div className="text-xs text-gray-500">Efficiency</div>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
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

          {/* Season Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-900">Season 1</h3>
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-purple-700">Progress</span>
                <span className="font-medium text-purple-900">15/30 days</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-700">Season Rank</span>
                <span className="font-medium text-purple-900">#7</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-700">Reward Tier</span>
                <span className="font-medium text-purple-900">Silver</span>
              </div>
            </div>
          </motion.div>

          {/* Weekly Challenge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-900">Weekly Challenge</h3>
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-green-800 mb-1">Efficiency Boost</h4>
                <p className="text-sm text-green-700">Maintain 90%+ efficiency for 7 days</p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Progress</span>
                <span className="font-medium text-green-900">5/7 days</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '71%' }}></div>
              </div>
              <div className="text-sm text-green-700">
                <strong>Reward:</strong> 500 bonus points + Efficiency Badge
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
