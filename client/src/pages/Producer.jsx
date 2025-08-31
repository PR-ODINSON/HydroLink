import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Factory, 
  Award, 
  Calendar, 
  MapPin, 
  Zap, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Trophy,
  Star,
  DollarSign,
  ShoppingCart,
  Bell,
  User,
  Loader2
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import { useAuth } from '../contexts/AuthContext';

const Producer = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState([]);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch producer data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch producer credits
        const creditsResponse = await fetch('/api/producer/credits', {
          credentials: 'include'
        });
        if (creditsResponse.ok) {
          const creditsData = await creditsResponse.json();
          setCredits(creditsData.data || []);
        }

        // Fetch pending purchase requests
        const purchaseRequestsResponse = await fetch('/api/producer/sales/pending', {
          credentials: 'include'
        });
        if (purchaseRequestsResponse.ok) {
          const purchaseRequestsData = await purchaseRequestsResponse.json();
          setPurchaseRequests(purchaseRequestsData.data || []);
        }

        // Fetch dashboard stats
        const dashboardResponse = await fetch('/api/producer/dashboard', {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Certified': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Rejected': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Certified': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Loading producer dashboard...</p>
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
            Producer Dashboard
          </motion.h1>
          <p className="text-gray-600">
            Manage your hydrogen production and track credit sales.
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
            title="Total Credits"
            value={dashboardStats?.credits?.total?.toString() || '0'}
            icon={Award}
            color="blue"
            subtitle="Credits produced"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DashboardCard
            title="Certified Credits"
            value={credits.filter(c => c.status === 'Certified').length.toString()}
            icon={CheckCircle}
            color="green"
            subtitle="Ready for sale"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DashboardCard
            title="Credits Sold"
            value={credits.filter(c => c.isSold).length.toString()}
            icon={DollarSign}
            color="orange"
            subtitle="Successfully sold"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DashboardCard
            title="Purchase Requests"
            value={purchaseRequests.length.toString()}
            icon={Bell}
            color="purple"
            subtitle="Awaiting response"
          />
        </motion.div>
      </div>

      {/* Purchase Requests Section */}
      {purchaseRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-orange-600" />
              Purchase Requests ({purchaseRequests.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {purchaseRequests.map((request, index) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-6 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Purchase Request for {request.credit?.creditId}
                    </h4>
                    <p className="text-gray-600 mb-3">
                      {request.buyer?.name} wants to purchase this hydrogen credit
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {request.buyer?.name}
                      </div>
                      <div className="flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        {request.credit?.energyAmountMWh} MWh
                      </div>
                      <div className="flex items-center">
                        <Factory className="w-4 h-4 mr-2" />
                        {request.credit?.facilityName}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(request.requestDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Energy Source:</span> {request.credit?.energySource}
                    </div>
                  </div>
                  
                  <div className="ml-6 flex space-x-3">
                    <button
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      onClick={async () => {
                        try {
                          const response = await fetch(`/api/producer/sales/${request._id}/reject`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({
                              rejectionReason: 'Producer declined the purchase request'
                            })
                          });
                          
                          if (response.ok) {
                            setPurchaseRequests(prev => prev.filter(r => r._id !== request._id));
                            alert('Purchase request declined. The buyer has been notified.');
                          } else {
                            const errorData = await response.json();
                            alert('Failed to decline request: ' + errorData.message);
                          }
                        } catch (error) {
                          console.error('Error declining request:', error);
                          alert('Failed to decline request');
                        }
                      }}
                    >
                      Decline
                    </button>
                    <button
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      onClick={async () => {
                        try {
                          const response = await fetch(`/api/producer/sales/${request._id}/accept`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include'
                          });
                          
                          if (response.ok) {
                            setPurchaseRequests(prev => prev.filter(r => r._id !== request._id));
                            alert('Purchase request accepted! Credit has been transferred to the buyer.');
                            // Refresh credits to show updated sold status
                            window.location.reload();
                          } else {
                            const errorData = await response.json();
                            alert('Failed to accept request: ' + errorData.message);
                          }
                        } catch (error) {
                          console.error('Error accepting request:', error);
                          alert('Failed to accept request');
                        }
                      }}
                    >
                      Accept Sale
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Credits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Credits</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {credits.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Factory className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No credits found</p>
            </div>
          ) : (
            credits.map((credit, index) => (
              <motion.div
                key={credit._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-medium text-gray-900">{credit.creditId}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(credit.status)}`}>
                        {credit.status}
                      </span>
                      {credit.isSold && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          SOLD
                        </span>
                      )}
                      {credit.tokenId && (
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                          Token: {credit.tokenId}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        {credit.energyAmountMWh?.toLocaleString()} MWh
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {credit.facilityLocation}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(credit.productionDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        {getStatusIcon(credit.status)}
                        <span className="ml-2">{credit.energySource}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Facility:</span>
                      <span className="ml-2">{credit.facilityName}</span>
                    </div>
                  </div>
                  
                  <div className="text-right ml-6">
                    {credit.status === 'Certified' && !credit.isSold ? (
                      <div className="text-sm text-green-600 font-medium">
                        Available for Sale
                      </div>
                    ) : credit.isSold ? (
                      <div className="text-sm text-blue-600 font-medium">
                        Sold on {new Date(credit.soldAt).toLocaleDateString()}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        {credit.status}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Producer;