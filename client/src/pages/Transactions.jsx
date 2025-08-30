import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight,
  Recycle,
  ShoppingCart,
  Filter,
  Search,
  Download,
  Eye,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    // Mock transaction data
    setTransactions([
      {
        _id: '1',
        transactionId: 'TXN-2025-001',
        type: 'Purchase',
        creditId: 'HC-2025-001-ABC123',
        amount: 150.5,
        pricePerCredit: 45.50,
        totalValue: 6847.75,
        status: 'Completed',
        date: '2025-01-15T10:30:00Z',
        producer: { name: 'SolarMax Energy' },
        energySource: 'Solar',
        co2Impact: 85.2,
        fee: 34.24
      },
      {
        _id: '2',
        transactionId: 'TXN-2025-002',
        type: 'Retirement',
        creditId: 'HC-2025-003-GHI789',
        amount: 125.0,
        totalValue: 0,
        status: 'Completed',
        date: '2025-01-20T09:15:00Z',
        producer: { name: 'HydroGen Solutions' },
        energySource: 'Hydro',
        co2Impact: 70.8,
        retirementReason: 'Q4 2024 carbon offset goal'
      }
    ]);
    setLoading(false);
  }, []);

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'Purchase': return <ShoppingCart className="w-5 h-5 text-blue-600" />;
      case 'Transfer': return <ArrowUpRight className="w-5 h-5 text-orange-600" />;
      case 'Retirement': return <Recycle className="w-5 h-5 text-green-600" />;
      default: return <ArrowUpRight className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case 'Pending':
        return (
          <span className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3 mr-1" />
            Pending
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

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type.toLowerCase() === filter.toLowerCase();
    const matchesSearch = 
      transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.creditId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    totalTransactions: transactions.length,
    totalValue: transactions.reduce((sum, t) => sum + t.totalValue, 0),
    totalCredits: transactions.reduce((sum, t) => sum + t.amount, 0),
    totalCO2: transactions.reduce((sum, t) => sum + t.co2Impact, 0)
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-300 rounded-2xl"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction History</h1>
          <p className="text-gray-600">Complete record of your credit purchases, transfers, and retirements.</p>
        </div>
        <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Transactions</h3>
            <ArrowUpRight className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Value</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Credits Traded</h3>
            <ShoppingCart className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalCredits.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">CO₂ Impact</h3>
            <Recycle className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalCO2.toFixed(1)} tons</p>
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
                <option value="all">All Types</option>
                <option value="purchase">Purchases</option>
                <option value="retirement">Retirements</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction, index) => (
                <motion.tr
                  key={transaction._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="mr-3">{getTransactionIcon(transaction.type)}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transaction.transactionId}</div>
                        <div className="text-sm text-gray-500">{transaction.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-lg mr-2">{getSourceIcon(transaction.energySource)}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transaction.creditId}</div>
                        <div className="text-sm text-gray-500">{transaction.producer.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.amount} MWh
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.type === 'Retirement' ? 'N/A' : `$${transaction.totalValue.toLocaleString()}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => setSelectedTransaction(transaction)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Transaction Details</h2>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Transaction Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                      <p className="text-lg font-semibold">{selectedTransaction.transactionId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Type</label>
                      <p>{selectedTransaction.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div className="mt-1">{getStatusBadge(selectedTransaction.status)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date</label>
                      <p>{new Date(selectedTransaction.date).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Credit Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Credit ID</label>
                      <p>{selectedTransaction.creditId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Amount</label>
                      <p>{selectedTransaction.amount} MWh</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">CO₂ Impact</label>
                      <p>{selectedTransaction.co2Impact} tons offset</p>
                    </div>
                    {selectedTransaction.totalValue > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Total Value</label>
                        <p>${selectedTransaction.totalValue.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
