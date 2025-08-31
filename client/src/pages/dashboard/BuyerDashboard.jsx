import React, { useState, useEffect } from 'react';
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
  Recycle,
  User,
  MapPin,
  Calendar,
  Factory,
  CheckCircle,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';
import StatsGrid from '../../components/dashboard/StatsGrid';
import ChartsSection from '../../components/dashboard/ChartsSection';
import ActivityList from '../../components/dashboard/ActivityList';
import QuickActions from '../../components/dashboard/QuickActions';
import { useAuth } from '../../contexts/AuthContext';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [availableCredits, setAvailableCredits] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [purchasing, setPurchasing] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch available credits
        const creditsResponse = await fetch('/api/buyer/credits/available', {
          credentials: 'include'
        });
        if (creditsResponse.ok) {
          const creditsData = await creditsResponse.json();
          console.log('Credits received:', creditsData.data);
          setAvailableCredits(Array.isArray(creditsData.data) ? creditsData.data : creditsData);

        } else {
          console.error('Failed to fetch credits:', creditsResponse.status);
        }

        // Fetch dashboard stats
        const dashboardResponse = await fetch('/api/buyer/dashboard', {
          credentials: 'include'
        });
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          setDashboardStats(dashboardData.data);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Handle purchase credit
  const handlePurchaseClick = (credit) => {
    setSelectedCredit(credit);
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedCredit) return;

    try {
      setPurchasing(true);
      console.log('🛒 BUYER: Sending purchase request for credit:', selectedCredit._id);
      console.log('🛒 BUYER: Credit details:', {
        creditId: selectedCredit.creditId,
        producer: selectedCredit.producer?.name,
        energyAmount: selectedCredit.energyAmountMWh
      });
      
      const response = await fetch(`/api/buyer/credits/${selectedCredit._id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ BUYER: Purchase request sent successfully!', result);
        setShowPurchaseModal(false);
        setSelectedCredit(null);
        
        // Show success message
        alert('✅ REQUEST SENT! ✅');
        
        console.log('🔔 BUYER: Now the producer should see a notification in their dashboard!');
        
        // Refresh the data
        window.location.reload();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to purchase credit');
      }
    } catch (error) {
      console.error('Error purchasing credit:', error);
      setError('Failed to purchase credit');
    } finally {
      setPurchasing(false);
    }
  };

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

  // availableCredits now comes from state (fetched from backend)

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

  // handlePurchase is now replaced by handlePurchaseClick

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Loading dashboard...</p>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Buyer Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your credit portfolio and track sustainability impact.
        </p>
        
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Stats Grid */}
      {/* <StatsGrid stats={stats} className="mb-8" /> */}

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
          <h3 className="text-lg font-semibold text-gray-900">All Producer Credits</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View Marketplace
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {availableCredits.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Credits Found</h3>
              <p className="text-gray-500">No hydrogen credits found in the database.</p>
            </div>
          ) : (
            availableCredits.map((credit) => (
              <motion.div
                key={credit._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white relative ${
                  credit.isSold ? 'opacity-75' : ''
                }`}
              >
                {/* Sold Overlay */}
                {credit.isSold && (
                  <div className="absolute inset-0 bg-[#ffff]/40 bg-opacity-50 flex items-center justify-center z-10 rounded-xl">
                    <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg transform rotate-12">
                      SOLD OUT
                    </div>
                  </div>
                )}
                {/* Smart Contract Header */}
                <div className="bg-gradient-to-r from-green-500 to-blue-600 px-4 py-3">
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <h3 className="font-bold text-base">{credit.creditId}</h3>
                      <p className="text-green-100 text-xs">Smart Contract #{credit.tokenId || 'Pending'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">{credit.energyAmountMWh}</div>
                      <div className="text-green-100 text-xs">MWh</div>
                    </div>
                  </div>
                </div>

                {/* Producer Information */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{credit.producer?.name || 'Unknown Producer'}</p>
                      <p className="text-xs text-gray-600">Producer</p>
                    </div>
                  </div>
                </div>

                {/* Credit Details */}
                <div className="px-4 py-3 space-y-3">
                  {/* Status and Energy Source */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {credit.status}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {credit.energySource}
                    </span>
                  </div>

                  {/* Facility Information */}
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-gray-600">
                      <Factory className="w-3 h-3 mr-1 text-gray-400" />
                      <span className="font-medium">Facility:</span>
                      <span className="ml-1 truncate">{credit.facilityName}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                      <span className="truncate">{credit.facilityLocation}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                      <span>Produced: {new Date(credit.productionDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Environmental Impact */}
                  {credit.environmentalImpact?.co2Avoided && (
                    <div className="bg-green-50 rounded-lg p-2">
                      <div className="flex items-center text-xs text-green-700">
                        <Leaf className="w-3 h-3 mr-1" />
                        <span>Reduces {credit.environmentalImpact.co2Avoided}t CO₂</span>
                      </div>
                    </div>
                  )}

                  {/* Certification Info */}
                  <div className="bg-blue-50 rounded-lg p-2">
                    <div className="flex items-center text-xs text-blue-700">
                      <Award className="w-3 h-3 mr-1" />
                      <span>Certified by {credit.certifier?.name || 'Authority'}</span>
                    </div>
                    {credit.certificationDate && (
                      <div className="text-xs text-blue-600 mt-1">
                        Certified: {new Date(credit.certificationDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Additional Credit Info */}
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Credit ID: {credit.creditId}</div>
                    {credit.tokenId && <div>Blockchain Token: {credit.tokenId}</div>}
                    <div>Network: {credit.blockchain?.network || 'Polygon'}</div>
                    <div>Status: {credit.status} • Available: {credit.isSold ? 'No' : 'Yes'}</div>
                  </div>
                </div>

                {/* Purchase Button */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  {credit.status === 'Certified' && !credit.isSold ? (
                    <button
                      onClick={() => handlePurchaseClick(credit)}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center font-medium text-sm shadow-sm"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Register to Purchase
                    </button>
                  ) : (
                    <div 
                      className={`w-full py-2 px-4 rounded-lg flex items-center justify-center font-medium text-sm ${
                        credit.isSold 
                          ? 'bg-red-100 text-red-700 cursor-not-allowed' 
                          : 'bg-gray-300 text-gray-600'
                      }`}
                      style={credit.isSold ? { cursor: 'not-allowed' } : {}}
                    >
                      {credit.isSold ? '❌ Already Sold' : `📋 ${credit.status}`}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
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

      {/* Purchase Confirmation Modal */}
      {showPurchaseModal && selectedCredit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Register and Send Purchase Request</h3>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Smart Contract Details */}
            <div className="space-y-6">
              {/* Contract Header */}
              <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold">{selectedCredit.creditId}</h4>
                    <p className="text-green-100">Smart Contract #{selectedCredit.tokenId || 'Pending'}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{selectedCredit.energyAmountMWh}</div>
                    <div className="text-green-100">MWh Energy</div>
                  </div>
                </div>
              </div>

              {/* Producer Information */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Producer Information
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Producer Name</p>
                    <p className="font-medium text-gray-900">{selectedCredit.producer?.name || 'Unknown Producer'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Producer Email</p>
                    <p className="font-medium text-gray-900">{selectedCredit.producer?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Wallet Address</p>
                    <p className="font-medium text-gray-900 text-xs">
                      {selectedCredit.producer?.walletAddress || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Producer Role</p>
                    <p className="font-medium text-gray-900">{selectedCredit.producer?.role || 'Producer'}</p>
                  </div>
                </div>
              </div>

              {/* Credit Details */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-green-600" />
                  Smart Contract Details
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Energy Source</p>
                    <p className="font-medium text-gray-900">{selectedCredit.energySource}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {selectedCredit.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Production Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedCredit.productionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Certification Date</p>
                    <p className="font-medium text-gray-900">
                      {selectedCredit.certificationDate ? 
                        new Date(selectedCredit.certificationDate).toLocaleDateString() : 
                        'N/A'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Facility Information */}
              <div className="bg-green-50 rounded-xl p-4">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Factory className="w-5 h-5 mr-2 text-orange-600" />
                  Facility Information
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Facility Name</p>
                    <p className="font-medium text-gray-900">{selectedCredit.facilityName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{selectedCredit.facilityLocation}</p>
                  </div>
                </div>
              </div>

              {/* Environmental Impact */}
              {selectedCredit.environmentalImpact?.co2Avoided && (
                <div className="bg-green-50 rounded-xl p-4">
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Leaf className="w-5 h-5 mr-2 text-green-600" />
                    Environmental Impact
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">CO₂ Avoided</p>
                      <p className="font-medium text-gray-900">{selectedCredit.environmentalImpact.co2Avoided}t</p>
                    </div>
                    {selectedCredit.environmentalImpact.waterUsed && (
                      <div>
                        <p className="text-sm text-gray-600">Water Used</p>
                        <p className="font-medium text-gray-900">{selectedCredit.environmentalImpact.waterUsed}L</p>
                      </div>
                    )}
                    {selectedCredit.environmentalImpact.landUsed && (
                      <div>
                        <p className="text-sm text-gray-600">Land Used</p>
                        <p className="font-medium text-gray-900">{selectedCredit.environmentalImpact.landUsed} acres</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Certification Information */}
              <div className="bg-purple-50 rounded-xl p-4">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-purple-600" />
                  Certification Details
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Certified By</p>
                    <p className="font-medium text-gray-900">
                      {selectedCredit.certifier?.name || 'Verification Authority'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Blockchain Network</p>
                    <p className="font-medium text-gray-900">{selectedCredit.blockchain?.network || 'Polygon'}</p>
                  </div>
                </div>
              </div>

              {/* Purchase Confirmation */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h6 className="font-semibold text-yellow-800 mb-1">Register to Purchase</h6>
                    <p className="text-sm text-yellow-700">
                      By clicking "Send Request", you will register to purchase this credit and send a request to the producer. 
                      The producer will receive an email and in-app notification about your request.
                      They can then approve or reject your purchase request from their Reports section.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setShowPurchaseModal(false)}
                disabled={purchasing}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                disabled={purchasing}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-medium disabled:opacity-50 flex items-center justify-center"
              >
                {purchasing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Send Request
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BuyerDashboard;
