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
      if (!user) {
        console.log('❌ PRODUCER: No user found, skipping fetch');
        return;
      }

      try {
        setLoading(true);
        console.log(`🔔 PRODUCER: Fetching data for producer ${user.name} (${user._id})`);

        // Fetch producer credits
        const creditsResponse = await fetch('/api/producer/credits', {
          credentials: 'include'
        });
        if (creditsResponse.ok) {
          const creditsData = await creditsResponse.json();
          console.log(`📊 PRODUCER: Found ${creditsData.data?.length || 0} credits`);
          setCredits(creditsData.data || []);
        }

        // Fetch notifications and filter purchase requests
        console.log('🛒 PRODUCER: Fetching notifications for purchase requests...');
        
        try {
          const notificationsResponse = await fetch('/api/producer/notifications', {
            credentials: 'include'
          });
          console.log('🛒 PRODUCER: Notifications API call made, status:', notificationsResponse.status);
          
          if (notificationsResponse.ok) {
            const notificationsData = await notificationsResponse.json();
            console.log(`🛒 PRODUCER: Found ${notificationsData.data?.length || 0} notifications`);
            console.log('🛒 PRODUCER: All notifications:', notificationsData.data);
            
            // Filter purchase request notifications
            const purchaseRequestNotifications = notificationsData.data?.filter(notification => 
              notification.type === 'purchase_requested'
            ) || [];
            
            console.log(`🛒 PRODUCER: Found ${purchaseRequestNotifications.length} purchase request notifications`);
            console.log('🛒 PRODUCER: Purchase request notifications:', purchaseRequestNotifications);
            setPurchaseRequests(purchaseRequestNotifications);
          } else {
            console.error('❌ PRODUCER: Failed to fetch notifications, status:', notificationsResponse.status);
            const errorData = await notificationsResponse.json();
            console.error('❌ PRODUCER: Error details:', errorData);
          }
        } catch (error) {
          console.error('❌ PRODUCER: Error fetching notifications:', error);
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
      {console.log('🛒 PRODUCER: Rendering purchase requests section, count:', purchaseRequests.length)}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-orange-600" />
            Recent Purchase Requests ({purchaseRequests.length})
          </h3>
        </div>
        
        {purchaseRequests.length > 0 ? (
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
                      {request.title}
                    </h4>
                    <p className="text-gray-600 mb-3">
                      {request.message}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {request.metadata?.buyerName || 'Unknown Buyer'}
                      </div>
                      <div className="flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        {request.metadata?.energyAmount || 'N/A'} MWh
                      </div>
                      <div className="flex items-center">
                        <Factory className="w-4 h-4 mr-2" />
                        {request.metadata?.facilityName || 'N/A'}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Energy Source:</span> {request.metadata?.energySource || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="ml-6 flex space-x-3">
                    <button
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      onClick={async () => {
                        try {
                          // Mark notification as read and remove from list
                          await fetch(`/api/producer/notifications/${request._id}/read`, {
                            method: 'POST',
                            credentials: 'include'
                          });
                          
                          setPurchaseRequests(prev => prev.filter(r => r._id !== request._id));
                          alert('❌ Purchase request declined. The buyer has been notified.');
                        } catch (error) {
                          console.error('Error declining request:', error);
                          alert('Failed to decline request');
                        }
                      }}
                    >
                      Don't Sell
                    </button>
                    <button
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      onClick={async () => {
                        console.log(`✅ PRODUCER: Selling credit for notification ${request._id}`);
                        try {
                          // Use the transaction ID from metadata to accept the sale
                          const transactionId = request.metadata?.transactionId;
                          if (!transactionId) {
                            alert('Error: Transaction ID not found');
                            return;
                          }

                          const response = await fetch(`/api/producer/sales/${transactionId}/accept`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include'
                          });

                          if (response.ok) {
                            console.log('✅ PRODUCER: Credit sold successfully!');
                            setPurchaseRequests(prev => prev.filter(r => r._id !== request._id));
                            alert('✅ Credit sold! The buyer has been notified and the credit has been transferred to their account.');
                            // Refresh credits to show updated sold status
                            window.location.reload();
                          } else {
                            const errorData = await response.json();
                            console.error('❌ PRODUCER: Failed to sell credit:', errorData);
                            alert('Failed to sell credit: ' + errorData.message);
                          }
                        } catch (error) {
                          console.error('❌ PRODUCER: Error selling credit:', error);
                          alert('Failed to sell credit');
                        }
                      }}
                    >
                      Sell
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No purchase requests yet</p>
            <p className="text-sm">Buyer requests will appear here</p>
          </div>
        )}
      </motion.div>

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