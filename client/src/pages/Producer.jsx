import React, { useState } from 'react';
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
  Star
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';

const Producer = () => {
  const [showMintModal, setShowMintModal] = useState(false);
  const [mintForm, setMintForm] = useState({
    amount: '',
    productionDate: '',
    facility: '',
    source: 'solar',
    location: ''
  });

  // Sample data for producer's credits
  const producerCredits = [
    {
      id: 'HC-2024-001',
      amount: 1250,
      status: 'verified',
      productionDate: '2024-01-15',
      facility: 'Solar H2 Plant A',
      location: 'California, USA',
      verifiedBy: 'GreenCert Authority',
      createdAt: '2024-01-16'
    },
    {
      id: 'HC-2024-002',
      amount: 800,
      status: 'pending',
      productionDate: '2024-01-20',
      facility: 'Solar H2 Plant B',
      location: 'Texas, USA',
      verifiedBy: null,
      createdAt: '2024-01-21'
    },
    {
      id: 'HC-2024-003',
      amount: 2100,
      status: 'verified',
      productionDate: '2024-01-25',
      facility: 'Wind H2 Plant A',
      location: 'Iowa, USA',
      verifiedBy: 'EcoVerify Corp',
      createdAt: '2024-01-26'
    },
    {
      id: 'HC-2024-004',
      amount: 950,
      status: 'rejected',
      productionDate: '2024-01-30',
      facility: 'Solar H2 Plant A',
      location: 'California, USA',
      verifiedBy: 'GreenCert Authority',
      createdAt: '2024-01-31'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMintSubmit = (e) => {
    e.preventDefault();
    console.log('Minting credits:', mintForm);
    setShowMintModal(false);
    setMintForm({
      amount: '',
      productionDate: '',
      facility: '',
      source: 'solar',
      location: ''
    });
  };

  const totalCredits = producerCredits.reduce((sum, credit) => sum + credit.amount, 0);
  const verifiedCredits = producerCredits.filter(c => c.status === 'verified').reduce((sum, credit) => sum + credit.amount, 0);
  const pendingCredits = producerCredits.filter(c => c.status === 'pending').reduce((sum, credit) => sum + credit.amount, 0);

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
            Producer Portal
          </motion.h1>
          <p className="text-gray-600">
            Manage your green hydrogen credit production and tracking.
          </p>
        </div>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowMintModal(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center group shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
          Mint New Credit
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DashboardCard
            title="Total Credits Minted"
            value={totalCredits.toLocaleString()}
            icon={Factory}
            trend="up"
            trendValue="+18.2%"
            color="green"
            subtitle="All time"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DashboardCard
            title="Verified Credits"
            value={verifiedCredits.toLocaleString()}
            icon={CheckCircle}
            trend="up"
            trendValue="+12.5%"
            color="blue"
            subtitle="Ready for trading"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DashboardCard
            title="Pending Verification"
            value={pendingCredits.toLocaleString()}
            icon={Clock}
            color="orange"
            subtitle="Awaiting approval"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DashboardCard
            title="Leaderboard Rank"
            value="#7"
            icon={Trophy}
            trend="up"
            trendValue="+3 positions"
            color="purple"
            subtitle="This month"
          />
        </motion.div>
      </div>

      {/* Producer Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Gold Producer Badge</h3>
              <p className="text-green-100">Top 10% performer this quarter</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-6 h-6 text-yellow-300 fill-current" />
            <Star className="w-6 h-6 text-yellow-300 fill-current" />
            <Star className="w-6 h-6 text-yellow-300 fill-current" />
            <Star className="w-6 h-6 text-yellow-300 fill-current" />
            <Star className="w-6 h-6 text-white/50" />
          </div>
        </div>
      </motion.div>

      {/* Credits Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Credit History</h3>
          <p className="text-gray-600 mt-1">Track all your minted hydrogen credits</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Facility
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Production Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verified By
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {producerCredits.map((credit, index) => (
                <tr key={credit.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-900">{credit.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-900">{credit.amount.toLocaleString()} MWh</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(credit.status)}
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(credit.status)}`}>
                        {credit.status.charAt(0).toUpperCase() + credit.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{credit.facility}</div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {credit.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(credit.productionDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {credit.verifiedBy || 'Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Mint Modal */}
      {showMintModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Mint New Credit</h3>
              <button
                onClick={() => setShowMintModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <AlertCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleMintSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credit Amount (MWh)
                </label>
                <input
                  type="number"
                  value={mintForm.amount}
                  onChange={(e) => setMintForm({...mintForm, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter amount"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Production Date
                </label>
                <input
                  type="date"
                  value={mintForm.productionDate}
                  onChange={(e) => setMintForm({...mintForm, productionDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facility Name
                </label>
                <input
                  type="text"
                  value={mintForm.facility}
                  onChange={(e) => setMintForm({...mintForm, facility: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter facility name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Energy Source
                </label>
                <select
                  value={mintForm.source}
                  onChange={(e) => setMintForm({...mintForm, source: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="solar">Solar</option>
                  <option value="wind">Wind</option>
                  <option value="hydro">Hydro</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={mintForm.location}
                  onChange={(e) => setMintForm({...mintForm, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter location"
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowMintModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
                >
                  Mint Credit
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Producer;
