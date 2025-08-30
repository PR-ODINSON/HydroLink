import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase,
  TrendingUp,
  DollarSign,
  Package,
  Leaf,
  Recycle,
  Star,
  Eye,
  Filter,
  Search
} from 'lucide-react';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState({});
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHolding, setSelectedHolding] = useState(null);

  useEffect(() => {
    // Mock portfolio data
    setPortfolio({
      totalValue: 245680,
      totalCredits: 3250,
      totalRetired: 1420,
      co2Offset: 1845,
      performance: { monthlyChange: 8.5 }
    });

    setHoldings([
      {
        _id: '1',
        creditId: 'HC-2025-001-ABC123',
        producer: { name: 'SolarMax Energy', rating: 4.8, location: 'California, USA' },
        energySource: 'Solar',
        energyAmountMWh: 150.5,
        purchaseDate: '2025-01-15',
        purchasePrice: 45.50,
        currentPrice: 47.25,
        totalPaid: 6847.75,
        currentValue: 7110.38,
        co2Offset: 85.2,
        status: 'Active',
        performanceChange: 3.8
      },
      {
        _id: '2',
        creditId: 'HC-2025-002-DEF456',
        producer: { name: 'WindPower Corp', rating: 4.6, location: 'Texas, USA' },
        energySource: 'Wind',
        energyAmountMWh: 200.0,
        purchaseDate: '2025-01-12',
        purchasePrice: 42.25,
        currentPrice: 43.10,
        totalPaid: 8450.00,
        currentValue: 8620.00,
        co2Offset: 113.0,
        status: 'Active',
        performanceChange: 2.0
      }
    ]);
    setLoading(false);
  }, []);

  const getSourceIcon = (source) => {
    switch (source) {
      case 'Solar': return '☀️';
      case 'Wind': return '💨';
      case 'Hydro': return '💧';
      case 'Nuclear': return '⚛️';
      default: return '⚡';
    }
  };

  const getPerformanceColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const filteredHoldings = holdings.filter(holding => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && holding.status === 'Active') ||
      holding.energySource.toLowerCase() === filter.toLowerCase();
    
    const matchesSearch = 
      holding.creditId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holding.producer.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

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
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Portfolio</h1>
        <p className="text-gray-600">Track your carbon credit investments and environmental impact.</p>
      </motion.div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Portfolio Value</h3>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${portfolio.totalValue?.toLocaleString()}</p>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+{portfolio.performance?.monthlyChange}% this month</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Credits</h3>
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{portfolio.totalCredits?.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Active: {portfolio.totalCredits - portfolio.totalRetired}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Credits Retired</h3>
            <Recycle className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{portfolio.totalRetired?.toLocaleString()}</p>
          <p className="text-xs text-gray-500">For sustainability goals</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">CO₂ Offset</h3>
            <Leaf className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{portfolio.co2Offset?.toLocaleString()} tons</p>
          <p className="text-xs text-gray-500">Environmental impact</p>
        </div>
      </div>

      {/* Holdings Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <h3 className="text-lg font-semibold text-gray-900">Credit Holdings</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Holdings</option>
                  <option value="active">Active</option>
                  <option value="solar">Solar</option>
                  <option value="wind">Wind</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search holdings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHoldings.map((holding, index) => (
                <motion.tr
                  key={holding._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{getSourceIcon(holding.energySource)}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{holding.creditId}</div>
                        <div className="text-sm text-gray-500">{holding.energySource}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{holding.producer.name}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                        {holding.producer.rating}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {holding.energyAmountMWh} MWh
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${holding.totalPaid.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${holding.currentValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center ${getPerformanceColor(holding.performanceChange)}`}>
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">
                        +{holding.performanceChange}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {holding.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => setSelectedHolding(holding)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-purple-600 hover:text-purple-900">
                      Retire
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Holding Detail Modal */}
      {selectedHolding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Holding Details</h2>
                <button
                  onClick={() => setSelectedHolding(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Investment Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Credit ID</label>
                      <p className="text-lg font-semibold">{selectedHolding.creditId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Energy Source</label>
                      <p>{selectedHolding.energySource}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Purchase Price</label>
                      <p>${selectedHolding.totalPaid.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Current Value</label>
                      <p>${selectedHolding.currentValue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Environmental Impact</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">CO₂ Offset</label>
                      <p>{selectedHolding.co2Offset} tons</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Producer</label>
                      <p>{selectedHolding.producer.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <p>{selectedHolding.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setSelectedHolding(null)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Recycle className="w-5 h-5 mr-2" />
                  Retire Credit
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
