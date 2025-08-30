import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart,
  Filter,
  Search,
  Star,
  MapPin,
  CheckCircle,
  TrendingUp,
  Leaf,
  Eye,
  Plus,
  Minus
} from 'lucide-react';

const Marketplace = () => {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price_asc');
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    // Mock marketplace data
    setCredits([
      {
        _id: '1',
        creditId: 'HC-2025-001-ABC123',
        producer: {
          name: 'SolarMax Energy',
          rating: 4.8,
          verified: true,
          location: 'California, USA'
        },
        energyAmountMWh: 150.5,
        energySource: 'Solar',
        facilityName: 'Desert Solar Farm Alpha',
        productionDate: '2025-01-10',
        pricePerMWh: 45.50,
        totalPrice: 6847.75,
        environmentalImpact: {
          co2Avoided: 85.2,
          treesEquivalent: 425
        },
        qualityScore: 96,
        vintage: 2025,
        available: 150.5,
        description: 'Premium solar hydrogen credits from state-of-the-art facility',
        certifier: 'TrustVerify Authority'
      },
      {
        _id: '2',
        creditId: 'HC-2025-002-DEF456',
        producer: {
          name: 'WindPower Corp',
          rating: 4.6,
          verified: true,
          location: 'Texas, USA'
        },
        energyAmountMWh: 200.0,
        energySource: 'Wind',
        facilityName: 'Coastal Wind Farm Beta',
        productionDate: '2025-01-08',
        pricePerMWh: 42.25,
        totalPrice: 8450.00,
        environmentalImpact: {
          co2Avoided: 113.0,
          treesEquivalent: 565
        },
        qualityScore: 94,
        vintage: 2025,
        available: 200.0,
        description: 'High-quality wind hydrogen with excellent carbon metrics',
        certifier: 'SecureCheck Systems'
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

  const getQualityColor = (score) => {
    if (score >= 95) return 'text-green-600 bg-green-100';
    if (score >= 90) return 'text-blue-600 bg-blue-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const addToCart = (credit, quantity = 1) => {
    const existingItem = cart.find(item => item._id === credit._id);
    if (existingItem) {
      setCart(cart.map(item => 
        item._id === credit._id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...credit, quantity }]);
    }
    setQuantities({ ...quantities, [credit._id]: 1 });
  };

  const updateQuantity = (creditId, newQuantity) => {
    if (newQuantity <= 0) {
      setQuantities({ ...quantities, [creditId]: 1 });
      return;
    }
    setQuantities({ ...quantities, [creditId]: newQuantity });
  };

  const filteredCredits = credits.filter(credit => {
    const matchesFilter = filter === 'all' || credit.energySource.toLowerCase() === filter.toLowerCase();
    const matchesSearch = 
      credit.creditId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credit.producer.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.pricePerMWh * item.quantity), 0);
  const cartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-300 rounded-2xl"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Credit Marketplace</h1>
          <p className="text-gray-600">Discover and purchase verified hydrogen credits from trusted producers.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-600" />
            {cartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems}
              </span>
            )}
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            View Cart ${cartTotal.toFixed(2)}
          </button>
        </div>
      </motion.div>

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
                <option value="all">All Energy Sources</option>
                <option value="solar">Solar</option>
                <option value="wind">Wind</option>
                <option value="hydro">Hydro</option>
                <option value="nuclear">Nuclear</option>
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

      {/* Credits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCredits.map((credit, index) => (
          <motion.div
            key={credit._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{getSourceIcon(credit.energySource)}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{credit.creditId}</h3>
                    <p className="text-sm text-gray-600">{credit.energySource} Energy</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(credit.qualityScore)}`}>
                  {credit.qualityScore}% Quality
                </span>
              </div>

              {/* Producer Info */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{credit.producer.name}</h4>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{credit.producer.rating}</span>
                    {credit.producer.verified && (
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{credit.producer.location}</span>
                </div>
              </div>

              {/* Credit Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Energy Amount</p>
                  <p className="font-medium">{credit.energyAmountMWh} MWh</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">CO₂ Avoided</p>
                  <p className="font-medium">{credit.environmentalImpact.co2Avoided} tons</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">${credit.pricePerMWh}/MWh</p>
                    <p className="text-sm text-gray-600">Total: ${credit.totalPrice.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">Trending</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Environmental Impact */}
              <div className="mb-4 p-3 bg-green-50 rounded-lg">
                <h5 className="font-medium text-green-900 mb-2 flex items-center">
                  <Leaf className="w-4 h-4 mr-2" />
                  Environmental Impact
                </h5>
                <div className="text-sm">
                  <span className="text-green-700">Trees Equivalent:</span>
                  <span className="font-medium text-green-900 ml-1">{credit.environmentalImpact.treesEquivalent}</span>
                </div>
              </div>

              {/* Purchase Controls */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(credit._id, (quantities[credit._id] || 1) - 1)}
                    className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={credit.available}
                    value={quantities[credit._id] || 1}
                    onChange={(e) => updateQuantity(credit._id, parseInt(e.target.value) || 1)}
                    className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <button
                    onClick={() => updateQuantity(credit._id, (quantities[credit._id] || 1) + 1)}
                    className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600">MWh</span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedCredit(credit)}
                    className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Details
                  </button>
                  <button
                    onClick={() => addToCart(credit, quantities[credit._id] || 1)}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Credit Detail Modal */}
      {selectedCredit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Credit Details</h2>
                <button
                  onClick={() => setSelectedCredit(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Credit Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Credit ID</label>
                      <p className="text-lg font-semibold">{selectedCredit.creditId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Energy Source</label>
                      <p>{selectedCredit.energySource}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Energy Amount</label>
                      <p>{selectedCredit.energyAmountMWh} MWh</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Description</label>
                      <p>{selectedCredit.description}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Producer Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Producer</label>
                      <div className="flex items-center space-x-2">
                        <p>{selectedCredit.producer.name}</p>
                        {selectedCredit.producer.verified && (
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Facility</label>
                      <p>{selectedCredit.facilityName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p>{selectedCredit.producer.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setSelectedCredit(null)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    addToCart(selectedCredit, quantities[selectedCredit._id] || 1);
                    setSelectedCredit(null);
                  }}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
