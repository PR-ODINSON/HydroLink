import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  FileText, 
  MapPin, 
  Calendar, 
  AlertTriangle,
  Filter,
  Search
} from 'lucide-react';

const Verification = () => {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [verificationNotes, setVerificationNotes] = useState('');

  useEffect(() => {
    // Mock data for demo
    setCredits([
      {
        _id: '1',
        creditId: 'HC-2025-001-ABC123',
        producer: { name: 'GreenTech Industries' },
        productionDate: '2025-01-15',
        energyAmountMWh: 150.5,
        energySource: 'Solar',
        facilityName: 'Solar Plant Alpha',
        facilityLocation: 'San Francisco, CA',
        status: 'Pending',
        createdAt: '2025-01-15T10:00:00Z',
        environmentalImpact: { co2Avoided: 85.2 },
        priority: 'high'
      },
      {
        _id: '2',
        creditId: 'HC-2025-002-DEF456',
        producer: { name: 'WindPower Corp' },
        productionDate: '2025-01-10',
        energyAmountMWh: 200.0,
        energySource: 'Wind',
        facilityName: 'Wind Farm Beta',
        facilityLocation: 'Austin, TX',
        status: 'Under Review',
        createdAt: '2025-01-10T14:30:00Z',
        environmentalImpact: { co2Avoided: 113.0 },
        priority: 'medium'
      }
    ]);
    setLoading(false);
  }, []);

  const handleApprove = (creditId) => {
    setCredits(credits.map(credit => 
      credit._id === creditId 
        ? { ...credit, status: 'Certified' }
        : credit
    ));
    setSelectedCredit(null);
    setVerificationNotes('');
  };

  const handleReject = (creditId) => {
    setCredits(credits.map(credit => 
      credit._id === creditId 
        ? { ...credit, status: 'Rejected' }
        : credit
    ));
    setSelectedCredit(null);
    setVerificationNotes('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'Under Review':
        return (
          <span className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            <Eye className="w-3 h-3 mr-1" />
            Under Review
          </span>
        );
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const filteredCredits = credits.filter(credit => {
    const matchesFilter = filter === 'all' || credit.status.toLowerCase().replace(' ', '_') === filter.toLowerCase();
    const matchesSearch = 
      credit.creditId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credit.producer.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: credits.length,
    pending: credits.filter(c => c.status === 'Pending').length,
    underReview: credits.filter(c => c.status === 'Under Review').length,
    overdue: 0
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
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Credit Verification</h1>
        <p className="text-gray-600">Review and verify hydrogen credit submissions from producers.</p>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Submissions</h3>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Pending Review</h3>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Under Review</h3>
            <Eye className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.underReview}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Overdue</h3>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="certified">Certified</option>
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
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
        </div>
      </div>

      {/* Credits List */}
      <div className="space-y-4">
        {filteredCredits.map((credit, index) => (
          <motion.div
            key={credit._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-2xl shadow-sm border-l-4 ${getPriorityColor(credit.priority)} p-6 hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{credit.creditId}</h3>
                    <p className="text-sm text-gray-600">{credit.producer.name}</p>
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
                    <p className="text-xs text-gray-500">Facility</p>
                    <p className="text-sm font-medium">{credit.facilityName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">CO₂ Avoided</p>
                    <p className="text-sm font-medium">{credit.environmentalImpact.co2Avoided} tons</p>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{credit.facilityLocation}</span>
                  <Calendar className="w-4 h-4 ml-4 mr-2" />
                  <span>Submitted {new Date(credit.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <button 
                  onClick={() => setSelectedCredit(credit)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Review
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Verification Modal */}
      {selectedCredit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Verify Credit</h2>
                <button
                  onClick={() => setSelectedCredit(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Credit Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Credit ID</label>
                      <p className="text-lg font-semibold">{selectedCredit.creditId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Producer</label>
                      <p>{selectedCredit.producer.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Energy Amount</label>
                      <p>{selectedCredit.energyAmountMWh} MWh</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Energy Source</label>
                      <p>{selectedCredit.energySource}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Facility Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Facility Name</label>
                      <p>{selectedCredit.facilityName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p>{selectedCredit.facilityLocation}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Production Date</label>
                      <p>{new Date(selectedCredit.productionDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Notes
                </label>
                <textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add verification notes or rejection reason..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleReject(selectedCredit._id)}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedCredit._id)}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Approve & Certify
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Verification;
