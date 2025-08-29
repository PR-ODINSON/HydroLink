import React, { useState } from 'react';
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
  Zap,
  User,
  AlertTriangle,
  TrendingUp,
  Activity
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';

const Authority = () => {
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [filter, setFilter] = useState('all');

  // Sample data for pending credits
  const pendingCredits = [
    {
      id: 'HC-2024-005',
      producer: 'GreenTech Industries',
      amount: 1250,
      productionDate: '2024-02-01',
      facility: 'Solar H2 Plant Delta',
      location: 'Nevada, USA',
      source: 'Solar',
      submittedAt: '2024-02-02',
      priority: 'high',
      documentation: ['production_report.pdf', 'facility_cert.pdf', 'energy_source_proof.pdf'],
      status: 'pending'
    },
    {
      id: 'HC-2024-006',
      producer: 'WindPower Corp',
      amount: 800,
      productionDate: '2024-02-03',
      facility: 'Wind H2 Plant Alpha',
      location: 'Kansas, USA',
      source: 'Wind',
      submittedAt: '2024-02-04',
      priority: 'medium',
      documentation: ['production_log.pdf', 'wind_data.pdf'],
      status: 'pending'
    },
    {
      id: 'HC-2024-007',
      producer: 'HydroGen Solutions',
      amount: 2100,
      productionDate: '2024-02-05',
      facility: 'Hydro H2 Plant Beta',
      location: 'Oregon, USA',
      source: 'Hydro',
      submittedAt: '2024-02-06',
      priority: 'low',
      documentation: ['hydro_cert.pdf', 'production_metrics.pdf'],
      status: 'under_review'
    },
    {
      id: 'HC-2024-008',
      producer: 'SolarMax Energy',
      amount: 950,
      productionDate: '2024-02-07',
      facility: 'Solar H2 Plant Gamma',
      location: 'Arizona, USA',
      source: 'Solar',
      submittedAt: '2024-02-08',
      priority: 'high',
      documentation: ['solar_output.pdf', 'efficiency_report.pdf'],
      status: 'flagged'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'approved',
      creditId: 'HC-2024-001',
      producer: 'EcoEnergy Corp',
      amount: 1500,
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      action: 'rejected',
      creditId: 'HC-2024-002',
      producer: 'GreenHydro Ltd',
      amount: 750,
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      action: 'flagged',
      creditId: 'HC-2024-003',
      producer: 'CleanEnergy Inc',
      amount: 1200,
      timestamp: '6 hours ago'
    }
  ];

  const filteredCredits = filter === 'all' 
    ? pendingCredits 
    : pendingCredits.filter(credit => credit.status === filter);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'under_review': return <Eye className="w-4 h-4 text-blue-500" />;
      case 'flagged': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'flagged': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = (creditId) => {
    console.log('Approving credit:', creditId);
    // Handle approval logic
  };

  const handleReject = (creditId) => {
    console.log('Rejecting credit:', creditId);
    // Handle rejection logic
  };

  const totalPending = pendingCredits.length;
  const highPriority = pendingCredits.filter(c => c.priority === 'high').length;
  const flaggedCredits = pendingCredits.filter(c => c.status === 'flagged').length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          Authority Dashboard
        </motion.h1>
        <p className="text-gray-600">
          Review and certify green hydrogen credits from producers.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DashboardCard
            title="Pending Review"
            value={totalPending.toString()}
            icon={Clock}
            color="orange"
            subtitle="Awaiting certification"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DashboardCard
            title="High Priority"
            value={highPriority.toString()}
            icon={AlertTriangle}
            color="red"
            subtitle="Urgent reviews needed"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DashboardCard
            title="Flagged Credits"
            value={flaggedCredits.toString()}
            icon={Shield}
            color="purple"
            subtitle="Requires attention"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DashboardCard
            title="Approved Today"
            value="12"
            icon={CheckCircle}
            trend="up"
            trendValue="+8.3%"
            color="green"
            subtitle="Certified credits"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Credits Review Section */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Credits Awaiting Review</h3>
                <div className="flex space-x-2">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="flagged">Flagged</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredCredits.map((credit, index) => (
                <motion.div
                  key={credit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-medium text-gray-900">{credit.id}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(credit.priority)}`}>
                          {credit.priority} priority
                        </span>
                        <div className="flex items-center">
                          {getStatusIcon(credit.status)}
                          <span className={`ml-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(credit.status)}`}>
                            {credit.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          {credit.producer}
                        </div>
                        <div className="flex items-center">
                          <Zap className="w-4 h-4 mr-2" />
                          {credit.amount.toLocaleString()} MWh
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {credit.location}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(credit.productionDate).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 mb-4">
                        <FileText className="w-3 h-3 mr-1" />
                        {credit.documentation.length} documents attached
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedCredit(credit)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Review Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleApprove(credit.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReject(credit.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity Sidebar */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const getActivityColor = (action) => {
                  switch (action) {
                    case 'approved': return 'text-green-600 bg-green-100';
                    case 'rejected': return 'text-red-600 bg-red-100';
                    case 'flagged': return 'text-yellow-600 bg-yellow-100';
                    default: return 'text-gray-600 bg-gray-100';
                  }
                };

                const getActivityIcon = (action) => {
                  switch (action) {
                    case 'approved': return <CheckCircle className="w-4 h-4" />;
                    case 'rejected': return <XCircle className="w-4 h-4" />;
                    case 'flagged': return <AlertTriangle className="w-4 h-4" />;
                    default: return <Activity className="w-4 h-4" />;
                  }
                };

                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getActivityColor(activity.action)}`}>
                      {getActivityIcon(activity.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}</span> {activity.creditId}
                      </p>
                      <p className="text-xs text-gray-500">{activity.producer}</p>
                      <p className="text-xs text-gray-400">{activity.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-900">This Week</h3>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-700">Reviews Completed</span>
                <span className="font-semibold text-blue-900">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Avg Review Time</span>
                <span className="font-semibold text-blue-900">2.3 hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Approval Rate</span>
                <span className="font-semibold text-blue-900">94%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Credit Detail Modal */}
      {selectedCredit && (
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
              <h3 className="text-xl font-semibold text-gray-900">Credit Details</h3>
              <button
                onClick={() => setSelectedCredit(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Credit ID</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCredit.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Producer</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCredit.producer}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCredit.amount.toLocaleString()} MWh</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Energy Source</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCredit.source}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Facility</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCredit.facility}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCredit.location}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Documentation</label>
                <div className="space-y-2">
                  {selectedCredit.documentation.map((doc, index) => (
                    <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                      <FileText className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => handleReject(selectedCredit.id)}
                  className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedCredit.id)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
                >
                  Approve
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Authority;
