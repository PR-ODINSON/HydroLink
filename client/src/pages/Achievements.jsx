import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy,
  Star,
  Target,
  Award,
  Medal,
  Crown,
  Zap,
  TrendingUp,
  Calendar,
  Lock,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Achievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/producer/achievements', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setAchievements(data.data.achievements);
        setUserStats(data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
      // Mock data for demo
      setAchievements([
        {
          _id: '1',
          achievement: {
            name: 'First Steps',
            description: 'Complete your first hydrogen production',
            category: 'Production',
            tier: 'Bronze',
            icon: 'zap',
            color: '#cd7f32'
          },
          isCompleted: true,
          earnedAt: '2025-01-15T00:00:00Z',
          progress: { current: 1, target: 1, percentage: 100 }
        },
        {
          _id: '2',
          achievement: {
            name: 'Green Pioneer',
            description: 'Produce 1000 MWh of clean energy',
            category: 'Production',
            tier: 'Gold',
            icon: 'leaf',
            color: '#ffd700'
          },
          isCompleted: true,
          earnedAt: '2025-01-20T00:00:00Z',
          progress: { current: 1250, target: 1000, percentage: 100 }
        },
        {
          _id: '3',
          achievement: {
            name: 'Efficiency Master',
            description: 'Maintain 95%+ efficiency for 30 days',
            category: 'Efficiency',
            tier: 'Silver',
            icon: 'target',
            color: '#c0c0c0'
          },
          isCompleted: true,
          earnedAt: '2025-01-18T00:00:00Z',
          progress: { current: 30, target: 30, percentage: 100 }
        },
        {
          _id: '4',
          achievement: {
            name: 'Consistency Champion',
            description: 'Produce energy for 100 consecutive days',
            category: 'Streak',
            tier: 'Gold',
            icon: 'calendar',
            color: '#ffd700'
          },
          isCompleted: false,
          progress: { current: 45, target: 100, percentage: 45 }
        },
        {
          _id: '5',
          achievement: {
            name: 'Carbon Crusher',
            description: 'Avoid 1000 tons of CO₂ emissions',
            category: 'Sustainability',
          tier: 'Platinum',
          icon: 'trending-up',
          color: '#e5e4e2'
        },
        isCompleted: false,
        progress: { current: 685, target: 1000, percentage: 68.5 }
      },
      {
        _id: '6',
        achievement: {
          name: 'Innovation Leader',
          description: 'Achieve 98%+ efficiency rating',
          category: 'Innovation',
          tier: 'Diamond',
          icon: 'crown',
          color: '#b9f2ff'
        },
        isCompleted: false,
        progress: { current: 96.8, target: 98, percentage: 98.8 }
      }
    ]);
    setUserStats({
      totalAchievements: 6,
      completedAchievements: 3,
      totalPoints: 750,
      completionRate: 50.0,
      byCategory: {
        Production: { total: 2, completed: 2, points: 300 },
        Efficiency: { total: 1, completed: 1, points: 150 },
        Sustainability: { total: 1, completed: 0, points: 0 },
        Streak: { total: 1, completed: 0, points: 0 },
        Innovation: { total: 1, completed: 0, points: 0 }
      }
    });
  } finally {
    setLoading(false);
  }
};

const getTierColor = (tier) => {
  switch (tier) {
    case 'Bronze': return 'from-amber-600 to-amber-700';
    case 'Silver': return 'from-gray-400 to-gray-500';
    case 'Gold': return 'from-yellow-400 to-yellow-500';
    case 'Platinum': return 'from-gray-300 to-gray-400';
    case 'Diamond': return 'from-blue-300 to-blue-400';
    default: return 'from-gray-400 to-gray-500';
  }
};

const getTierIcon = (tier) => {
  switch (tier) {
    case 'Bronze': return Medal;
    case 'Silver': return Award;
    case 'Gold': return Trophy;
    case 'Platinum': return Star;
    case 'Diamond': return Crown;
    default: return Trophy;
  }
};

const getIcon = (iconName) => {
  switch (iconName) {
    case 'zap': return Zap;
    case 'target': return Target;
    case 'calendar': return Calendar;
    case 'trending-up': return TrendingUp;
    case 'crown': return Crown;
    default: return Trophy;
  }
};

const categories = ['all', 'Production', 'Efficiency', 'Sustainability', 'Streak', 'Innovation'];

const filteredAchievements = achievements.filter(achievement => 
  selectedCategory === 'all' || achievement.achievement.category === selectedCategory
);

if (loading) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-300 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-300 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-gray-300 rounded-2xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

return (
  <div className="p-6 max-w-7xl mx-auto">
    {/* Header */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Achievements
        </h1>
        <p className="text-gray-600">
          Track your progress and unlock rewards for your accomplishments.
        </p>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-gray-900">{userStats.totalPoints}</p>
        <p className="text-sm text-gray-600">Total Points</p>
      </div>
    </motion.div>

    {/* Stats Overview */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">Completed</h3>
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <p className="text-2xl font-bold text-gray-900">{userStats.completedAchievements}</p>
        <p className="text-sm text-gray-500">out of {userStats.totalAchievements}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">Completion Rate</h3>
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
        <p className="text-2xl font-bold text-gray-900">{userStats.completionRate}%</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${userStats.completionRate}%` }}
          ></div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">Points Earned</h3>
          <Star className="w-5 h-5 text-yellow-600" />
        </div>
        <p className="text-2xl font-bold text-gray-900">{userStats.totalPoints}</p>
        <p className="text-sm text-gray-500">this month</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">Next Level</h3>
          <TrendingUp className="w-5 h-5 text-purple-600" />
        </div>
        <p className="text-2xl font-bold text-gray-900">Level 3</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: '75%' }}
          ></div>
        </div>
      </motion.div>
    </div>

    {/* Category Filter */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8"
    >
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'All Categories' : category}
          </button>
        ))}
      </div>
    </motion.div>

    {/* Achievements Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAchievements.map((userAchievement, index) => {
        const achievement = userAchievement.achievement;
        const TierIcon = getTierIcon(achievement.tier);
        const AchievementIcon = getIcon(achievement.icon);
        
        return (
          <motion.div
            key={userAchievement._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all ${
              userAchievement.isCompleted ? 'ring-2 ring-green-200' : ''
            }`}
          >
            {/* Achievement Header */}
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${getTierColor(achievement.tier)}`}>
                <AchievementIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <TierIcon className={`w-5 h-5 ${
                  userAchievement.isCompleted ? 'text-yellow-500' : 'text-gray-400'
                }`} />
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  userAchievement.isCompleted 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {achievement.tier}
                </span>
              </div>
            </div>

            {/* Achievement Info */}
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 mb-2">{achievement.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {achievement.category}
              </span>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-600">
                  {userAchievement.progress.current} / {userAchievement.progress.target}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    userAchievement.isCompleted 
                      ? 'bg-green-500' 
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(userAchievement.progress.percentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {userAchievement.progress.percentage.toFixed(1)}% complete
              </p>
            </div>

            {/* Status */}
            {userAchievement.isCompleted ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">
                  Completed {new Date(userAchievement.earnedAt).toLocaleDateString()}
                </span>
              </div>
            ) : userAchievement.progress.percentage > 0 ? (
              <div className="flex items-center text-blue-600">
                <Target className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">In Progress</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-400">
                <Lock className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Not Started</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>

    {filteredAchievements.length === 0 && (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200"
      >
        <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Achievements Found</h3>
        <p className="text-gray-600">Try selecting a different category.</p>
      </motion.div>
    )}
  </div>
);
};

export default Achievements;