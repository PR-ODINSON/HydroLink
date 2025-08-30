import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Star, 
  TrendingUp, 
  Crown, 
  Shield, 
  Award,
  Users,
  Calendar,
  Target,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  Activity
} from 'lucide-react';

const Leaderboard = () => {
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Sample leaderboard data for certifiers
  const leaderboardData = [
    {
      rank: 1,
      certifier: 'TrustVerify Authority',
      verificationsCompleted: 1240,
      change: 5,
      badge: 'Platinum',
      points: 15720,
      streak: 25,
      accuracy: 98.5,
      location: 'California, USA',
      avatar: '🛡️',
      specialization: 'Solar & Wind'
    },
    {
      rank: 2,
      certifier: 'SecureCheck Systems',
      verificationsCompleted: 1180,
      change: 2,
      badge: 'Gold',
      points: 14540,
      streak: 18,
      accuracy: 97.2,
      location: 'Texas, USA',
      avatar: '✅',
      specialization: 'All Sources'
    },
    {
      rank: 3,
      certifier: 'ValidCore Inc',
      verificationsCompleted: 950,
      change: -1,
      badge: 'Gold',
      points: 12850,
      streak: 15,
      accuracy: 96.8,
      location: 'Nevada, USA',
      avatar: '🔒',
      specialization: 'Hydro & Nuclear'
    },
    {
      rank: 4,
      certifier: 'CertifyPro Solutions',
      verificationsCompleted: 870,
      change: 3,
      badge: 'Silver',
      points: 11610,
      streak: 12,
      accuracy: 95.1,
      location: 'Washington, USA',
      avatar: '⚡',
      specialization: 'Wind'
    },
    {
      rank: 5,
      certifier: 'AuthenticateNow',
      verificationsCompleted: 650,
      change: 0,
      badge: 'Silver',
      points: 9950,
      streak: 10,
      accuracy: 94.7,
      location: 'Oregon, USA',
      avatar: '🎯',
      specialization: 'Solar'
    }
  ];

  const achievements = [
    {
      title: 'Verification Master',
      description: 'Complete 1000 verifications',
      icon: '🏆',
      rarity: 'legendary',
      unlocked: true
    },
    {
      title: 'Accuracy Expert',
      description: 'Maintain 95%+ accuracy for 6 months',
      icon: '🎯',
      rarity: 'epic',
      unlocked: true
    },
    {
      title: 'Fraud Detective',
      description: 'Detect 10 fraudulent submissions',
      icon: '🕵️',
      rarity: 'rare',
      unlocked: false
    },
    {
      title: 'Speed Demon',
      description: 'Average processing time under 2 days',
      icon: '⚡',
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          Certifier Leaderboard
        </motion.h1>
        <p className="text-gray-600">
          Rankings based on verification accuracy, efficiency, and contributions to the network.
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
            <Trophy className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">#3</p>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+2 positions</span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Your Points</h3>
            <Star className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">12,850</p>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+840</span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Accuracy Rate</h3>
            <Target className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">96.8%</p>
          <p className="text-xs text-gray-500">Last 30 days</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Verifications</h3>
            <CheckCircle className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">950</p>
          <p className="text-xs text-gray-500">This month</p>
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
                <h3 className="text-lg font-semibold text-gray-900">Top Certifiers</h3>
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
                    <option value="all">All Specializations</option>
                    <option value="solar">Solar</option>
                    <option value="wind">Wind</option>
                    <option value="hydro">Hydro</option>
                    <option value="nuclear">Nuclear</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {leaderboardData.map((certifier, index) => (
                <motion.div
                  key={certifier.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    certifier.rank === 3 ? 'bg-blue-50 border-l-4 border-blue-400' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(certifier.rank)}
                        {certifier.change !== 0 && getChangeIcon(certifier.change)}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                          {certifier.avatar}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">{certifier.certifier}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(certifier.badge)}`}>
                              {certifier.badge}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{certifier.location}</p>
                          <p className="text-xs text-blue-600">{certifier.specialization}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {certifier.verificationsCompleted.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Verifications</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">
                            {certifier.points.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Points</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center">
                            <Activity className="w-4 h-4 text-orange-500 mr-1" />
                            <span className="text-sm font-medium text-gray-900">{certifier.streak}</span>
                          </div>
                          <div className="text-xs text-gray-500">Day Streak</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-green-600">
                            {certifier.accuracy}%
                          </div>
                          <div className="text-xs text-gray-500">Accuracy</div>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifier Achievements</h3>
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
              <h3 className="text-lg font-semibold text-purple-900">Verification Season</h3>
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-purple-700">Progress</span>
                <span className="font-medium text-purple-900">18/30 days</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-700">Season Rank</span>
                <span className="font-medium text-purple-900">#3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-700">Reward Tier</span>
                <span className="font-medium text-purple-900">Gold</span>
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
                <h4 className="font-medium text-blue-800 mb-1">Accuracy Champion</h4>
                <p className="text-sm text-blue-700">Maintain 97%+ accuracy for 30 days</p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">Progress</span>
                <span className="font-medium text-blue-900">22/30 days</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '73%' }}></div>
              </div>
              <div className="text-sm text-blue-700">
                <strong>Reward:</strong> 1000 bonus points + Accuracy Badge
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;