import React, { useState, useEffect } from 'react';``
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Award, 
  TrendingDown, 
  Leaf, 
  Calendar, 
  MapPin, 
  Zap,
  User,
  DollarSign,
  ArrowRight,
  CheckCircle,
  Filter,
  Search,
  AlertCircle,
  Loader2,
  Factory
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import Chart from '../components/Chart';
import { useAuth } from '../contexts/AuthContext';

const Buyer = () => {
  const { user } = useAuth();
  const [availableCredits, setAvailableCredits] = useState([]);
  const [purchasedCredits, setPurchasedCredits] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [selectedCredits, setSelectedCredits] = useState([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch available credits
        const creditsResponse = await fetch('/api/buyer/credits/available', {
          credentials: 'include'
        });
        if (creditsResponse.ok) {
          const creditsData = await creditsResponse.json();
          setAvailableCredits(creditsData.data || []);
        }

        // Fetch purchased credits
        const purchasedResponse = await fetch('/api/buyer/credits/purchased', {
          credentials: 'include'
        });
        if (purchasedResponse.ok) {
          const purchasedData = await purchasedResponse.json();
          setPurchasedCredits(purchasedData.data || []);
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

    if (user) {
      fetchData();
    }
  }, [user]);

  // Mock data for charts and statistics
  const carbonOffsetData = [
    { name: 'Jan', value: 12.5 },
    { name: 'Feb', value: 18.2 },
    { name: 'Mar', value: 22.8 },
    { name: 'Apr', value: 35.4 },
    { name: 'May', value: 48.7 },
    { name: 'Jun', value: 84.2 }
  ];

  const retiredCredits = [
    {
      id: 'HC-202412-ABC123',
      amount: 150,
      co2Reduction: 12.5,
      retiredDate: '2024-12-01',
      purpose: 'Q4 Sustainability Goals'
    },
    {
      id: 'HC-202411-DEF456',
      amount: 200,
      co2Reduction: 18.3,
      retiredDate: '2024-11-15',
      purpose: 'Annual Carbon Neutrality'
    },
    {
      id: 'HC-202410-GHI789',
      amount: 100,
      co2Reduction: 8.7,
      retiredDate: '2024-10-30',
      purpose: 'Supply Chain Offset'
    }
  ];

  const filteredCredits = availableCredits.filter(credit => {
    const matchesFilter = filter === 'all' || credit.energySource?.toLowerCase() === filter.toLowerCase();
    const matchesSearch = credit.producer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credit.creditId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credit.facilityName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handlePurchaseCredit = (credit) => {
    setSelectedCredit(credit);
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedCredit) {
      setError('No credit selected');
      return;
    }

    try {
      const response = await fetch(`/api/buyer/credits/${selectedCredit._id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const responseData = await response.json();
        setShowPurchaseModal(false);
        setSelectedCredit(null);
        alert('✅ REQUEST SENT! ✅');
        // Refresh the data to show any updates
        window.location.reload(); 
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to send purchase request');
      }
    } catch (error) {
      console.error('Error purchasing credit:', error);
      setError('Failed to purchase credit');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            Credit Marketplace
          </motion.h1>
          <p className="text-gray-600">
            Purchase and retire green hydrogen credits for your sustainability goals.
          </p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DashboardCard
            title="Available Credits"
            value={dashboardStats?.marketplace?.availableCredits?.toString() || '0'}
            icon={ShoppingCart}
            color="blue"
            subtitle="Ready for purchase"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DashboardCard
            title="Credits Purchased"
            value={dashboardStats?.portfolio?.totalCredits?.toString() || '0'}
            icon={Award}
            color="green"
            subtitle="Credits owned"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DashboardCard
            title="Total Spent"
            value={`$${dashboardStats?.portfolio?.totalSpent?.toLocaleString() || '0'}`}
            icon={DollarSign}
            color="orange"
            subtitle="Investment in credits"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DashboardCard
            title="Pending Requests"
            value={dashboardStats?.portfolio?.pendingRequests?.toString() || '0'}
            icon={TrendingDown}
            color="yellow"
            subtitle="Awaiting approval"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Carbon Offset Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Chart
            type="area"
            data={carbonOffsetData}
            xKey="name"
            yKey="value"
            color="#10b981"
            title="Carbon Offset Progress (tonnes CO₂)"
            gradient={true}
            height={300}
          />
        </motion.div>

        {/* Retired Credits Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recently Retired</h3>
          <div className="space-y-4">
            {retiredCredits.map((credit, index) => (
              <div key={credit.id} className="border-l-4 border-green-400 pl-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{credit.id}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(credit.retiredDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {credit.amount.toLocaleString()} MWh • {credit.co2Reduction}t CO₂
                </div>
                <div className="text-xs text-gray-500 mt-1">{credit.purpose}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Marketplace */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <h3 className="text-lg font-semibold text-gray-900">Available Credits</h3>
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search credits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Sources</option>
                <option value="solar">Solar</option>
                <option value="wind">Wind</option>
                <option value="hydro">Hydro</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
          {filteredCredits.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Smart Contracts Available</h3>
              <p className="text-gray-500">No certified hydrogen credits are currently available for purchase.</p>
            </div>
          ) : (
            filteredCredits.map((credit, index) => (
              <motion.div
                key={credit._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative ${
                  credit.isSold ? 'opacity-75' : ''
                }`}
              >
                {/* Sold Overlay */}
                {credit.isSold && (
                  <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10 rounded-xl">
                    <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg transform rotate-12">
                      SOLD OUT
                    </div>
                  </div>
                )}
                {/* Smart Contract Header */}
                <div className="bg-gradient-to-r from-green-500 to-blue-600 px-6 py-4">
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <h3 className="font-bold text-lg">{credit.creditId}</h3>
                      <p className="text-green-100 text-sm">Smart Contract #{credit.tokenId || 'Pending'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{credit.energyAmountMWh}</div>
                      <div className="text-green-100 text-sm">MWh</div>
                    </div>
                  </div>
                </div>

                {/* Producer Information */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{credit.producer?.name || 'Unknown Producer'}</p>
                      <p className="text-sm text-gray-600">Producer</p>
                    </div>
                  </div>
                </div>

                {/* Credit Details */}
                <div className="px-6 py-4 space-y-3">
                  {/* Status and Energy Source */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {credit.status}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {credit.energySource}
                    </span>
                  </div>

                  {/* Facility Information */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Factory className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Facility:</span>
                      <span className="ml-1">{credit.facilityName}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{credit.facilityLocation}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Produced: {new Date(credit.productionDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Environmental Impact */}
                  {credit.environmentalImpact?.co2Avoided && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex items-center text-sm text-green-700">
                        <Leaf className="w-4 h-4 mr-2" />
                        <span className="font-medium">Environmental Impact:</span>
                      </div>
                      <div className="text-sm text-green-600 mt-1">
                        Reduces {credit.environmentalImpact.co2Avoided}t CO₂ emissions
                      </div>
                    </div>
                  )}

                  {/* Certification Info */}
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center text-sm text-blue-700">
                      <Award className="w-4 h-4 mr-2" />
                      <span className="font-medium">Certified by:</span>
                      <span className="ml-1">{credit.certifier?.name || 'Verification Authority'}</span>
                    </div>
                    {credit.certificationDate && (
                      <div className="text-sm text-blue-600 mt-1">
                        Certified on {new Date(credit.certificationDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Purchase Section */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Smart Contract Status:</span>
                      <span className={`ml-1 ${credit.isSold ? 'text-red-600' : 'text-green-600'}`}>
                        {credit.isSold ? 'Already Sold' : 'Available for Purchase'}
                      </span>
                    </div>
                    {credit.tokenId && (
                      <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        Token: {credit.tokenId}
                      </div>
                    )}
                  </div>
                  
                  {credit.status === 'Certified' && !credit.isSold ? (
                    <button
                      onClick={() => handlePurchaseCredit(credit)}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center group font-medium shadow-sm"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Register to Purchase
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <div 
                      className={`w-full py-3 px-4 rounded-lg flex items-center justify-center font-medium ${
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
            className="bg-white rounded-2xl p-6 w-full max-w-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Register to Purchase</h3>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              {/* Credit Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{selectedCredit.creditId}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>Producer: {selectedCredit.producer?.name}</div>
                  <div>Energy: {selectedCredit.energyAmountMWh} MWh</div>
                  <div>Source: {selectedCredit.energySource}</div>
                  <div>Facility: {selectedCredit.facilityName}</div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">
                    Register to purchase this credit?
                  </span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  This will send a purchase request to the producer. They will receive an email and notification to approve or reject your request.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
              >
                Send Request
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Buyer;
