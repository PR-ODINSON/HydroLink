import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Award, 
  TrendingDown, 
  Leaf, 
  Calendar, 
  MapPin, 
  Zap,
  User,
  DollarSign,
  ArrowRight,
  CheckCircle,
  Filter,
  Search
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import Chart from '../components/Chart';

const Buyer = () => {
  const [selectedCredits, setSelectedCredits] = useState([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data for available credits
  const availableCredits = [
    {
      id: 'HC-2024-009',
      producer: 'GreenTech Industries',
      amount: 1250,
      price: 45.50,
      pricePerMWh: 45.50,
      productionDate: '2024-02-01',
      facility: 'Solar H2 Plant Delta',
      location: 'Nevada, USA',
      source: 'Solar',
      certification: 'Gold Standard',
      co2Reduction: 2.8,
      available: true
    },
    {
      id: 'HC-2024-010',
      producer: 'WindPower Corp',
      amount: 800,
      price: 42.00,
      pricePerMWh: 42.00,
      productionDate: '2024-02-03',
      facility: 'Wind H2 Plant Alpha',
      location: 'Kansas, USA',
      source: 'Wind',
      certification: 'Verified',
      co2Reduction: 1.9,
      available: true
    },
    {
      id: 'HC-2024-011',
      producer: 'HydroGen Solutions',
      amount: 2100,
      price: 48.75,
      pricePerMWh: 48.75,
      productionDate: '2024-02-05',
      facility: 'Hydro H2 Plant Beta',
      location: 'Oregon, USA',
      source: 'Hydro',
      certification: 'Premium',
      co2Reduction: 4.2,
      available: true
    },
    {
      id: 'HC-2024-012',
      producer: 'SolarMax Energy',
      amount: 950,
      price: 44.25,
      pricePerMWh: 44.25,
      productionDate: '2024-02-07',
      facility: 'Solar H2 Plant Gamma',
      location: 'Arizona, USA',
      source: 'Solar',
      certification: 'Gold Standard',
      co2Reduction: 2.3,
      available: true
    }
  ];

  // Sample data for carbon offset history
  const carbonOffsetData = [
    { name: 'Jan', value: 15.2 },
    { name: 'Feb', value: 23.8 },
    { name: 'Mar', value: 31.5 },
    { name: 'Apr', value: 28.7 },
    { name: 'May', value: 42.1 },
    { name: 'Jun', value: 38.9 },
    { name: 'Jul', value: 55.3 }
  ];

  const retiredCredits = [
    {
      id: 'HC-2024-001',
      amount: 500,
      retiredDate: '2024-01-15',
      co2Reduction: 1.2,
      purpose: 'Corporate Sustainability Goal'
    },
    {
      id: 'HC-2024-003',
      amount: 750,
      retiredDate: '2024-01-28',
      co2Reduction: 1.8,
      purpose: 'Carbon Neutral Initiative'
    }
  ];

  const filteredCredits = availableCredits.filter(credit => {
    const matchesFilter = filter === 'all' || credit.source.toLowerCase() === filter.toLowerCase();
    const matchesSearch = credit.producer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credit.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleCreditSelection = (creditId) => {
    setSelectedCredits(prev => 
      prev.includes(creditId) 
        ? prev.filter(id => id !== creditId)
        : [...prev, creditId]
    );
  };

  const getTotalSelectedValue = () => {
    return selectedCredits.reduce((total, creditId) => {
      const credit = availableCredits.find(c => c.id === creditId);
      return total + (credit ? credit.amount * credit.pricePerMWh : 0);
    }, 0);
  };

  const getTotalSelectedAmount = () => {
    return selectedCredits.reduce((total, creditId) => {
      const credit = availableCredits.find(c => c.id === creditId);
      return total + (credit ? credit.amount : 0);
    }, 0);
  };

  const handlePurchase = () => {
    console.log('Purchasing credits:', selectedCredits);
    setShowPurchaseModal(false);
    setSelectedCredits([]);
  };

  const handleRetire = (creditId) => {
    console.log('Retiring credit:', creditId);
  };

  const totalRetiredCredits = retiredCredits.reduce((sum, credit) => sum + credit.amount, 0);
  const totalCO2Reduction = retiredCredits.reduce((sum, credit) => sum + credit.co2Reduction, 0);
  const avgPrice = availableCredits.reduce((sum, credit) => sum + credit.pricePerMWh, 0) / availableCredits.length;

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
            Credit Marketplace
          </motion.h1>
          <p className="text-gray-600">
            Purchase and retire green hydrogen credits for your sustainability goals.
          </p>
        </div>
        {selectedCredits.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setShowPurchaseModal(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center group shadow-lg"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Purchase ({selectedCredits.length})
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </motion.button>
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
            title="Available Credits"
            value={availableCredits.length.toString()}
            icon={ShoppingCart}
            color="blue"
            subtitle="Ready for purchase"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DashboardCard
            title="Credits Retired"
            value={totalRetiredCredits.toLocaleString()}
            icon={Award}
            trend="up"
            trendValue="+25.3%"
            color="green"
            subtitle="MWh retired"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DashboardCard
            title="CO₂ Reduced"
            value={`${totalCO2Reduction.toFixed(1)}t`}
            icon={Leaf}
            trend="up"
            trendValue="+18.7%"
            color="green"
            subtitle="Total carbon offset"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DashboardCard
            title="Avg Price"
            value={`$${avgPrice.toFixed(2)}`}
            icon={DollarSign}
            trend="down"
            trendValue="-3.2%"
            color="orange"
            subtitle="Per MWh"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Carbon Offset Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Chart
            type="area"
            data={carbonOffsetData}
            xKey="name"
            yKey="value"
            color="#10b981"
            title="Carbon Offset Progress (tonnes CO₂)"
            gradient={true}
            height={300}
          />
        </motion.div>

        {/* Retired Credits Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recently Retired</h3>
          <div className="space-y-4">
            {retiredCredits.map((credit, index) => (
              <div key={credit.id} className="border-l-4 border-green-400 pl-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{credit.id}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(credit.retiredDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {credit.amount.toLocaleString()} MWh • {credit.co2Reduction}t CO₂
                </div>
                <div className="text-xs text-gray-500 mt-1">{credit.purpose}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Marketplace */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <h3 className="text-lg font-semibold text-gray-900">Available Credits</h3>
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search credits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Sources</option>
                <option value="solar">Solar</option>
                <option value="wind">Wind</option>
                <option value="hydro">Hydro</option>
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
              className={`p-6 hover:bg-gray-50 transition-colors ${
                selectedCredits.includes(credit.id) ? 'bg-blue-50 border-l-4 border-blue-400' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedCredits.includes(credit.id)}
                    onChange={() => toggleCreditSelection(credit.id)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-medium text-gray-900">{credit.id}</span>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {credit.certification}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {credit.source}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
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
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Leaf className="w-4 h-4 mr-1 text-green-500" />
                      <span>Reduces {credit.co2Reduction}t CO₂</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    ${(credit.amount * credit.pricePerMWh).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    ${credit.pricePerMWh}/MWh
                  </div>
                  <button
                    onClick={() => handleRetire(credit.id)}
                    className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Quick Retire
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Purchase Summary</h3>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Selected Credits:</span>
                  <span className="font-medium">{selectedCredits.length}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">{getTotalSelectedAmount().toLocaleString()} MWh</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Price:</span>
                  <span>${getTotalSelectedValue().toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                {selectedCredits.map(creditId => {
                  const credit = availableCredits.find(c => c.id === creditId);
                  return credit ? (
                    <div key={creditId} className="flex justify-between text-sm">
                      <span>{credit.id} ({credit.amount} MWh)</span>
                      <span>${(credit.amount * credit.pricePerMWh).toLocaleString()}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                Confirm Purchase
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Buyer;
