import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield,
  AlertTriangle,
  Eye,
  Brain,
  TrendingUp,
  Search,
  Filter,
  MapPin,
  Calendar,
  Flag,
  CheckCircle,
  XCircle,
  Activity,
  Bell
} from 'lucide-react';

const FraudDetection = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    // Mock data for demo
    setAlerts([
      {
        _id: '1',
        alertId: 'FD-2025-001',
        type: 'Suspicious Production Pattern',
        severity: 'high',
        status: 'active',
        producer: { name: 'EcoFake Industries', email: 'suspicious@ecofake.com' },
        creditId: 'HC-2025-045-SUS123',
        anomalyScore: 0.89,
        detectedAt: '2025-01-15T14:30:00Z',
        description: 'Unusually high production claimed for facility size',
        indicators: [
          'Production 400% above facility capacity',
          'No weather correlation for solar production',
          'Identical timestamps across multiple submissions'
        ],
        riskFactors: {
          dataInconsistency: 95,
          patternMatching: 78,
          documentAuthenticity: 85
        },
        facilityLocation: 'Remote Area, Nevada',
        energyAmountMWh: 500.0
      },
      {
        _id: '2',
        alertId: 'FD-2025-002',
        type: 'Document Manipulation',
        severity: 'medium',
        status: 'investigating',
        producer: { name: 'QuestionablePower Corp', email: 'info@questionable.com' },
        creditId: 'HC-2025-038-DOC456',
        anomalyScore: 0.72,
        detectedAt: '2025-01-14T09:15:00Z',
        description: 'Potential document tampering detected in proof submissions',
        indicators: [
          'Metadata inconsistencies in PDF files',
          'Digital signature anomalies',
          'Repeated use of template documents'
        ],
        riskFactors: {
          dataInconsistency: 65,
          patternMatching: 80,
          documentAuthenticity: 90
        },
        facilityLocation: 'Austin, TX',
        energyAmountMWh: 180.5
      }
    ]);
    setLoading(false);
  }, []);

  const handleUpdateStatus = (alertId, newStatus) => {
    setAlerts(alerts.map(alert => 
      alert._id === alertId 
        ? { ...alert, status: newStatus }
        : alert
    ));
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Critical
          </span>
        );
      case 'high':
        return (
          <span className="flex items-center px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
            <Flag className="w-3 h-3 mr-1" />
            High
          </span>
        );
      case 'medium':
        return (
          <span className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            <Eye className="w-3 h-3 mr-1" />
            Medium
          </span>
        );
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{severity}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            <Bell className="w-3 h-3 mr-1" />
            Active
          </span>
        );
      case 'investigating':
        return (
          <span className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            <Eye className="w-3 h-3 mr-1" />
            Investigating
          </span>
        );
      case 'resolved':
        return (
          <span className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3 mr-1" />
            Resolved
          </span>
        );
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'border-l-red-600 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getAnomalyScoreColor = (score) => {
    if (score >= 0.8) return 'text-red-600';
    if (score >= 0.6) return 'text-orange-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-green-600';
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === 'all' || alert.severity === filter || alert.status === filter;
    const matchesSearch = 
      alert.alertId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.producer.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    high: alerts.filter(a => a.severity === 'high').length,
    active: alerts.filter(a => a.status === 'active').length
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Fraud Detection</h1>
        <p className="text-gray-600">Advanced anomaly detection and fraud prevention system.</p>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-sm border border-purple-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-purple-700">AI System Accuracy</h3>
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-900">92.4%</p>
          <p className="text-xs text-purple-600">Detection rate</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Alerts</h3>
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">This month</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">High Priority</h3>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.high}</p>
          <p className="text-xs text-gray-500">Requires attention</p>
        </div>

        <div className="bg-green-50 rounded-2xl shadow-sm border border-green-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-green-700">Fraud Prevented</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">$2.3M</p>
          <p className="text-xs text-green-600">Estimated value</p>
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
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Alerts</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="active">Active</option>
                <option value="investigating">Investigating</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent w-64"
            />
          </div>
        </div>
      </div>

      {/* Fraud Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert, index) => (
          <motion.div
            key={alert._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-2xl shadow-sm border-l-4 ${getSeverityColor(alert.severity)} p-6 hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{alert.alertId}</h3>
                    <p className="text-sm text-gray-600">{alert.type}</p>
                  </div>
                  {getSeverityBadge(alert.severity)}
                  {getStatusBadge(alert.status)}
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 text-purple-600 mr-1" />
                    <span className={`text-sm font-medium ${getAnomalyScoreColor(alert.anomalyScore)}`}>
                      {(alert.anomalyScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Producer</p>
                    <p className="text-sm font-medium">{alert.producer.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Credit ID</p>
                    <p className="text-sm font-medium">{alert.creditId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Energy Claimed</p>
                    <p className="text-sm font-medium">{alert.energyAmountMWh} MWh</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Detected</p>
                    <p className="text-sm font-medium">{new Date(alert.detectedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{alert.description}</p>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{alert.facilityLocation}</span>
                  <Calendar className="w-4 h-4 ml-4 mr-2" />
                  <span>Detected {new Date(alert.detectedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                <button 
                  onClick={() => setSelectedAlert(alert)}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Investigate
                </button>
                
                {alert.status === 'active' && (
                  <button 
                    onClick={() => handleUpdateStatus(alert._id, 'investigating')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Start Investigation
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Fraud Alert Investigation</h2>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Alert Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Alert ID</label>
                      <p className="text-lg font-semibold">{selectedAlert.alertId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Type</label>
                      <p>{selectedAlert.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Severity</label>
                      <div className="mt-1">{getSeverityBadge(selectedAlert.severity)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Anomaly Score</label>
                      <p className={`text-lg font-bold ${getAnomalyScoreColor(selectedAlert.anomalyScore)}`}>
                        {(selectedAlert.anomalyScore * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Producer Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Company</label>
                      <p>{selectedAlert.producer.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p>{selectedAlert.producer.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Credit ID</label>
                      <p>{selectedAlert.creditId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Energy Claimed</label>
                      <p>{selectedAlert.energyAmountMWh} MWh</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">AI Analysis Indicators</h3>
                <div className="bg-red-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {selectedAlert.indicators.map((indicator, index) => (
                      <li key={index} className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                        <span className="text-sm text-red-800">{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleUpdateStatus(selectedAlert._id, 'resolved');
                    setSelectedAlert(null);
                  }}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Flag className="w-5 h-5 mr-2" />
                  Escalate to Authorities
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FraudDetection;
