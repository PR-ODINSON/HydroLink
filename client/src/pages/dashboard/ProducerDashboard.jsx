import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Zap, 
  TrendingUp, 
  Award,
  Trophy,
  Target,
  Flame,
  Star,
  Loader2,
  AlertCircle,
  Plus,
  CheckCircle
} from 'lucide-react';
import StatsGrid from '../../components/dashboard/StatsGrid';
import ChartsSection from '../../components/dashboard/ChartsSection';
import ActivityList from '../../components/dashboard/ActivityList';
import QuickActions from '../../components/dashboard/QuickActions';
import { useAuth } from '../../contexts/AuthContext';

const ProducerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/producer/dashboard', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        
        if (data.success) {
          const dashboardData = data.data;
          
          // Transform API data into stats format
          const transformedStats = [
            {
              title: "Total Credits",
              value: dashboardData.credits?.total?.toString() || "0",
              icon: CreditCard,
              trend: "up",
              trendValue: "+15.2%",
              color: "green",
              subtitle: "Credits produced"
            },
            {
              title: "Total Production",
              value: `${dashboardData.production?.total?.toFixed(1) || '0'} MWh`,
              icon: Zap,
              trend: "up", 
              trendValue: "+8.7%",
              color: "blue",
              subtitle: "Energy generated"
            },
            {
              title: "Efficiency Rating",
              value: `${dashboardData.production?.efficiency?.toFixed(1) || '0'}%`,
              icon: Target,
              trend: "up",
              trendValue: "+2.1%", 
              color: "purple",
              subtitle: "Production efficiency"
            },
            {
              title: "Active Facilities",
              value: dashboardData.facilities?.toString() || "0",
              icon: Trophy,
              trend: "stable",
              trendValue: "0",
              color: "orange",
              subtitle: "Production sites"
            }
          ];
          
          setStats(transformedStats);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        // Fallback to default stats if API fails
        setStats([
          {
            title: "Total Credits",
            value: "0",
            icon: CreditCard,
            trend: "stable",
            trendValue: "0%",
            color: "green",
            subtitle: "Credits produced"
          },
          {
            title: "Total Production",
            value: "0 MWh",
            icon: Zap,
            trend: "stable", 
            trendValue: "0%",
            color: "blue",
            subtitle: "Energy generated"
          },
          {
            title: "Efficiency Rating",
            value: "0%",
            icon: Target,
            trend: "stable",
            trendValue: "0%", 
            color: "purple",
            subtitle: "Production efficiency"
          },
          {
            title: "Active Facilities",
            value: "0",
            icon: Trophy,
            trend: "stable",
            trendValue: "0",
            color: "orange",
            subtitle: "Production sites"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Quick actions specific to producers
  const quickActions = [
    {
      title: "Request Credit Minting",
      description: "Submit new production data for certification",
      icon: Plus,
      color: "green",
      action: () => {
        // Navigate to credit request form
        window.location.href = '/credits';
      }
    },
    {
      title: "View Analytics", 
      description: "Analyze production trends and efficiency",
      icon: TrendingUp,
      color: "blue",
      action: () => {
        window.location.href = '/analytics';
      }
    },
    {
      title: "Manage Facilities",
      description: "Update facility information and capacity",
      icon: Zap,
      color: "purple",
      action: () => {
        window.location.href = '/production';
      }
    },
    {
      title: "Track Achievements",
      description: "Check progress on sustainability goals",
      icon: Award,
      color: "orange",
      action: () => {
        window.location.href = '/achievements';
      }
    }
  ];

  // Mock chart data - in real app this would come from API
  const chartData = {
    production: [
      { month: 'Jan', value: 2400 },
      { month: 'Feb', value: 2210 },
      { month: 'Mar', value: 2290 },
      { month: 'Apr', value: 2000 },
      { month: 'May', value: 2181 },
      { month: 'Jun', value: 2500 },
      { month: 'Jul', value: 2840 }
    ],
    efficiency: [
      { month: 'Jan', value: 92.1 },
      { month: 'Feb', value: 91.8 },
      { month: 'Mar', value: 93.2 },
      { month: 'Apr', value: 92.7 },
      { month: 'May', value: 94.1 },
      { month: 'Jun', value: 93.8 },
      { month: 'Jul', value: 94.2 }
    ]
  };

  // Mock activities - in real app this would come from API
  const recentActivities = [
    {
      id: 1,
      type: 'credit_minted',
      title: 'New credit minted',
      description: '150.5 MWh solar energy credit certified',
      timestamp: '2 hours ago',
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 2,
      type: 'production',
      title: 'Production milestone',
      description: 'Solar Farm Alpha reached 95% efficiency',
      timestamp: '6 hours ago',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Achievement unlocked',
      description: 'Green Producer badge earned',
      timestamp: '1 day ago',
      icon: Award,
      color: 'purple'
    },
    {
      id: 4,
      type: 'facility',
      title: 'Facility updated',
      description: 'Wind Farm Beta capacity increased to 200MW',
      timestamp: '2 days ago',
      icon: Zap,
      color: 'orange'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white rounded-2xl shadow-xl border border-red-200 p-8"
        >
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Zap className="text-green-600" />
              Producer Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user?.name || 'Producer'}! Monitor your green energy production and credits.
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
              <Star className="w-4 h-4" />
              {user?.stats?.level || 1} Level
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-1">
              <Flame className="w-4 h-4" />
              {user?.stats?.streak?.current || 0} Day Streak
            </span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <StatsGrid stats={stats} />

        {/* Charts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ChartsSection chartData={chartData} />
          </div>
          <div>
            <QuickActions actions={quickActions} />
          </div>
        </div>

        {/* Recent Activities */}
        <ActivityList activities={recentActivities} />
      </div>
    </div>
  );
};

export default ProducerDashboard;