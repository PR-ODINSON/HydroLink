import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Trees,
  Car,
  Home,
  Factory,
  BarChart3,
  Users,
  Globe
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const Sustainability = () => {
  const [impactData, setImpactData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('yearly');

  useEffect(() => {
    // Mock sustainability impact data
    setImpactData({
      totalCO2Offset: 1845,
      totalCreditsRetired: 1420,
      annualGoal: 2000,
      goalProgress: 92.3,
      equivalents: {
        treesPlanted: 92250,
        carMilesOffset: 4065300,
        homesEnergy: 245,
        coalNotBurned: 923
      },
      monthlyProgress: [
        { month: 'Jan', co2: 120, target: 167 },
        { month: 'Feb', co2: 145, target: 167 },
        { month: 'Mar', co2: 180, target: 167 },
        { month: 'Apr', co2: 165, target: 167 },
        { month: 'May', co2: 190, target: 167 },
        { month: 'Jun', co2: 155, target: 167 },
        { month: 'Jul', co2: 175, target: 167 },
        { month: 'Aug', co2: 160, target: 167 },
        { month: 'Sep', co2: 185, target: 167 },
        { month: 'Oct', co2: 170, target: 167 },
        { month: 'Nov', co2: 195, target: 167 },
        { month: 'Dec', co2: 205, target: 167 }
      ],
      byEnergySource: [
        { source: 'Solar', co2: 829, percentage: 45, color: '#f59e0b' },
        { source: 'Wind', co2: 553, percentage: 30, color: '#3b82f6' },
        { source: 'Hydro', co2: 277, percentage: 15, color: '#10b981' },
        { source: 'Nuclear', co2: 186, percentage: 10, color: '#8b5cf6' }
      ],
      achievements: [
        {
          title: 'Carbon Neutral Champion',
          description: 'Offset 1000+ tons of CO₂',
          icon: '🌍',
          date: '2024-10-15',
          type: 'milestone'
        },
        {
          title: 'Green Energy Advocate',
          description: 'Support 100% renewable sources',
          icon: '⚡',
          date: '2024-08-22',
          type: 'achievement'
        },
        {
          title: 'Sustainability Pioneer',
          description: 'First to achieve annual goal',
          icon: '🏆',
          date: '2024-11-30',
          type: 'award'
        }
      ],
      companyGoals: {
        carbonNeutral: { target: 2025, progress: 85 },
        renewable100: { target: 2024, progress: 95 },
        netZero: { target: 2030, progress: 35 }
      }
    });
    setLoading(false);
  }, [selectedPeriod]);

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'];

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
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sustainability Impact</h1>
        <p className="text-gray-600">Track your environmental impact and progress toward sustainability goals.</p>
      </motion.div>

      {/* Impact Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-sm border border-green-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-green-700">Total CO₂ Offset</h3>
            <Leaf className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">{impactData.totalCO2Offset?.toLocaleString()} tons</p>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm text-green-700">Lifetime impact</span>
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
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{impactData.totalCreditsRetired?.toLocaleString()}</p>
          <p className="text-xs text-gray-500">For sustainability goals</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Annual Goal</h3>
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{impactData.goalProgress?.toFixed(1)}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${impactData.goalProgress}%` }}
            ></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 rounded-2xl shadow-sm border border-blue-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-blue-700">Trees Equivalent</h3>
            <Trees className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-900">{impactData.equivalents?.treesPlanted?.toLocaleString()}</p>
          <p className="text-xs text-blue-600">Trees planted equivalent</p>
        </motion.div>
      </div>

      {/* Environmental Equivalents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Environmental Impact Equivalents</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <Trees className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-green-900">{(impactData.equivalents?.treesPlanted / 1000).toFixed(0)}K</p>
            <p className="text-sm text-green-700">Trees Planted</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <Car className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-blue-900">{(impactData.equivalents?.carMilesOffset / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-blue-700">Car Miles Offset</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <Home className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-orange-900">{impactData.equivalents?.homesEnergy}</p>
            <p className="text-sm text-orange-700">Homes Powered/Year</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <Factory className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-gray-900">{impactData.equivalents?.coalNotBurned}</p>
            <p className="text-sm text-gray-700">Tons Coal Not Burned</p>
          </div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly CO₂ Offset Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={impactData.monthlyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="co2" 
                stackId="1"
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.6}
                name="CO₂ Offset (tons)"
              />
              <Area 
                type="monotone" 
                dataKey="target" 
                stackId="2"
                stroke="#f59e0b" 
                fill="#f59e0b" 
                fillOpacity={0.3}
                name="Target (tons)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Impact by Energy Source */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Impact by Energy Source</h3>
          <div className="flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={impactData.byEnergySource}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="co2"
                  label={({ source, percentage }) => `${source}: ${percentage}%`}
                >
                  {impactData.byEnergySource?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {impactData.byEnergySource?.map((item, index) => (
              <div key={item.source} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-gray-700">{item.source}</span>
                </div>
                <span className="font-medium text-gray-900">{item.co2} tons</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Achievements and Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Achievements</h3>
          <div className="space-y-4">
            {impactData.achievements?.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <p className="text-xs text-gray-500">{new Date(achievement.date).toLocaleDateString()}</p>
                </div>
                <Award className="w-5 h-5 text-yellow-500" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Company Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Sustainability Goals</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Carbon Neutral by {impactData.companyGoals?.carbonNeutral?.target}</span>
                <span className="text-sm font-bold text-green-600">{impactData.companyGoals?.carbonNeutral?.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${impactData.companyGoals?.carbonNeutral?.progress}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">100% Renewable by {impactData.companyGoals?.renewable100?.target}</span>
                <span className="text-sm font-bold text-blue-600">{impactData.companyGoals?.renewable100?.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${impactData.companyGoals?.renewable100?.progress}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Net Zero by {impactData.companyGoals?.netZero?.target}</span>
                <span className="text-sm font-bold text-purple-600">{impactData.companyGoals?.netZero?.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${impactData.companyGoals?.netZero?.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Sustainability;