import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Plus, 
  Filter, 
  Search, 
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Download,
  Zap,
  TrendingUp,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Credits = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        setLoading(true);
        let endpoint = '';
        
        // Determine endpoint based on user role
        switch (user?.role?.toLowerCase()) {
          case 'producer':
            endpoint = '/api/producer/credits';
            break;
          case 'certifier':
            endpoint = '/api/certifier/credits/pending';
            break;
          case 'buyer':
            endpoint = '/api/buyer/credits/marketplace';
            break;
          default:
            endpoint = '/api/buyer/credits/marketplace'; // Default to marketplace view
        }

        const response = await fetch(endpoint, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch credits');
        }

        const data = await response.json();
        
        if (data.success) {
          setCredits(data.data || []);
        } else {
          throw new Error(data.message || 'Failed to fetch credits');
        }
      } catch (err) {
        console.error('Error fetching credits:', err);
        setError(err.message);
        // Keep credits as empty array on error
        setCredits([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCredits();
    }
  }, [user]);

  // Filter credits based on search term and status
  const filteredCredits = credits.filter(credit => {
    const matchesSearch = credit.creditId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credit.facilityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credit.energySource?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || credit.status?.toLowerCase() === filter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'certified':
        return { icon: CheckCircle, color: 'text-green-600 bg-green-100' };
      case 'pending':
        return { icon: Clock, color: 'text-yellow-600 bg-yellow-100' };
      case 'rejected':
        return { icon: XCircle, color: 'text-red-600 bg-red-100' };
      case 'retired':
        return { icon: CheckCircle, color: 'text-gray-600 bg-gray-100' };
      default:
        return { icon: Clock, color: 'text-gray-600 bg-gray-100' };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle credit request (for producers)
  const handleRequestCredit = () => {
    setShowRequestModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading credits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <CreditCard className="text-green-600" />
              {user?.role === 'Producer' ? 'My Credits' : 
               user?.role === 'Certifier' ? 'Credits to Certify' : 
               'Credit Marketplace'}
            </h1>
            <p className="text-gray-600 mt-1">
              {user?.role === 'Producer' ? 'Manage your green hydrogen production credits' :
               user?.role === 'Certifier' ? 'Review and certify pending credits' :
               'Browse and purchase verified green energy credits'}
            </p>
          </div>
          
          {user?.role === 'Producer' && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleRequestCredit}
              className="mt-4 sm:mt-0 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Request Credit
            </motion.button>
          )}
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="text-red-900 font-semibold">Error Loading Credits</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search credits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-500 w-5 h-5" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="certified">Certified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="retired">Retired</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Credits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCredits.length === 0 ? (
            <div className="col-span-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center bg-white rounded-2xl shadow-xl border border-gray-200 p-12"
              >
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Credits Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filter !== 'all' 
                    ? 'No credits match your current filters.' 
                    : 'You don\'t have any credits yet.'}
                </p>
                {user?.role === 'Producer' && !searchTerm && filter === 'all' && (
                  <button
                    onClick={handleRequestCredit}
                    className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
                  >
                    Request Your First Credit
                  </button>
                )}
              </motion.div>
            </div>
          ) : (
            filteredCredits.map((credit, index) => {
              const statusInfo = getStatusInfo(credit.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <motion.div
                  key={credit._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 truncate">{credit.creditId}</h3>
                      <p className="text-sm text-gray-600 mt-1">{credit.facilityName}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {credit.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Energy</span>
                      <span className="font-medium">{credit.energyAmountMWh} MWh</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Source</span>
                      <span className="font-medium">{credit.energySource}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Production Date</span>
                      <span className="font-medium">{formatDate(credit.productionDate)}</span>
                    </div>
                    
                    {credit.environmentalImpact?.co2Avoided && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">CO₂ Avoided</span>
                        <span className="font-medium text-green-600">
                          {credit.environmentalImpact.co2Avoided.toFixed(1)} tons
                        </span>
                      </div>
                    )}
                    
                    {credit.pricing?.currentMarketPrice && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Price</span>
                        <span className="font-medium text-blue-600">
                          ${credit.pricing.currentMarketPrice.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex gap-2">
                    <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    
                    {user?.role === 'Buyer' && credit.status === 'Certified' && (
                      <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Purchase
                      </button>
                    )}
                    
                    {user?.role === 'Certifier' && credit.status === 'Pending' && (
                      <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Certify
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Credits;