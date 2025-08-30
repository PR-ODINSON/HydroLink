import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  FileText,
  Users,
  TrendingUp,
  Activity,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import StatsGrid from '../../components/dashboard/StatsGrid';
import ChartsSection from '../../components/dashboard/ChartsSection';
import ActivityList from '../../components/dashboard/ActivityList';
import QuickActions from '../../components/dashboard/QuickActions';
import { useAuth } from '../../contexts/AuthContext';

const CertifierDashboard = () => {
  const { user } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/certifier/dashboard', {
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
              title: "Credits Verified",
              value: dashboardData.stats?.creditsVerified?.toString() || "0",
              icon: Shield,
              trend: "up",
              trendValue: "+12.3%",
              color: "blue",
              subtitle: "Total verified"
            },
            {
              title: "Pending Requests",
              value: dashboardData.stats?.pendingRequests?.toString() || "0",
              icon: Clock,
              trend: "down",
              trendValue: "-5.2%",
              color: "orange",
              subtitle: "Awaiting review"
            },
            {
              title: "Approval Rate",
              value: `${dashboardData.stats?.approvalRate?.toFixed(1) || '0'}%`,
              icon: CheckCircle,
              trend: "up",
              trendValue: "+1.8%",
              color: "green",
              subtitle: "Quality score"
            },
            {
              title: "Fraud Detected",
              value: dashboardData.stats?.fraudDetected?.toString() || "0",
              icon: AlertTriangle,
              trend: "down",
              trendValue: "-50%",
              color: "red",
              subtitle: "This month"
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
            title: "Credits Verified",
            value: "0",
            icon: Shield,
            trend: "stable",
            trendValue: "0%",
            color: "blue",
            subtitle: "Total verified"
          },
          {
            title: "Pending Requests",
            value: "0",
            icon: Clock,
            trend: "stable",
            trendValue: "0%",
            color: "orange",
            subtitle: "Awaiting review"
          },
          {
            title: "Approval Rate",
            value: "0%",
            icon: CheckCircle,
            trend: "stable",
            trendValue: "0%",
            color: "green",
            subtitle: "Quality score"
          },
          {
            title: "Fraud Detected",
            value: "0",
            icon: AlertTriangle,
            trend: "stable",
            trendValue: "0%",
            color: "red",
            subtitle: "This month"
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

  // Mock data for charts (can be replaced with real data later)
  const charts = [
    {
      type: 'area',
      title: 'Verification Trends',
      data: [
        { name: 'Jan', verified: 720, pending: 45 },
        { name: 'Feb', verified: 890, pending: 32 },
        { name: 'Mar', verified: 1050, pending: 28 },
        { name: 'Apr', verified: 1180, pending: 35 },
        { name: 'May', verified: 1320, pending: 23 },
        { name: 'Jun', verified: 1420, pending: 23 }
      ],
      xKey: 'name',
      yKey: 'verified',
      color: '#3b82f6',
      gradient: true,
      height: 320
    },
    {
      type: 'pie',
      title: 'Verification Status',
      data: [
        { name: 'Approved', value: 847, color: '#10b981' },
        { name: 'Rejected', value: 53, color: '#ef4444' },
        { name: 'Under Review', value: 23, color: '#f59e0b' }
      ],
      xKey: 'name',
      yKey: 'value',
      height: 320
    }
  ];

  const pendingRequests = [
    {
      id: 'CR-2025-001',
      producer: 'GreenTech Industries',
      amount: '450 credits',
      productionDate: '2025-01-15',
      facility: 'Solar H2 Plant Delta',
      priority: 'high',
      submittedAt: '2 hours ago',
      riskScore: 'low'
    },
    {
      id: 'CR-2025-002', 
      producer: 'EcoEnergy Corp',
      amount: '320 credits',
      productionDate: '2025-01-14',
      facility: 'Wind H2 Plant Alpha',
      priority: 'medium',
      submittedAt: '4 hours ago',
      riskScore: 'medium'
    },
    {
      id: 'CR-2025-003',
      producer: 'HydroGen Solutions',
      amount: '680 credits',
      productionDate: '2025-01-13',
      facility: 'Hydro H2 Plant Beta',
      priority: 'high',
      submittedAt: '6 hours ago',
      riskScore: 'low'
    }
  ];

  const activities = [
    {
      id: 1,
      type: 'approve',
      description: 'Approved 320 credits from EcoEnergy Corp',
      amount: '320 credits',
      time: '1 hour ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'reject',
      description: 'Rejected credits due to incomplete documentation',
      amount: '150 credits',
      time: '3 hours ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'fraud',
      description: 'Flagged suspicious activity in CR-2025-XXX',
      time: '5 hours ago',
      status: 'pending'
    },
    {
      id: 4,
      type: 'review',
      description: 'Started verification of SolarMax Energy credits',
      amount: '450 credits',
      time: '1 day ago',
      status: 'completed'
    }
  ];

  const quickActions = [
    {
      label: 'Review Pending Requests',
      icon: FileText,
      color: 'blue',
      onClick: () => console.log('Review requests')
    },
    {
      label: 'Fraud Detection Report',
      icon: AlertTriangle,
      color: 'red',
      onClick: () => console.log('View fraud report')
    },
    {
      label: 'Verification History',
      icon: Shield,
      color: 'green',
      onClick: () => console.log('View history')
    },
    {
      label: 'Producer Analytics',
      icon: Users,
      color: 'purple',
      onClick: () => console.log('View analytics')
    }
  ];

  const handleApprove = (requestId) => {
    console.log('Approving request:', requestId);
    // Handle approval logic
  };

  const handleReject = (requestId) => {
    console.log('Rejecting request:', requestId);
    // Handle rejection logic
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'approve': return <CheckCircle className="w-4 h-4" />;
      case 'reject': return <XCircle className="w-4 h-4" />;
      case 'fraud': return <AlertTriangle className="w-4 h-4" />;
      case 'review': return <Eye className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'approve': return 'text-green-600 bg-green-100';
      case 'reject': return 'text-red-600 bg-red-100';
      case 'fraud': return 'text-orange-600 bg-orange-100';
      case 'review': return 'text-blue-600 bg-blue-100';
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
          Certifier Dashboard
        </h1>
        <p className="text-gray-600">
          Verify and validate hydrogen credit authenticity and compliance.
        </p>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-2 text-gray-600">Loading dashboard data...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">Error: {error}</span>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      {!loading && (
        <>
          {/* Stats Grid */}
          <StatsGrid stats={stats} className="mb-8" />

          {/* Fraud Alert */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 p-4 rounded-xl mb-8"
      >
        <div className="flex items-center">
          <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Fraud Detection Alert
            </h3>
            <p className="text-sm text-red-700 mt-1">
              AI system detected 2 potentially fraudulent submissions. Immediate review required.
            </p>
          </div>
          <button className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
            Review Now
          </button>
        </div>
      </motion.div>

      {/* Pending Verification Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Pending Verification Requests</h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <div key={request.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium text-gray-900">{request.id}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                    {request.priority} priority
                  </span>
                  <span className={`text-xs font-medium ${getRiskColor(request.riskScore)}`}>
                    {request.riskScore} risk
                  </span>
                </div>
                <span className="text-sm text-gray-500">{request.submittedAt}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Producer</p>
                  <p className="text-sm font-medium">{request.producer}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="text-sm font-medium">{request.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Production Date</p>
                  <p className="text-sm font-medium">{request.productionDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Facility</p>
                  <p className="text-sm font-medium">{request.facility}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleReject(request.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                  >
                    Approve
                  </button>
                </div>
              </div>
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
          title="Recent Verifications"
          getActivityIcon={getActivityIcon}
          getActivityColor={getActivityColor}
          className="lg:col-span-2"
        />

        {/* Quick Actions */}
        <QuickActions actions={quickActions} title="Verification Tools" />
      </div>
        </>
      )}
    </div>
  );
};

export default CertifierDashboard;
