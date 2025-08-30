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
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Credits = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    // Mock data for demo
    setCredits([
      {
        _id: '1',
        creditId: 'HC-2025-001-ABC123',
        productionDate: '2025-01-15',
        energyAmountMWh: 150.5,
        energySource: 'Solar',
        facilityName: 'Solar Plant Alpha',
        facilityLocation: 'San Francisco, CA',
        status: 'Certified',
        certificationDate: '2025-01-20',
        createdAt: '2025-01-15',
        environmentalImpact: { co2Avoided: 85.2 },
        pricing: { currentMarketPrice: 45.50 }
      },
      {
        _id: '2',
        creditId: 'HC-2025-002-DEF456',
        productionDate: '2025-01-10',
        energyAmountMWh: 200.0,
        energySource: 'Wind',
        facilityName: 'Wind Farm Beta',
        facilityLocation: 'Austin, TX',
        status: 'Pending',
        createdAt: '2025-01-10',
        environmentalImpact: { co2Avoided: 113.0 },
        pricing: { currentMarketPrice: 42.00 }
      },
      {
        _id: '3',
        creditId: 'HC-2025-003-GHI789',
        productionDate: '2024-12-28',
        energyAmountMWh: 125.0,
        energySource: 'Solar',
        facilityName: 'Solar Plant Alpha',
        facilityLocation: 'San Francisco, CA',
        status: 'Rejected',
        createdAt: '2024-12-28',
        certificationNotes: 'Insufficient documentation provided',
        environmentalImpact: { co2Avoided: 70.8 }
      }
    ]);
    setLoading(false);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Certified':
        return (
          <span className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3 mr-1" />
            Certified
          </span>
        );
      case 'Pending':
        return (
          <span className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'Rejected':
        return (
          <span className="flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'Solar': return '☀️';
      case 'Wind': return '💨';
      case 'Hydro': return '💧';
      case 'Nuclear': return '⚛️';
      default: return '⚡';
    }
  };

  const filteredCredits = credits.filter(credit => {
    const matchesFilter = filter === 'all' || credit.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = credit.creditId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credit.facilityName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: credits.length,
    certified: credits.filter(c => c.status === 'Certified').length,
    pending: credits.filter(c => c.status === 'Pending').length,
    totalEnergy: credits.reduce((sum, c) => sum + c.energyAmountMWh, 0),
    totalCO2Avoided: credits.reduce((sum, c) => sum + (c.environmentalImpact?.co2Avoided || 0), 0)
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-300 rounded-2xl"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Credits</h1>
          <p className="text-gray-600">View and manage your hydrogen credit portfolio.</p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Request Credit
        </button>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Credits</h3>
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Certified</h3>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.certified}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Pending</h3>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Energy</h3>
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalEnergy.toFixed(1)}</p>
          <p className="text-xs text-gray-500">MWh</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">CO₂ Avoided</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalCO2Avoided.toFixed(1)}</p>
          <p className="text-xs text-gray-500">tons</p>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="certified">Certified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search credits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
            />
          </div>
        </div>
      </motion.div>

      {/* Credits List */}
      <div className="space-y-4">
        {filteredCredits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200"
          >
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Credits Found</h3>
            <p className="text-gray-600 mb-6">
              {credits.length === 0 
                ? "Start by requesting your first hydrogen credit."
                : "Try adjusting your filters or search term."
              }
            </p>
          </motion.div>
        ) : (
          filteredCredits.map((credit, index) => (
            <motion.div
              key={credit._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-2xl">{getSourceIcon(credit.energySource)}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{credit.creditId}</h3>
                      <p className="text-sm text-gray-600">{credit.facilityName}</p>
                    </div>
                    {getStatusBadge(credit.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Production Date</p>
                      <p className="text-sm font-medium">{new Date(credit.productionDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Energy Amount</p>
                      <p className="text-sm font-medium">{credit.energyAmountMWh} MWh</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium">{credit.facilityLocation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">CO₂ Avoided</p>
                      <p className="text-sm font-medium">{credit.environmentalImpact?.co2Avoided?.toFixed(1) || 0} tons</p>
                    </div>
                  </div>

                  {credit.status === 'Certified' && credit.pricing?.currentMarketPrice && (
                    <div className="bg-green-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-800">Current Market Value</span>
                        <span className="font-semibold text-green-900">
                          ${(credit.energyAmountMWh * credit.pricing.currentMarketPrice).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {credit.status === 'Rejected' && credit.certificationNotes && (
                    <div className="bg-red-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-red-800">
                        <strong>Rejection Reason:</strong> {credit.certificationNotes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 ml-4">
                  <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  {credit.status === 'Certified' && (
                    <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Credits;
